import { randomUUID } from "crypto";

export type SefazResponse =
  | { authorized: true; protocol: string }
  | { authorized: false; reason: string };

export class SefazMock {
  static async sendNfe(xml: string): Promise<SefazResponse> {
    await new Promise((r) => setTimeout(r, 1200));

    // Regra fake. Autorizar 80% das notas. 
    const random = Math.random();

    if (random < 0.2) {
      return {
        authorized: false,
        reason: "Rejeição SEFAZ: CFOP inválido para operação",
      };
    }

    return {
      authorized: true,
      protocol: `PROT-${randomUUID()}`,
    };
  }
}
