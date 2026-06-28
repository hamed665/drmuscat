import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = process.cwd();

const files = {
  routeContract: 'src/config/geo/route-contract.ts',
  readiness: 'src/lib/geo/oman-readiness.ts',
  publicationGates: 'src/lib/geo/oman-publication-gates.ts',
  indexPromotionPolicy: 'src/config/geo/index-promotion-policy.ts',
  routeMetadataGuard: 'scripts/seo/check-location-route-metadata-consistency.mjs',
  packageJson: 'package.json',
};

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), 'utf8');
}

function requireTokens(label, source, tokens) {
  const missing = tokens.filter((token) => !source.includes(token));
  if (missing.length > 0) {
    console.error(`${label} is missing required location link gate tokens:`);
    for (const token of missing) {
      console.error(`- ${token}`);
    }
    process.exit(1);
  }
}

function forbidTokens(label, source, tokens) {
  const forbidden = tokens.filter((token) => source.includes(token));
  if (forbidden.length > 0) {
    console.error(`${label} contains forbidden location link gate tokens:`);
    for (const token of forbidden) {
      console.error(`- ${token}`);
    }
    process.exit(1);
  }
}

const routeContract = read(files.routeContract);
const readiness = read(files.readiness);
const publicationGates = read(files.publicationGates);
const indexPromotionPolicy = read(files.indexPromotionPolicy);
const routeMetadataGuard = read(files.routeMetadataGuard);
const packageJson = read(files.packageJson);

requireTokens(files.routeContract, routeContract, [
  "routeName: 'location-governorate'",
  "routeName: 'location-wilayat'",
  "routeName: 'location-area'",
  'indexableCanonical: false',
  'sitemapEnabled: false',
  'jsonLdEnabled: false',
  'Location route scaffolds are noindex-first and must not become indexable until page readiness gates pass.',
]);

requireTokens(files.indexPromotionPolicy, indexPromotionPolicy, [
  "defaultStatus: 'blocked-until-content-ready'",
  'noindexRequiredByDefault: true',
  'sitemapAllowedByDefault: false',
  'jsonLdAllowedByDefault: false',
  'promotionRequiresApprovedPr: true',
  'No geo route is indexable in the current scaffold phase.',
]);

requireTokens(files.readiness, readiness, [
  'const readyForPromotionReview = false;',
  'readyForPromotionReview,',
  'indexPromotionAllowed: false',
  'sitemapPromotionAllowed: false',
  'noindexRemovalAllowed: false',
]);

requireTokens(files.publicationGates, publicationGates, [
  'technicalGateEnabled = false',
  'indexPromotionAllowed: false',
  'sitemapPromotionAllowed: false',
  'noindexRemovalAllowed: false',
]);

requireTokens(files.routeMetadataGuard, routeMetadataGuard, [
  'indexableCanonical: false',
  'sitemapEnabled: false',
  'jsonLdEnabled: false',
  'generateStaticParams',
  'sitemap',
  'jsonLd',
]);

forbidTokens(files.routeContract, routeContract, [
  'internalSeoLinks: true',
  'seoInternalLinksEnabled: true',
  'linkEquityEnabled: true',
]);

forbidTokens(files.readiness, readiness, [
  'indexPromotionAllowed: true',
  'sitemapPromotionAllowed: true',
  'noindexRemovalAllowed: true',
]);

forbidTokens(files.publicationGates, publicationGates, [
  'indexPromotionAllowed: true',
  'sitemapPromotionAllowed: true',
  'noindexRemovalAllowed: true',
  'technicalGateEnabled = true',
]);

requireTokens(files.packageJson, packageJson, [
  'seo:location-links:validate',
  'check-location-link-gate.mjs',
]);

console.log('Location link gate validation passed.');
