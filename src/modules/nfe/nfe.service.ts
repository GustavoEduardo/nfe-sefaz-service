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
import { Logger } from '@nestjs/common';

@Injectable()
export class NfeService {
  private readonly logger = new Logger(NfeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sefazService: SefazService,
  ) {}

 async create(dto: CreateNfeDto) {
  this.logger.log('Iniciando criação da NF-e', { dto: { numero: dto.numero, serie: dto.serie } });

  // Validações
  if (!isValidCnpj(dto.customerCnpj)) {
    this.logger.warn('CNPJ inválido', { cnpj: dto.customerCnpj });
    throw new BadRequestException('CNPJ inválido');
  }

  dto.items.forEach((item) => {
    const expected = item.quantity * item.unitPrice;

    if (Number(expected.toFixed(2)) !== Number(item.total.toFixed(2))) {
      this.logger.warn('Valor total da NF-e não confere', { totalCalculado, valorDto: dto.valorTotal });
      throw new BadRequestException(
        `Total inválido para o produto ${item.codigo}`,
      );
    }
  });

  this.logger.log('Validações concluídas com sucesso', { numero: dto.numero, serie: dto.serie });

  const totalCalculado = dto.items.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  if (
    Number(totalCalculado.toFixed(2)) !==
    Number(dto.valorTotal.toFixed(2))
  ) {
    throw new BadRequestException(
      'Valor total da NF-e não confere com os itens',
    );
  }

  const existing = await this.prisma.nfe.findFirst({
    where: {
      numero: dto.numero,
      serie: dto.serie,
    },
  });

  if (existing) {
    throw new BadRequestException(
      'Já existe uma NF-e com esse número e série',
    );
  }

  // Busca ou cria cliente
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

  // Gera XML
  const xml = buildNfeXml({
    naturezaOperacao: dto.naturezaOperacao,
    numero: dto.numero,
    serie: dto.serie,
    dataEmissao: dto.dataEmissao,

    customer: {
      name: customer.name,
      cnpj: customer.cnpj,
      ie: customer.ie,
    },

    cfop: dto.cfop,
    cst: dto.cst,
    items: dto.items,
    totalValue: dto.valorTotal,
  });

  // Valida XML
  validateXml(xml);

  // Salva no banco
  const nfe = await this.prisma.$transaction(async (tx) => {

    const created = await tx.nfe.create({
      data: {
        naturezaOperacao: dto.naturezaOperacao,
        numero: dto.numero,
        serie: dto.serie,
        dataEmissao: new Date(dto.dataEmissao),

        customerId: customer.id,
        cfop: dto.cfop,
        cst: dto.cst,
        status: 'PROCESSING',
        totalValue: new Prisma.Decimal(dto.valorTotal),
        xml,
        items: {
          createMany: {
            data: dto.items.map((item) => ({
              codigo: item.codigo,
              name: item.name,
              ncm: item.ncm,
              unidade: item.unidade,
              quantity: item.quantity,
              unitPrice: new Prisma.Decimal(item.unitPrice),
              total: new Prisma.Decimal(item.total),
            })),
          },
        },
      },
    });

    return created;
  });

  // Processamento assíncrono no service da sefaz
  setImmediate(() => this.processNfe(nfe.id, xml));

  return {
    id: nfe.id,
    status: 'PROCESSING',
  };
}

  private async processNfe(nfeId: string, xml: string) {
    try {
      this.logger.log('Enviando NF-e para SEFAZ', { nfeId });

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

      this.logger.log('Processamento da NF-e concluído', {
        nfeId,
        status: response.authorized ? 'AUTHORIZED' : 'REJECTED',
      });
    } catch (error) {
      this.logger.error('Erro no processamento da NF-e', error, { nfeId });

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
    this.logger.log('Buscando NF-e por ID', { nfeId: id });

    const nfe = await this.prisma.nfe.findUnique({
      where: { id },
    });

    if (!nfe) {
      this.logger.warn('NF-e não encontrada', { nfeId: id });
      throw new NotFoundException('NF-e não encontrada');
    }

    this.logger.log('NF-e encontrada', { nfeId: id, status: nfe.status });
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

    this.logger.log('Obtendo XML da NF-e', { nfeId: id });
    const nfe = await this.prisma.nfe.findUnique({
      where: { id },
      select: { status: true, xml: true },
    });

    if (!nfe) {
      this.logger.warn('NF-e não encontrada para XML', { nfeId: id });
      throw new NotFoundException('NF-e não encontrada');
    }

    if (nfe.status !== 'AUTHORIZED') {
      this.logger.warn('Tentativa de obter XML não autorizado', { nfeId: id, status: nfe.status });
      throw new BadRequestException(
        'XML só pode ser obtido quando a NF-e estiver AUTORIZADA.',
      );
    }

    this.logger.log('XML da NF-e retornado', { nfeId: id });
    return nfe.xml;
  }
}