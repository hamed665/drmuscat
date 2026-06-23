import fs from 'node:fs';

const geoPath = 'src/config/geo/oman.ts';
const contractPath = 'src/config/geo/route-contract.ts';

const expectedRouteNames = [
  'oman-governorate',
  'oman-wilayat',
  'oman-area',
];

const expectedRouteFiles = [
  'src/app/[locale]/[country]/oman/governorates/[governorateSlug]/page.tsx',
  'src/app/[locale]/[country]/oman/wilayats/[wilayatSlug]/page.tsx',
  'src/app/[locale]/[country]/oman/areas/[areaSlug]/page.tsx',
];

function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

function section(source, exportName) {
  const marker = `export const ${exportName}`;
  const start = source.indexOf(marker);
  if (start === -1) return '';

  const nextExport = source.indexOf('\nexport const ', start + marker.length);
  return source.slice(start, nextExport === -1 ? source.length : nextExport);
}

function countRegistryItems(source, exportName) {
  return section(source, exportName)
    .split('\n')
    .filter((line) => line.includes("slug: '")).length;
}

function collectProp(source, prop) {
  return [...source.matchAll(new RegExp(`${prop}: '([^']+)'`, 'g'))].map((match) => match[1]);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const geoSource = readFile(geoPath);
const contractSource = readFile(contractPath);

assert(contractSource.includes("status: 'runtime-scaffold'"), 'Route contract must be runtime-scaffold.');
assert(contractSource.includes('runtimeRoutesEnabled: true'), 'Runtime routes must be enabled by this scaffold.');
assert(contractSource.includes('metadataEnabled: false'), 'Metadata must remain disabled in this scaffold.');
assert(contractSource.includes('sitemapEnabled: false'), 'Sitemap must remain disabled in this scaffold.');
assert(contractSource.includes('jsonLdEnabled: false'), 'JSON-LD must remain disabled in this scaffold.');

const routeNames = collectProp(contractSource, 'routeName');
const duplicateRouteNames = routeNames.filter((routeName, index) => routeNames.indexOf(routeName) !== index);

assert(duplicateRouteNames.length === 0, `Duplicate route names: ${duplicateRouteNames.join(', ')}`);

for (const routeName of expectedRouteNames) {
  assert(routeNames.includes(routeName), `Missing route template: ${routeName}`);
}

for (const routeFile of expectedRouteFiles) {
  assert(contractSource.includes(`routeFile: '${routeFile}'`), `Missing route file in contract: ${routeFile}`);

  const routeSource = readFile(routeFile);
  assert(routeSource.includes('notFound'), `Route file must guard invalid params: ${routeFile}`);
  assert(!routeSource.includes('generateMetadata'), `Route scaffold must not generate metadata yet: ${routeFile}`);
  assert(!routeSource.includes('sitemap'), `Route scaffold must not generate sitemap behavior yet: ${routeFile}`);
  assert(!routeSource.includes('jsonLd'), `Route scaffold must not generate JSON-LD yet: ${routeFile}`);
}

assert(contractSource.includes('/[locale]/[country]/oman/governorates/[governorateSlug]'), 'Missing governorate path template.');
assert(contractSource.includes('/[locale]/[country]/oman/wilayats/[wilayatSlug]'), 'Missing wilayat path template.');
assert(contractSource.includes('/[locale]/[country]/oman/areas/[areaSlug]'), 'Missing area path template.');

const summary = {
  governorates: countRegistryItems(geoSource, 'OMAN_GOVERNORATES'),
  wilayats: countRegistryItems(geoSource, 'OMAN_WILAYATS'),
  areas: countRegistryItems(geoSource, 'OMAN_AREAS'),
  routeTemplates: routeNames.length,
  routeFiles: expectedRouteFiles.length,
  runtimeRoutesEnabled: true,
  metadataEnabled: false,
  sitemapEnabled: false,
  jsonLdEnabled: false,
};

console.log('Oman geo runtime route scaffold validated.');
console.log(summary);
