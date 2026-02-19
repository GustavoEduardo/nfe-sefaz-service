import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { isValidCnpj } from 'src/shared/utils/cnpj.validator';
import { SefazService } from 'src/integrations/sefaz.service';
import { CreateNfeDto } from './dto/create-nfe.dto';
import { buildNfeXml } from 'src/shared/xml/xml.generator';
import { validateXml } from 'src/shared/xml/xml.validator';

@Injectable()
export class NfeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sefazService: SefazService,) {}

  async create(dto: CreateNfeDto) {

    if (!isValidCnpj(dto.customerCnpj)) {
      throw new BadRequestException('CNPJ inválido');
    }

    // Cria ou atualiza cliente
    const customer = await this.prisma.customer.upsert({
      where: { cnpj: dto.customerCnpj },
      create: {
        name: dto.customerName,
        cnpj: dto.customerCnpj,
        ie: dto.customerIe,
      },
      update: {
        name: dto.customerName,
        ie: dto.customerIe,
      },
    });

    // Calcula itens
    const items = dto.items.map((item) => {
      const unitPrice = new Prisma.Decimal(item.unitPrice);
      const total = unitPrice.mul(item.quantity);

      return {
        name: item.name,
        quantity: item.quantity,
        unitPrice,
        total,
      };
    });

    const totalValue = items.reduce(
      (acc, item) => acc.add(item.total),
      new Prisma.Decimal(0),
    );

    // Cria NF-e
    const nfe = await this.prisma.nfe.create({
      data: {
        customerId: customer.id,
        cfop: dto.cfop,
        cst: dto.cst,
        status: 'PROCESSING',
        totalValue,
        items: {
          createMany: { data: items },
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    // Gera XML
    const xml = buildNfeXml({
      nfeId: nfe.id,
      customer: {
        name: nfe.customer.name,
        cnpj: nfe.customer.cnpj,
        ie: nfe.customer.ie,
      },
      cfop: nfe.cfop,
      cst: nfe.cst,
      items: nfe.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice.toString(),
      })),
      totalValue: nfe.totalValue.toString(),
    });

    // Salva XML
    await this.prisma.nfe.update({
      where: { id: nfe.id },
      data: { xml },
    });

    setImmediate(() => this.processNfe(nfe.id, xml));

    return {
      id: nfe.id,
      status: 'PROCESSING',
    };
  }

  private async processNfe(nfeId: string, xml: string) {
    try {
      validateXml(xml);

      const response = await this.sefazService.sendNfe(xml);

      await this.prisma.nfe.update({
        where: { id: nfeId },
        data: response.authorized
          ? {
              status: 'AUTHORIZED',
              protocol: response.protocol,
              rejectionMsg: null,
            }
          : {
              status: 'REJECTED',
              rejectionMsg: response.reason,
            },
      });
    } catch (error) {
       console.error('Erro no processamento da NF-e:', error);
        // Sugestão de status ERROR
        // Assim a nota não fica como rejeitada por erro técnico
        await this.prisma.nfe.update({
        where: { id: nfeId },
        data: {
          status: 'ERROR',
          rejectionMsg:
            error instanceof Error
              ? error.message
              : 'Erro técnico durante a comunicação com SEFAZ',
        },
      });
    }
  }

  async findById(id: string) {
    const nfe = await this.prisma.nfe.findUnique({
      where: { id },
    });

    if (!nfe) {
      throw new NotFoundException('NF-e não encontrada');
    }

    return {
      id: nfe.id,
      status: nfe.status,
      protocol: nfe.protocol,
      rejectionMsg: nfe.rejectionMsg,
      totalValue: nfe.totalValue,
      createdAt: nfe.createdAt,
    };
  }

  async getXml(id: string) {
    const nfe = await this.prisma.nfe.findUnique({
      where: { id },
      select: { status: true, xml: true },
    });

    if (!nfe) {
      throw new NotFoundException('NF-e não encontrada');
    }

    if (nfe.status !== 'AUTHORIZED') {
      throw new BadRequestException(
        'XML só pode ser obtido quando a NF-e estiver AUTORIZADA.',
      );
    }

    return nfe.xml;
  }
}
