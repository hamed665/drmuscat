import { readFile } from 'node:fs/promises';
import path from 'node:path';

const source = await readFile(path.join(process.cwd(), 'middleware.ts'), 'utf8');

for (const token of [
  'importedHospitalDetailPattern',
  '/hospitals/',
  'status: 404',
  'x-drkhaleej-public-hold',
  'noindex, nofollow',
  'matcher: ["/:locale/om/hospitals/:slug*"]',
]) {
  if (!source.includes(token)) throw new Error(`middleware hospital hold missing ${token}`);
}

console.log('imported hospital middleware hold check passed.');
