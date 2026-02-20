import { create } from 'xmlbuilder2';

export function buildNfeXml(data: any) {
  const root = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('NFe');

  const infNFe = root.ele('infNFe');

  // IDE
  infNFe.ele('ide')
    .ele('natOp').txt(data.naturezaOperacao).up()
    .ele('nNF').txt(data.numero.toString()).up()
    .ele('serie').txt(data.serie.toString()).up()
    .ele('dhEmi').txt(data.dataEmissao).up()
  .up();

  // EMIT
  infNFe.ele('emit')
    .ele('CNPJ').txt('12345678000199').up()
  .up();

  // DEST
  const dest = infNFe.ele('dest');
  dest.ele('xNome').txt(data.customer.name).up();
  dest.ele('CNPJ').txt(data.customer.cnpj).up();

  if (data.customer.ie) {
    dest.ele('IE').txt(data.customer.ie).up();
  }

  dest.up();

  // DET (itens)
  data.items.forEach((item) => {
    infNFe.ele('det')
      .ele('cProd').txt(item.codigo).up()
      .ele('xProd').txt(item.name).up()
      .ele('NCM').txt(item.ncm).up()
      .ele('CFOP').txt(data.cfop).up()
      .ele('CST').txt(data.cst).up()
      .ele('uCom').txt(item.unidade).up()
      .ele('qCom').txt(item.quantity.toString()).up()
      .ele('vUnCom').txt(item.unitPrice.toFixed(2)).up()
      .ele('vProd').txt(item.total.toFixed(2)).up()
    .up();
  });

  // TOTAL
  infNFe.ele('total')
    .ele('vNF').txt(data.totalValue.toFixed(2)).up()
  .up();

  return root.end({ prettyPrint: true });
}
