import fs from 'node:fs';

const gatePath = 'src/lib/geo/oman-index-promotion-eligibility.ts';
const readinessAccessorPath = 'src/lib/geo/oman-readiness.ts';
const scaffoldPath = 'src/components/geo/oman-geo-runtime-scaffold.tsx';
const routeFiles = [
  {
    path: 'src/app/[locale]/[country]/oman/governorates/[governorateSlug]/page.tsx',
    entity: 'governorate',
    slugExpression: 'governorate.slug',
  },
  {
    path: 'src/app/[locale]/[country]/oman/wilayats/[wilayatSlug]/page.tsx',
    entity: 'wilayat',
    slugExpression: 'wilayat.slug',
  },
  {
    path: 'src/app/[locale]/[country]/oman/areas/[areaSlug]/page.tsx',
    entity: 'area',
    slugExpression: 'area.slug',
  },
];

function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const gateSource = readFile(gatePath);
const readinessAccessorSource = readFile(readinessAccessorPath);
const scaffoldSource = readFile(scaffoldPath);

assert(gateSource.includes('getOmanGeoIndexPromotionEligibility'), 'Missing index promotion eligibility helper.');
assert(gateSource.includes('eligibleForIndexPromotion: false'), 'Eligibility gate must keep index promotion blocked.');
assert(gateSource.includes('noindexRequired: true'), 'Eligibility gate must keep noindex required.');
assert(gateSource.includes('sitemapAllowed: false'), 'Eligibility gate must keep sitemap blocked.');
assert(gateSource.includes('jsonLdAllowed: false'), 'Eligibility gate must keep JSON-LD blocked.');

assert(readinessAccessorSource.includes('getOmanGeoIndexPromotionEligibility(input)'), 'Readiness accessor must read index promotion eligibility state.');
assert(readinessAccessorSource.includes('indexPromotionEligibilityReady'), 'Readiness accessor must expose index promotion readiness.');
assert(readinessAccessorSource.includes('index-promotion-eligibility-not-ready'), 'Readiness accessor must block on missing index promotion readiness.');

assert(scaffoldSource.includes('OmanGeoIndexPromotionEligibility'), 'Runtime scaffold must accept typed index promotion eligibility.');
assert(scaffoldSource.includes('indexPromotionEligibility?: OmanGeoIndexPromotionEligibility | null'), 'Runtime scaffold must accept nullable index promotion eligibility.');
assert(scaffoldSource.includes('indexPromotionEligibility = null'), 'Runtime scaffold must default index promotion eligibility to null.');
assert(scaffoldSource.includes('data-index-promotion-eligible'), 'Runtime scaffold must expose index promotion eligibility for QA.');
assert(scaffoldSource.includes('indexPromotionEligibility.eligibleForIndexPromotion'), 'Runtime scaffold must render index promotion eligibility status.');
assert(scaffoldSource.includes('indexPromotionEligibility.noindexRequired'), 'Runtime scaffold must render noindex state.');
assert(scaffoldSource.includes('indexPromotionEligibility.sitemapAllowed'), 'Runtime scaffold must render sitemap state.');
assert(scaffoldSource.includes('indexPromotionEligibility.jsonLdAllowed'), 'Runtime scaffold must render JSON-LD state.');
assert(scaffoldSource.includes('indexPromotionEligibility.blockedReasons'), 'Runtime scaffold must render blocked reasons.');

for (const route of routeFiles) {
  const source = readFile(route.path);
  const usesDirectIndexEligibility =
    source.includes('getOmanGeoIndexPromotionEligibility') &&
    source.includes('const indexPromotionEligibility = getOmanGeoIndexPromotionEligibility({') &&
    source.includes(`slug: ${route.slugExpression}`) &&
    source.includes('locale,') &&
    source.includes('indexPromotionEligibility={indexPromotionEligibility}');
  const usesUnifiedReadiness =
    source.includes('getOmanGeoReadiness') &&
    source.includes('const readiness = getOmanGeoReadiness') &&
    source.includes('indexPromotionEligibility={readiness.indexPromotionEligibility}') &&
    source.includes('readiness={readiness}');

  assert(
    usesDirectIndexEligibility || usesUnifiedReadiness,
    `Route must wire index promotion eligibility directly or through unified readiness: ${route.path}`,
  );
  assert(source.includes(`entity: '${route.entity}'`), `Route must use correct index promotion entity: ${route.path}`);
  assert(!source.includes('sitemap'), `Route integration must not add sitemap behavior: ${route.path}`);
  assert(!source.includes('jsonLd'), `Route integration must not add JSON-LD behavior: ${route.path}`);
}

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
  assert(!gateSource.includes(signal), `Eligibility gate must not include runtime data access signal: ${signal}`);
}

console.log('Oman geo index promotion eligibility route integration validated.');
console.log({
  routeFiles: routeFiles.length,
  supportsUnifiedReadiness: true,
  eligibleForIndexPromotion: false,
  noindexRequired: true,
  sitemapAllowed: false,
  jsonLdAllowed: false,
});
