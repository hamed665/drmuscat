import fs from 'node:fs';

const contractPath = 'src/config/geo/promotion-review-contract.ts';
const accessorPath = 'src/lib/geo/oman-promotion-review.ts';
const readinessPath = 'src/lib/geo/oman-readiness.ts';
const scaffoldPath = 'src/components/geo/oman-geo-runtime-scaffold.tsx';
const packagePath = 'package.json';
const expectedEntities = ['governorate', 'wilayat', 'area'];
const expectedRequirements = [
  'provider-inventory-ready',
  'editorial-content-ready',
  'qa-evidence-ready',
  'index-eligibility-ready',
  'promotion-reviewer-approved',
];

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
const readinessSource = readFile(readinessPath);
const scaffoldSource = readFile(scaffoldPath);
const packageSource = readFile(packagePath);

assert(contractSource.includes('OMAN_GEO_PROMOTION_REVIEW_CONTRACT'), 'Missing promotion review contract export.');
assert(contractSource.includes('OMAN_GEO_PROMOTION_REVIEW_ENTITY_CONTRACTS'), 'Missing promotion review entity contracts.');
assert(contractSource.includes("status: 'blocked-readiness-missing'"), 'Promotion review status must remain blocked.');
assert(contractSource.includes('promotionReviewEnabled: false'), 'Promotion review must remain disabled.');
assert(contractSource.includes('promotionReviewRequestAllowed: false'), 'Promotion review request must remain blocked.');
assert(!contractSource.includes('promotionReviewEnabled: true'), 'Promotion review must not be enabled.');
assert(!contractSource.includes('promotionReviewRequestAllowed: true'), 'Promotion review request must not be allowed.');
assert(!contractSource.includes('noindexRemovalAllowed: true'), 'Noindex removal must not be allowed.');
assert(!contractSource.includes('sitemapPromotionAllowed: true'), 'Sitemap promotion must not be allowed.');
assert(!contractSource.includes('jsonLdAllowed: true'), 'JSON-LD must not be allowed.');
assert(!contractSource.includes('indexPromotionAllowed: true'), 'Index promotion must not be allowed.');

for (const requirement of expectedRequirements) {
  assert(contractSource.includes(`key: '${requirement}'`), `Missing promotion review requirement: ${requirement}.`);
}

for (const entity of expectedEntities) {
  const section = sectionForEntity(contractSource, entity);

  assert(section, `Missing promotion review contract for ${entity}.`);
  assert(section.includes("status: 'blocked-readiness-missing'"), `Promotion review must remain blocked for ${entity}.`);
  assert(section.includes("decision: 'none'"), `Promotion decision must remain none for ${entity}.`);
  assert(section.includes('reviewRequested: false'), `Promotion review request must remain false for ${entity}.`);
  assert(section.includes('reviewedByHuman: false'), `Human review must remain false for ${entity}.`);
  assert(section.includes('reviewerRole: null'), `Reviewer role must remain null for ${entity}.`);
  assert(section.includes('reviewedAt: null'), `Reviewed timestamp must remain null for ${entity}.`);
  assert(section.includes('readyForPromotionReview: false'), `Promotion review readiness must remain false for ${entity}.`);
  assert(section.includes('noindexRemovalAllowed: false'), `Noindex removal must be blocked for ${entity}.`);
  assert(section.includes('sitemapPromotionAllowed: false'), `Sitemap promotion must be blocked for ${entity}.`);
  assert(section.includes('jsonLdAllowed: false'), `JSON-LD must be blocked for ${entity}.`);
  assert(section.includes('indexPromotionAllowed: false'), `Index promotion must be blocked for ${entity}.`);
}

assert(accessorSource.includes('listOmanGeoPromotionReviewContracts'), 'Missing promotion review list helper.');
assert(accessorSource.includes('getOmanGeoPromotionReviewContract'), 'Missing promotion review lookup helper.');
assert(accessorSource.includes('getOmanGeoPromotionReviewRuntimeState'), 'Missing promotion review runtime state helper.');
assert(accessorSource.includes('promotionReviewEnabled: OMAN_GEO_PROMOTION_REVIEW_CONTRACT.promotionReviewEnabled'), 'Runtime state must derive promotion review enabled flag from contract.');
assert(accessorSource.includes('promotionReviewRequestAllowed: OMAN_GEO_PROMOTION_REVIEW_CONTRACT.promotionReviewRequestAllowed'), 'Runtime state must derive review request flag from contract.');
assert(accessorSource.includes('approvedEntityCount'), 'Runtime state must expose approved entity count.');
assert(accessorSource.includes('rejectedEntityCount'), 'Runtime state must expose rejected entity count.');
assert(accessorSource.includes('readyForPromotionReviewCount'), 'Runtime state must expose ready-for-review count.');
assert(accessorSource.includes('noindexRemovalAllowed: false'), 'Runtime accessor must keep noindex removal blocked.');
assert(accessorSource.includes('sitemapPromotionAllowed: false'), 'Runtime accessor must keep sitemap promotion blocked.');
assert(accessorSource.includes('jsonLdAllowed: false'), 'Runtime accessor must keep JSON-LD blocked.');
assert(accessorSource.includes('indexPromotionAllowed: false'), 'Runtime accessor must keep index promotion blocked.');

assert(readinessSource.includes('getOmanGeoPromotionReviewContract'), 'Readiness runtime must read promotion review contract.');
assert(readinessSource.includes('promotionReview: OmanGeoPromotionReviewEntityContract | null'), 'Readiness runtime must expose promotion review contract.');
assert(readinessSource.includes('promotionReviewReady'), 'Readiness runtime must expose promotion review readiness.');
assert(readinessSource.includes('promotionReviewApproved'), 'Readiness runtime must expose promotion review approval.');
assert(readinessSource.includes('promotion-review-not-ready'), 'Readiness runtime must block on missing promotion review readiness.');
assert(readinessSource.includes('promotion-review-approval-missing'), 'Readiness runtime must block on missing promotion review approval.');
assert(readinessSource.includes('readyForPromotionReview = false'), 'Readiness runtime must keep promotion review blocked.');
assert(readinessSource.includes('noindexRemovalAllowed: false'), 'Readiness runtime must keep noindex removal blocked.');
assert(readinessSource.includes('sitemapPromotionAllowed: false'), 'Readiness runtime must keep sitemap promotion blocked.');
assert(readinessSource.includes('jsonLdAllowed: false'), 'Readiness runtime must keep JSON-LD blocked.');
assert(readinessSource.includes('indexPromotionAllowed: false'), 'Readiness runtime must keep index promotion blocked.');

assert(scaffoldSource.includes('data-ready-for-promotion-review'), 'Runtime scaffold must expose promotion review readiness for QA.');
assert(scaffoldSource.includes('readiness.readyForPromotionReview'), 'Runtime scaffold must render promotion review readiness.');
assert(scaffoldSource.includes('readiness.blockedReasons'), 'Runtime scaffold must render readiness blockers.');

assert(packageSource.includes('geo:promotion-review:validate'), 'package.json must include promotion review validation script.');
assert(packageSource.includes('pnpm geo:promotion-review:validate'), 'geo:check:oman must include promotion review validation.');

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
  assert(!accessorSource.includes(signal), `Promotion review accessor must not include runtime data access signal: ${signal}`);
}

console.log('Oman geo promotion review workflow validated.');
console.log({
  entities: expectedEntities.length,
  promotionReviewEnabled: false,
  promotionReviewRequestAllowed: false,
  noindexRemovalAllowed: false,
  sitemapPromotionAllowed: false,
  jsonLdAllowed: false,
  indexPromotionAllowed: false,
});
