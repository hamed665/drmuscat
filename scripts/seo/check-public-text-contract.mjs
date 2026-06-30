import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const scanTargets = [
  'public/llms.txt',
  'src/app/robots.ts',
  'src/app/sitemap.ts',
  'src/app/[locale]/[country]/page.tsx',
  'src/app/[locale]/[country]/doctors/page.tsx',
  'src/app/[locale]/[country]/doctor/[doctorSlug]/page.tsx',
  'src/app/[locale]/[country]/center/[centerSlug]/page.tsx',
  'src/app/[locale]/[country]/centers/page.tsx',
  'src/app/[locale]/[country]/labs/page.tsx',
  'src/app/[locale]/[country]/pharmacies/page.tsx',
  'src/app/[locale]/[country]/pharmacies/[pharmacySlug]/page.tsx',
  'src/app/[locale]/[country]/hospitals/page.tsx',
  'src/app/[locale]/[country]/services/page.tsx',
  'src/app/[locale]/[country]/search/page.tsx',
  'src/app/[locale]/[country]/for-providers/page.tsx',
  'src/app/[locale]/[country]/for-providers/page-content.tsx',
  'src/app/[locale]/[country]/dental/page.tsx',
  'src/app/[locale]/[country]/beauty/page.tsx',
  'src/app/[locale]/[country]/offers/page.tsx',
  'src/app/[locale]/[country]/pet-clinics/page.tsx',
  'src/app/[locale]/[country]/pet-shops/page.tsx',
  'src/app/[locale]/[country]/articles/page.tsx',
  'src/app/[locale]/[country]/articles/[slug]/page.tsx',
  'src/app/[locale]/[country]/source-policy/page.tsx',
  'src/components/brand',
  'src/components/home',
  'src/components/layout',
  'src/components/public',
  'src/lib/articles',
  'src/lib/routes/public.ts',
  'src/lib/seo/site.ts',
  'src/lib/seo/metadata.ts',
  'src/lib/seo/geo-route-metadata.ts',
  'src/lib/seo/oman-geo-gated-metadata.ts',
  'src/lib/seo/jsonld.ts',
  'src/lib/seo/faq-jsonld.ts',
  'src/lib/seo/page-registry.ts'
];

const textFileExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.md', '.txt']);
const ignoredDirectoryNames = new Set(['.git', '.next', 'node_modules']);

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

async function safeStat(relativePath) {
  try {
    return await stat(path.join(root, relativePath));
  } catch {
    return null;
  }
}

async function collectTextFiles(relativePath) {
  const stats = await safeStat(relativePath);
  if (stats === null) {
    throw new Error(`Missing required public text scan target: ${relativePath}`);
  }

  if (stats.isFile()) {
    return textFileExtensions.has(path.extname(relativePath)) ? [relativePath] : [];
  }

  if (!stats.isDirectory()) return [];

  const entries = await readdir(path.join(root, relativePath), { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isDirectory() && ignoredDirectoryNames.has(entry.name)) continue;
    files.push(...await collectTextFiles(path.join(relativePath, entry.name)));
  }

  return files;
}

function assertNoBlockedText(relativePath, source) {
  for (const value of blockedValues) {
    if (source.includes(value)) {
      throw new Error(`${relativePath} contains previous public brand text: ${value}`);
    }
  }
}

const files = [...new Set((await Promise.all(scanTargets.map(collectTextFiles))).flat())].sort();

for (const file of files) {
  const source = await readText(file);
  assertNoBlockedText(file, source);
}

console.log(`public text contract check passed for ${files.length} public surface files.`);
