import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const files = [
  'src/app/[locale]/[country]/for-providers/page-content.tsx',
  'src/components/public/discovery/publicDiscoveryPageConfig.ts'
];

const blockedParts = [
  ['Dr', 'Muscat'],
  ['Dr ', 'Muscat'],
  ['Doc', 'tor ', 'Muscat'],
  [String.fromCharCode(1583, 1705, 1578, 1585), ' ', String.fromCharCode(1605, 1587, 1602, 1591)],
  [String.fromCharCode(1583, 1603, 1578, 1608, 1585), ' ', String.fromCharCode(1605, 1587, 1602, 1591)],
  [String.fromCharCode(1583), '.', ' ', String.fromCharCode(1605, 1587, 1602, 1591)]
];

const blockedValues = blockedParts.map((parts) => parts.join(''));

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function assertNoBlockedText(relativePath, source) {
  for (const value of blockedValues) {
    if (source.includes(value)) {
      throw new Error(`${relativePath} contains previous public name text.`);
    }
  }
}

for (const file of files) {
  const source = await readText(file);
  assertNoBlockedText(file, source);
}

console.log(`cleaned public source brand check passed for ${files.length} files.`);
