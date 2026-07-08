import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = process.cwd();
const contractPath = resolve(projectRoot, 'docs/seo/sitemap-eligibility-gate-contract.md');
const gatePath = resolve(projectRoot, 'src/lib/seo/sitemap/sitemap-eligibility-gate.ts');
const importSitemapPath = resolve(projectRoot, 'src/server/public/import-sitemap.ts');
const hreflangPath = resolve(projectRoot, 'src/lib/seo/hreflang/public-hreflang-projection.ts');
const internalLinksPath = resolve(projectRoot, 'src/lib/seo/internal-links/project-public-internal-links.ts');
const blockerPath = resolve(projectRoot, 'docs/import/imported-hospital-release-blockers.md');

function readRequired(filePath, label) {
  if (!existsSync(filePath)) {
    console.error(`Missing ${label}: ${filePath}`);
    process.exit(1);
  }
  return readFileSync(filePath, 'utf8');
}

function requirePhrases(label, source, phrases) {
  const missing = phrases.filter((phrase) => !source.includes(phrase));
  if (missing.length > 0) {
    console.error(`${label} is missing required sitemap eligibility gate phrases:`);
    for (const phrase of missing) console.error(`- ${phrase}`);
    process.exit(1);
  }
}

const contractSource = readRequired(contractPath, 'sitemap eligibility gate contract');
const gateSource = readRequired(gatePath, 'sitemap eligibility gate helper');
const importSitemapSource = readRequired(importSitemapPath, 'import sitemap helper');
const hreflangSource = readRequired(hreflangPath, 'hreflang projection helper');
const internalLinksSource = readRequired(internalLinksPath, 'internal link projection helper');
const blockerSource = readRequired(blockerPath, 'imported hospital release blockers');

requirePhrases('sitemap eligibility gate contract', contractSource, [
  'Status: canonical sitemap eligibility gate contract.',
  'canonical-first, hreflang-ready, internally-linked, fail-closed',
  'canonical exists',
  'canonical equals pathname',
  'publicRouteEnabled = true',
  'publicSafe = true',
  'indexable = true',
  'sitemapEligible = true',
  'hreflangReady = true',
  'minimumInternalLinksPassed = true',
  'contentScorePassed = true',
  'blockedByImportedHospitalRelease = false',
  'Imported providers must not enter sitemap from `publicDiscoveryEligible && publicSitemapEligible` alone.',
  'metadata.hreflang_ready = true',
  'metadata.minimum_internal_links_passed = true',
  'metadata.content_score_passed = true',
  'metadata.public_route_enabled = true',
  'metadata.public_safe = true',
]);

requirePhrases('sitemap eligibility gate helper', gateSource, [
  'export type PublicSitemapEligibilityCandidate',
  'export type PublicSitemapEligibilityResult',
  'decidePublicSitemapEligibility',
  'canonicalPath: string | null',
  'publicRouteEnabled: boolean',
  'publicSafe: boolean',
  'indexable: boolean',
  'sitemapEligible: boolean',
  'hreflangReady: boolean',
  'minimumInternalLinksPassed: boolean',
  'contentScorePassed: boolean',
  'blockedByImportedHospitalRelease: boolean',
  "reason: 'missing_canonical'",
  "reason: 'canonical_mismatch'",
  "reason: 'route_disabled'",
  "reason: 'not_public_safe'",
  "reason: 'not_indexable'",
  "reason: 'not_sitemap_eligible'",
  "reason: 'hreflang_not_ready'",
  "reason: 'minimum_internal_links_missing'",
  "reason: 'content_score_missing'",
  "reason: 'blocked_by_imported_hospital_release'",
]);

requirePhrases('import sitemap helper', importSitemapSource, [
  'decidePublicSitemapEligibility',
  'function readBoolean',
  'function importSitemapEligibilityPassed',
  'publicRouteEnabled: readBoolean(metadata, "public_route_enabled")',
  'publicSafe: readBoolean(metadata, "public_safe")',
  'hreflangReady: readBoolean(metadata, "hreflang_ready")',
  'minimumInternalLinksPassed: readBoolean(metadata, "minimum_internal_links_passed")',
  'contentScorePassed: readBoolean(metadata, "content_score_passed")',
  'blockedByImportedHospitalRelease: readBoolean(metadata, "blocked_by_imported_hospital_release")',
  'if (!importSitemapEligibilityPassed(entityType, row.metadata, canonicalPath)) return null',
]);

requirePhrases('hreflang projection helper', hreflangSource, [
  'projectPublicHreflang',
  'sitemapAlternates',
]);

requirePhrases('internal link projection helper', internalLinksSource, [
  'hasMinimumPublicInternalLinkCoverage',
  'projectPublicInternalLinks',
]);

requirePhrases('imported hospital release blockers', blockerSource, [
  'minimumInternalLinks passed',
  'sitemap eligibility gate passes',
  'Imported hospital controlled release must remain after the first indexable batch, not before it.',
]);

console.log('Sitemap eligibility gate contract validation passed.');
