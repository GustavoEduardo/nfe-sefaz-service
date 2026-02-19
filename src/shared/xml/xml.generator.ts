import { create } from 'xmlbuilder2';

export function buildNfeXml(data: {
  nfeId: string;
  customer: { name: string; cnpj: string; ie?: string | null };
  cfop: string;
  cst: string;
  items: Array<{ name: string; quantity: number; unitPrice: string }>;
  totalValue: string;
}) {
  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('NFe')

      // EMITENTE
      .ele('emit')
        .ele('CNPJ')
          .txt('12345678000199')
        .up()
      .up()

      // DESTINATÁRIO
      .ele('dest')
        .ele('CNPJ')
          .txt(data.customer.cnpj)
        .up()
      .up()

      // DETALHES FISCAIS
      .ele('detalhes')
        .ele('cfop')
          .txt(data.cfop)
        .up()
        .ele('cst')
          .txt(data.cst)
        .up()
      .up()

      // TOTAL
      .ele('total')
        .ele('vNF')
          .txt(data.totalValue)
        .up()
      .up();

  return doc.end({ prettyPrint: true });
}
