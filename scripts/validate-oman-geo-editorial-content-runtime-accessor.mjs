import fs from 'node:fs';

const contentContractPath = 'src/config/geo/editorial-content-contract.ts';
const accessorPath = 'src/lib/geo/oman-editorial-content.ts';

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

const contentContractSource = readFile(contentContractPath);
const accessorSource = readFile(accessorPath);

assert(contentContractSource.includes('OMAN_GEO_EDITORIAL_CONTENT_REGISTRY: readonly OmanGeoEditorialContentEntry[] = []'), 'Editorial content registry must remain empty in this phase.');
assert(contentContractSource.includes('registryEnabled: false'), 'Editorial content registry must remain disabled.');
assert(contentContractSource.includes('currentContentEvidenceAvailable: false'), 'Editorial content evidence must remain unavailable.');

assert(accessorSource.includes('OMAN_GEO_EDITORIAL_CONTENT_REGISTRY'), 'Accessor must read from the editorial content registry.');
assert(accessorSource.includes('listPublishedOmanGeoEditorialContent'), 'Accessor must expose a published content list helper.');
assert(accessorSource.includes('getOmanGeoEditorialContent'), 'Accessor must expose a lookup helper.');
assert(accessorSource.includes('getOmanGeoEditorialContentRuntimeState'), 'Accessor must expose runtime state helper.');
assert(accessorSource.includes("entry.status === 'published'"), 'Accessor must only expose published content.');
assert(accessorSource.includes('entry.reviewedByHuman === true'), 'Accessor must only expose human-reviewed content.');
assert(accessorSource.includes('?? null'), 'Lookup helper must return null when content is absent.');
assert(accessorSource.includes('registryEnabled: false'), 'Runtime state must keep registry disabled in this phase.');
assert(accessorSource.includes('hasPublishedContent: publishedContentCount > 0'), 'Runtime state must derive published content presence from filtered entries.');

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
  assert(!accessorSource.includes(signal), `Editorial content accessor must not include runtime data access signal: ${signal}`);
}

console.log('Oman geo editorial content runtime accessor validated.');
console.log({
  registryEnabled: false,
  publishedOnly: true,
  humanReviewedOnly: true,
  runtimeDataAccess: false,
});
