import {
  IsArray,
  ArrayMinSize,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  Matches,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateNfeItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codigo: string; // cProd

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string; // xProd

  @ApiProperty()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'NCM deve ter 8 dígitos numéricos' })
  ncm: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unidade: string; // uCom

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number; // qCom

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  unitPrice: number; // vUnCom

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  total: number; // vProd
}

export class CreateNfeDto {

  // Identificação da NF-e

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  naturezaOperacao: string; // natOp

  @ApiProperty()
  @IsInt()
  @Min(1)
  numero: number; // nNF

  @ApiProperty()
  @IsInt()
  @Min(1)
  serie: number; // serie

  @ApiProperty()
  @IsDateString()
  dataEmissao: string; // dhEmi

  // Destinatário

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerName: string; // xNome

  @ApiProperty()
  @IsString()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve ter 14 dígitos numéricos' })
  customerCnpj: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  customerIe?: string;

  // Tributação simplificada

  @ApiProperty()
  @IsString()
  @Matches(/^\d{4}$/, { message: 'CFOP deve ter 4 dígitos' })
  cfop: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d{2,3}$/, { message: 'CST deve ter 2 ou 3 dígitos' })
  cst: string;

  // Totais

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valorTotal: number;

  // Itens

  @ApiProperty({ type: () => CreateNfeItemDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateNfeItemDto)
  items: CreateNfeItemDto[];
}