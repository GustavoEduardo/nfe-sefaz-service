import { Injectable } from '@nestjs/common';
import { SefazMock } from './sefaz.mock';

@Injectable()
export class SefazService {
  async sendNfe(xml: string) {
    // lógica futura de integração real
    return SefazMock.sendNfe(xml);
  }
}
