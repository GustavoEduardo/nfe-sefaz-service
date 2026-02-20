import { Controller, Get, Param, Post, Body, Res } from "@nestjs/common";
import { CreateNfeDto } from "./dto/create-nfe.dto";
import express from "express";
import { NfeService } from "./nfe.service";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller("nfe")
export class NfeController {
  constructor(private readonly nfeService: NfeService) {}

  // ---------------------------
  @Post()
  @ApiOperation({
    summary: 'Cria uma NFe no banco e inicia o processo de emissão.',
  })
  @ApiBody({ type: CreateNfeDto })
  @ApiResponse({
    status: 201,
    description: 'NF-e criada com sucesso e enviada para processamento.',
    schema: {
      example: {
        id: "a3f9c2e1-7d45-4b1e-9f9c-123456789abc",
        status: "PROCESSING"
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos dados enviados.',
    schema: {
      example: {
        statusCode: 400,
        message: "Valor total da NF-e não confere com os itens",
        error: "Bad Request"
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'NF-e com número e série já existente.',
    schema: {
      example: {
        statusCode: 400,
        message: "Já existe uma NF-e com esse número e série",
        error: "Bad Request"
      }
    }
  })
  async create(@Body() dto: CreateNfeDto) {
    return this.nfeService.create(dto);
  }

  // ---------------------------
  @Get(":id")
  @ApiOperation({
    summary: 'Retorna o status atual da NFe pelo id.',
  })
  @ApiParam({ name: 'id', description: 'ID da NFe' })
  @ApiResponse({
    status: 200,
    description: 'NF-e encontrada com sucesso.',
    schema: {
      example: {
        id: "a3f9c2e1-7d45-4b1e-9f9c-123456789abc",
        numero: 5,
        serie: 1,
        status: "AUTHORIZED",
        protocol: "135260000000000",
        rejectionMsg: null,
        createdAt: "2026-02-19T14:20:00.000Z"
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'NF-e não encontrada.',
    schema: {
      example: {
        statusCode: 404,
        message: "NF-e não encontrada",
        error: "Not Found"
      }
    }
  })
  async findById(@Param("id") id: string) {
    return this.nfeService.findById(id);
  }

  // ---------------------------
  @Get(":id/xml")
  @ApiOperation({
    summary: 'Retorna o XML da NFe autorizada pelo id.',
  })
  @ApiParam({ name: 'id', description: 'ID da NFe' })
  @ApiResponse({
    status: 200,
    description: 'XML retornado com sucesso.',
    content: {
      'application/xml': {
        example: `<?xml version="1.0" encoding="UTF-8"?>
                  <NFe>
                    <infNFe>
                      <ide>
                        <natOp>Venda de mercadoria</natOp>
                        <nNF>5</nNF>
                        <serie>1</serie>
                        <dhEmi>2026-02-20T09:30:00.000Z</dhEmi>
                      </ide>
                      ...
                    </infNFe>
                  </NFe>`
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'NF-e ainda não autorizada.',
    schema: {
      example: {
        statusCode: 400,
        message: "XML disponível apenas para NF-e autorizada",
        error: "Bad Request"
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'NF-e não encontrada.',
    schema: {
      example: {
        statusCode: 404,
        message: "NF-e não encontrada",
        error: "Not Found"
      }
    }
  })
  async getXml(@Param("id") id: string, @Res() res: express.Response) {
    const xml = await this.nfeService.getXml(id);

    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  }
}
