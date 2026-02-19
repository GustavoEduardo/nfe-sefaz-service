import { Controller, Get, Param, Post, Body, Res } from "@nestjs/common";
import { CreateNfeDto } from "./dto/create-nfe.dto";
import express from "express";
import { NfeService } from "./nfe.service";

@Controller("nfe")
export class NfeController {
  constructor(private readonly nfeService: NfeService) {}

  @Post()
  async create(@Body() dto: CreateNfeDto) {
    return this.nfeService.create(dto);
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.nfeService.findById(id);
  }

  @Get(":id/xml")
  async getXml(@Param("id") id: string, @Res() res: express.Response) {
    const xml = await this.nfeService.getXml(id);

    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  }
}
