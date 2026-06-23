import fs from 'node:fs';

const editorialReadinessPath = 'src/config/geo/editorial-readiness-contract.ts';
const providerReadinessPath = 'src/config/geo/provider-readiness-contract.ts';
const indexPromotionPath = 'src/config/geo/index-promotion-policy.ts';

const expectedEntities = ['governorate', 'wilayat', 'area'];
const expectedMinimumWords = {
  governorate: 120,
  wilayat: 90,
  area: 70,
};
const requiredBlocks = [
  'hero-summary',
  'local-context',
  'care-access',
  'nearby-areas',
  'editorial-disclaimer',
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

const editorialSource = readFile(editorialReadinessPath);
const providerSource = readFile(providerReadinessPath);
const promotionSource = readFile(indexPromotionPath);

assert(editorialSource.includes('OMAN_GEO_EDITORIAL_READINESS_CONTRACT'), 'Missing editorial readiness contract export.');
assert(editorialSource.includes('currentEditorialEvidenceAvailable: false'), 'Editorial evidence must remain unavailable in this contract-only phase.');
assert(!editorialSource.includes('currentEditorialEvidenceAvailable: true'), 'Editorial readiness contract must not claim editorial evidence exists yet.');
assert(editorialSource.includes('promotionRequiresHumanReview: true'), 'Editorial promotion must require human review.');
assert(editorialSource.includes('promotionRequiresArabicAndEnglishCopy: true'), 'Editorial promotion must require Arabic and English copy.');
assert(editorialSource.includes('currentIndexPromotionAllowed: false'), 'Editorial contract must not allow index promotion yet.');
assert(editorialSource.includes('currentSitemapPromotionAllowed: false'), 'Editorial contract must not allow sitemap promotion yet.');
assert(!editorialSource.includes('currentIndexPromotionAllowed: true'), 'Editorial contract must not enable index promotion.');
assert(!editorialSource.includes('currentSitemapPromotionAllowed: true'), 'Editorial contract must not enable sitemap promotion.');

for (const block of requiredBlocks) {
  assert(editorialSource.includes(`'${block}'`), `Missing required editorial block: ${block}`);
}

for (const entity of expectedEntities) {
  const editorialSection = sectionForEntity(editorialSource, entity);
  const providerSection = sectionForEntity(providerSource, entity);
  const promotionSection = sectionForEntity(promotionSource, entity);

  assert(editorialSection, `Missing editorial readiness contract for ${entity}.`);
  assert(providerSection, `Missing provider readiness contract for ${entity}.`);
  assert(promotionSection, `Missing index promotion policy for ${entity}.`);

  assert(editorialSection.includes(`minimumEnglishWords: ${expectedMinimumWords[entity]}`), `English editorial threshold mismatch for ${entity}.`);
  assert(editorialSection.includes(`minimumArabicWords: ${expectedMinimumWords[entity]}`), `Arabic editorial threshold mismatch for ${entity}.`);
  assert(providerSection.includes(`minimumEditorialWords: ${expectedMinimumWords[entity]}`), `Provider readiness editorial threshold mismatch for ${entity}.`);
  assert(promotionSection.includes(`minimumEditorialWords: ${expectedMinimumWords[entity]}`), `Index promotion editorial threshold mismatch for ${entity}.`);

  assert(editorialSection.includes('requiresDistinctLocaleCopy: true'), `Distinct locale copy must be required for ${entity}.`);
  assert(editorialSection.includes('placeholderCopyAllowed: false'), `Placeholder copy must be blocked for ${entity}.`);
  assert(editorialSection.includes('aiMedicalAdviceAllowed: false'), `AI medical advice must be blocked for ${entity}.`);
  assert(editorialSection.includes('mohVerificationClaimsAllowed: false'), `MOH verification claims must be blocked for ${entity}.`);
  assert(editorialSection.includes('providerRankingClaimsAllowed: false'), `Provider ranking claims must be blocked for ${entity}.`);
  assert(editorialSection.includes('humanReviewRequired: true'), `Human review must be required for ${entity}.`);
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
  assert(!editorialSource.includes(signal), `Editorial readiness contract must not include runtime data access signal: ${signal}`);
}

console.log('Oman geo editorial readiness contract validated.');
console.log({
  entities: expectedEntities.length,
  requiredBlocks: requiredBlocks.length,
  currentEditorialEvidenceAvailable: false,
  promotionRequiresHumanReview: true,
  currentIndexPromotionAllowed: false,
  currentSitemapPromotionAllowed: false,
});
