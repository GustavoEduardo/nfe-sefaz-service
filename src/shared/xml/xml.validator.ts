import * as path from 'path';
import * as fs from 'fs';
import * as libxml from 'libxmljs2';

export function validateXml(xml: string): void {
  const xsdPath = path.join(__dirname, 'nfe.xsd');

  const xsd = fs.readFileSync(xsdPath, 'utf-8');
  const xsdDoc = libxml.parseXml(xsd);
  const xmlDoc = libxml.parseXml(xml);

  if (!xmlDoc.validate(xsdDoc)) {
    throw new Error(
      xmlDoc.validationErrors.map((e) => e.message).join(', '),
    );
  }
}
