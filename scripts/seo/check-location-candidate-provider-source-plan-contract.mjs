import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = process.cwd();
const contractPath = 'src/config/geo/location-candidate-provider-source-plan-contract.ts';
const packagePath = 'package.json';

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), 'utf8');
}

function requireTokens(label, source, tokens) {
  const missing = tokens.filter((token) => !source.includes(token));
  if (missing.length > 0) {
    console.error(`${label} is missing required provider source plan tokens:`);
    for (const token of missing) {
      console.error(`- ${token}`);
    }
    process.exit(1);
  }
}

function forbidTokens(label, source, tokens) {
  const forbidden = tokens.filter((token) => source.includes(token));
  if (forbidden.length > 0) {
    console.error(`${label} contains forbidden provider source plan tokens:`);
    for (const token of forbidden) {
      console.error(`- ${token}`);
    }
    process.exit(1);
  }
}

const contract = read(contractPath);
const packageJson = read(packagePath);

requireTokens(contractPath, contract, [
  'OMAN_LOCATION_CANDIDATE_PROVIDER_SOURCE_PLAN_CONTRACT_VERSION',
  'OmanLocationCandidateProviderSourceRequirement',
  'OmanLocationCandidateProviderSourcePlanPolicy',
  "status: 'contract-only'",
  'official-site',
  'clinic-site',
  'map-listing',
  'directory',
  'social-proof',
  'manual-reviewer',
  'allowed: true',
  'requiredForImport: true',
  'reviewerRequired: true',
  'conflictNoteRequired: true',
  'runtimeCollectionAllowed: false',
  'databaseAccessAllowed: false',
  'importAllowed: false',
  'OMAN_LOCATION_THRESHOLD_POLICIES.map(definePolicy)',
  'dataImportAllowedByDefault: false',
  'runtimeCollectionAllowedByDefault: false',
  'routeCreationAllowed: false',
  'sitemapAllowed: false',
  'jsonLdAllowed: false',
  'indexPromotionAllowed: false',
  'internalSeoLinksAllowed: false',
]);

forbidTokens(contractPath, contract, [
  "status: 'ready-for-audit'",
  "status: 'active'",
  'runtimeCollectionAllowed: true',
  'databaseAccessAllowed: true',
  'importAllowed: true',
  'dataImportAllowedByDefault: true',
  'runtimeCollectionAllowedByDefault: true',
  'routeCreationAllowed: true',
  'sitemapAllowed: true',
  'jsonLdAllowed: true',
  'indexPromotionAllowed: true',
  'internalSeoLinksAllowed: true',
]);

requireTokens(packagePath, packageJson, [
  'seo:location-candidate-provider-source-plan:validate',
  'check-location-candidate-provider-source-plan-contract.mjs',
]);

console.log('Location candidate provider source plan contract validation passed.');
