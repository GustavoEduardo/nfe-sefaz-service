import { Injectable } from '@nestjs/common';
import { SefazMock } from './sefaz.mock';

@Injectable()
export class SefazService {
  async sendNfe(xml: string) {
    // Futuramente aqui entraria:
    // - Assinatura digital
    // - Envelope SOAP
    // - Comunicação com WebService oficial
    // - Tratamento de retorno
    return SefazMock.sendNfe(xml);
  }

}
