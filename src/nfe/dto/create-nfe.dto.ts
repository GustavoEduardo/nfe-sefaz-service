import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  Matches,
  IsNumber,
  ArrayMinSize,
} from "class-validator";
import { Type } from "class-transformer";

class CreateNfeItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0.01)
  unitPrice: number;
}

export class CreateNfeDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$/, { message: "CNPJ deve ter 14 dígitos numéricos" })
  customerCnpj: string;

  @IsOptional()
  @IsString()
  customerIe?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, { message: "CFOP deve ter 4 dígitos" })
  cfop: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2,3}$/, { message: "CST deve ter 2 ou 3 dígitos" })
  cst: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateNfeItemDto)
  items: CreateNfeItemDto[];
}
