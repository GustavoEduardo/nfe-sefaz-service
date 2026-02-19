export function isValidCnpj(cnpj: string): boolean {
  const cleaned = cnpj.replace(/[^\d]+/g, '');

  if (cleaned.length !== 14) return false;

  if (/^(\d)\1+$/.test(cleaned)) return false;

  const calcCheckDigit = (base: string, weights: number[]) => {
    const sum = base
      .split('')
      .reduce((acc, digit, i) => acc + Number(digit) * weights[i], 0);

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = cleaned.slice(0, 12);
  const digit1 = calcCheckDigit(base, [5,4,3,2,9,8,7,6,5,4,3,2]);
  const digit2 = calcCheckDigit(
    base + digit1,
    [6,5,4,3,2,9,8,7,6,5,4,3,2]
  );

  return cleaned === base + digit1 + digit2;
}
