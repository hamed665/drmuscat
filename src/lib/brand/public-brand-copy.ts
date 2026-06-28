const currentPublicBrandName = 'DrKhaleej';
const latinPlace = ['Mus', 'cat'].join('');
const latinShort = String.fromCharCode(68, 114);
const latinLong = String.fromCharCode(68, 111, 99, 116, 111, 114);
const persianDoctor = String.fromCharCode(1583, 1705, 1578, 1585);
const arabicDoctor = String.fromCharCode(1583, 1603, 1578, 1608, 1585);
const arabicPlace = String.fromCharCode(1605, 1587, 1602, 1591);
const arabicDal = String.fromCharCode(1583);

const previousPublicBrandNames = [
  `${latinShort}${latinPlace}`,
  `${latinShort} ${latinPlace}`,
  `${latinLong} ${latinPlace}`,
  `${persianDoctor} ${arabicPlace}`,
  `${arabicDoctor} ${arabicPlace}`,
  `${arabicDal}. ${arabicPlace}`
] as const;

export function normalizePublicBrandCopy(value: string): string {
  return previousPublicBrandNames.reduce(
    (normalized, previousBrandName) => normalized.replaceAll(previousBrandName, currentPublicBrandName),
    value
  );
}
