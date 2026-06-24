import fs from 'node:fs';

const contractPath = 'src/config/geo/publication-gates-contract.ts';
const accessorPath = 'src/lib/geo/oman-publication-gates.ts';
const scaffoldPath = 'src/components/geo/oman-geo-runtime-scaffold.tsx';
const packagePath = 'package.json';
const routeFiles = [
  {
    path: 'src/app/[locale]/[country]/oman/governorates/[governorateSlug]/page.tsx',
    entity: 'governorate',
  },
  {
    path: 'src/app/[locale]/[country]/oman/wilayats/[wilayatSlug]/page.tsx',
    entity: 'wilayat',
  },
  {
    path: 'src/app/[locale]/[country]/oman/areas/[areaSlug]/page.tsx',
    entity: 'area',
  },
];
const expectedGateKeys = ['noindex-removal', 'sitemap-promotion', 'json-ld', 'index-promotion'];
const expectedRequirements = ['readiness-complete', 'review-approved', 'evidence-approved', 'technical-gate-enabled'];

function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

function sectionForEntity(source, entity) {
  const marker = `entity: '${entity}'`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return '';

  const start = source.lastIndexOf('{', markerIndex);
  const end = source.indexOf('\n  },', markerIndex);
  return source.slice(start, end === -1 ? source.length : end);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const contractSource = readFile(contractPath);
const accessorSource = readFile(accessorPath);
const scaffoldSource = readFile(scaffoldPath);
const packageSource = readFile(packagePath);

assert(contractSource.includes('OMAN_GEO_PUBLICATION_GATES_CONTRACT'), 'Missing publication gates contract export.');
assert(contractSource.includes('OMAN_GEO_PUBLICATION_GATE_ENTITY_CONTRACTS'), 'Missing publication gate entity contracts.');
assert(contractSource.includes("status: 'blocked-readiness'"), 'Publication gates must remain blocked on readiness.');
assert(contractSource.includes('publicationGateEnabled: false'), 'Publication gates must remain disabled.');
assert(!contractSource.includes('publicationGateEnabled: true'), 'Publication gates must not be enabled.');
assert(!contractSource.includes('noindexRemovalAllowed: true'), 'Noindex removal must not be allowed.');
assert(!contractSource.includes('sitemapPromotionAllowed: true'), 'Sitemap promotion must not be allowed.');
assert(!contractSource.includes('jsonLdAllowed: true'), 'JSON-LD must not be allowed.');
assert(!contractSource.includes('indexPromotionAllowed: true'), 'Index promotion must not be allowed.');
assert(contractSource.includes('allowedGateKeys: [] as const'), 'No publication gate keys may be enabled yet.');

for (const key of expectedGateKeys) {
  assert(contractSource.includes(`'${key}'`), `Missing gate key type: ${key}.`);
}

for (const requirement of expectedRequirements) {
  assert(contractSource.includes(`key: '${requirement}'`), `Missing publication requirement: ${requirement}.`);
}

for (const route of routeFiles) {
  const section = sectionForEntity(contractSource, route.entity);

  assert(section, `Missing publication gate contract for ${route.entity}.`);
  assert(section.includes("status: 'blocked-readiness'"), `Publication gate status must remain blocked for ${route.entity}.`);
  assert(section.includes('publicationGateEnabled: false'), `Publication gate must remain disabled for ${route.entity}.`);
  assert(section.includes('allowedGateKeys: [] as const'), `No gate key may be enabled for ${route.entity}.`);
  assert(section.includes('noindexRemovalAllowed: false'), `Noindex removal must be blocked for ${route.entity}.`);
  assert(section.includes('sitemapPromotionAllowed: false'), `Sitemap promotion must be blocked for ${route.entity}.`);
  assert(section.includes('jsonLdAllowed: false'), `JSON-LD must be blocked for ${route.entity}.`);
  assert(section.includes('indexPromotionAllowed: false'), `Index promotion must be blocked for ${route.entity}.`);
}

assert(accessorSource.includes('getOmanGeoPublicationGates'), 'Missing publication gates runtime accessor.');
assert(accessorSource.includes('getOmanGeoReadiness'), 'Publication gates accessor must read readiness.');
assert(accessorSource.includes('getOmanGeoPromotionReviewContract'), 'Publication gates accessor must read review workflow.');
assert(accessorSource.includes('getOmanGeoEvidenceRegistryEntityContract'), 'Publication gates accessor must read evidence registry entity contract.');
assert(accessorSource.includes('getOmanGeoEvidenceRegistryRuntimeState'), 'Publication gates accessor must read evidence registry state.');
assert(accessorSource.includes('readiness-incomplete'), 'Publication gates must block on incomplete readiness.');
assert(accessorSource.includes('promotion-review-not-approved'), 'Publication gates must block on missing review approval.');
assert(accessorSource.includes('evidence-registry-not-approved'), 'Publication gates must block on missing evidence approval.');
assert(accessorSource.includes('technical-publication-gate-disabled'), 'Publication gates must block on technical gate disabled.');
assert(accessorSource.includes('technicalGateEnabled = false'), 'Technical publication gate must remain disabled.');
assert(accessorSource.includes('noindexRemovalAllowed: false'), 'Runtime accessor must keep noindex removal blocked.');
assert(accessorSource.includes('sitemapPromotionAllowed: false'), 'Runtime accessor must keep sitemap promotion blocked.');
assert(accessorSource.includes('jsonLdAllowed: false'), 'Runtime accessor must keep JSON-LD blocked.');
assert(accessorSource.includes('indexPromotionAllowed: false'), 'Runtime accessor must keep index promotion blocked.');

assert(scaffoldSource.includes('OmanGeoPublicationGatesRuntimeState'), 'Runtime scaffold must accept publication gate state.');
assert(scaffoldSource.includes('publicationGates?: OmanGeoPublicationGatesRuntimeState | null'), 'Runtime scaffold must accept nullable publication gate state.');
assert(scaffoldSource.includes('publicationGates = null'), 'Runtime scaffold must default publication gates to null.');
assert(scaffoldSource.includes('data-publication-gate-status'), 'Runtime scaffold must expose publication gate status for QA.');
assert(scaffoldSource.includes('data-publication-index-allowed'), 'Runtime scaffold must expose publication index gate for QA.');
assert(scaffoldSource.includes('publicationGates.sitemapPromotionAllowed'), 'Runtime scaffold must render sitemap publication gate.');
assert(scaffoldSource.includes('publicationGates.jsonLdAllowed'), 'Runtime scaffold must render JSON-LD publication gate.');
assert(scaffoldSource.includes('publicationGates.indexPromotionAllowed'), 'Runtime scaffold must render index publication gate.');
assert(scaffoldSource.includes('publicationGates.blockedReasons'), 'Runtime scaffold must render publication blockers.');

for (const route of routeFiles) {
  const source = readFile(route.path);

  assert(source.includes('getOmanGeoPublicationGates'), `Route must import publication gates accessor: ${route.path}`);
  assert(source.includes('const publicationGates = getOmanGeoPublicationGates'), `Route must call publication gates accessor: ${route.path}`);
  assert(source.includes(`entity: '${route.entity}'`), `Route must use correct publication gate entity: ${route.path}`);
  assert(source.includes('readiness,'), `Route must pass existing readiness into publication gates: ${route.path}`);
  assert(source.includes('publicationGates={publicationGates}'), `Route must pass publication gates into scaffold: ${route.path}`);
}

assert(packageSource.includes('geo:publication-gates:validate'), 'package.json must include publication gates validation script.');
assert(packageSource.includes('pnpm geo:publication-gates:validate'), 'geo:check:oman must include publication gates validation.');

const forbiddenRuntimeSignals = [
  '@supabase/',
  'createClient',
  'from(',
  'select(',
  'fetch(',
  'axios',
  'prisma',
];

for (const signal of forbiddenRuntimeSignals) {
  assert(!accessorSource.includes(signal), `Publication gates accessor must not include runtime data access signal: ${signal}`);
}

console.log('Oman geo publication gates validated.');
console.log({
  routeFiles: routeFiles.length,
  publicationGateEnabled: false,
  noindexRemovalAllowed: false,
  sitemapPromotionAllowed: false,
  jsonLdAllowed: false,
  indexPromotionAllowed: false,
});
