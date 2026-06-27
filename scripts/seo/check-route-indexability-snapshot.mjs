import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const snapshotPath = 'docs/seo/DRKHALEEJ_ROUTE_INDEXABILITY_SNAPSHOT_V1.md';

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function assertIncludes(source, needle, message) {
  if (!source.includes(needle)) throw new Error(message);
}

function assertNotIncludes(source, needle, message) {
  if (source.includes(needle)) throw new Error(message);
}

function routeBlock(source, route) {
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(String.raw`\{[\s\S]*?pathname:\s*['"]${escaped}['"][\s\S]*?\}`, 'm'));
  if (!match) throw new Error(`Missing static route registry block for ${route}.`);
  return match[0];
}

function registryIndexStatus(registrySource, route) {
  if (route === '/') return 'index-ready';
  const block = routeBlock(registrySource, route);
  const indexable = block.includes("indexPolicy: 'index'") && block.includes("readiness: 'ready'") && block.includes('sitemapEligible: true');
  const noindex = block.includes("indexPolicy: 'noindex_until_ready'") && block.includes('sitemapEligible: false');

  if (indexable) return 'index-ready';
  if (noindex) return 'sitemap-excluded';
  throw new Error(`Static route ${route} is neither launch-ready nor noindex-gated.`);
}

function localizedUrl(route, locale) {
  return route === '/' ? `/${locale}/om` : `/${locale}/om${route}`;
}

const registrySource = await readText('src/lib/seo/page-registry.ts');
const snapshotSource = await readText(snapshotPath);
const packageSource = await readText('package.json');
const sitemapSource = await readText('src/app/sitemap.ts');
const importSitemapSource = await readText('src/server/public/import-sitemap.ts');
const metadataSource = await readText('src/lib/seo/metadata.ts');

for (const token of [
  '# DrKhaleej Route Indexability Snapshot V1',
  '## Static public route snapshot',
  '## Dynamic imported provider route snapshot',
  '## Import sitemap caps',
  '## Launch sitemap allowlist',
  '## Blocked from first clean launch sitemap',
  '## Current guard milestones',
  '| Route | Localized URLs | Index policy | Readiness | Sitemap | Robots | Snapshot decision | Next action |',
]) {
  assertIncludes(snapshotSource, token, `${snapshotPath} is missing required section or table marker: ${token}`);
}

const staticRoutes = [
  '/',
  '/doctors',
  '/centers',
  '/labs',
  '/pharmacies',
  '/hospitals',
  '/services',
  '/for-providers',
  '/dental',
  '/beauty',
  '/offers',
  '/pet-clinics',
  '/pet-shops',
  '/search',
];

for (const route of staticRoutes) {
  const expectedStatus = registryIndexStatus(registrySource, route);
  assertIncludes(snapshotSource, `\`${route}\``, `${snapshotPath} must include route ${route}.`);
  assertIncludes(snapshotSource, `\`${localizedUrl(route, 'en')}\``, `${snapshotPath} must include English URL for ${route}.`);
  assertIncludes(snapshotSource, `\`${localizedUrl(route, 'ar')}\``, `${snapshotPath} must include Arabic URL for ${route}.`);
  assertIncludes(snapshotSource, expectedStatus, `${snapshotPath} must include status ${expectedStatus} for ${route}.`);
}

for (const token of [
  '`/en/om/doctor/{slug}`',
  '`/ar/om/doctor/{slug}`',
  '`/en/om/pharmacies/{slug}`',
  '`/ar/om/pharmacies/{slug}`',
  '`/en/om/hospitals/{slug}`',
  '`/ar/om/hospitals/{slug}`',
  'route guard exists and smoke-checked',
  'source evidence',
  'contact/map signal',
  'safe canonical pattern',
  'SITEMAP-GUARD-B import-sitemap-family-caps-v1',
  'PROFILE-SMOKE-A import-profile-smoke-v1',
  'IMPORT-QA-A import-publish-readiness-audit-v1',
  'doctor: `3000`',
  'pharmacy: `1500`',
  'hospital: `500`',
]) {
  assertIncludes(snapshotSource, token, `${snapshotPath} must include dynamic import route snapshot token: ${token}`);
}

for (const staleToken of [
  'Imported pharmacy profile | `/en/om/pharmacies/{slug}` and `/ar/om/pharmacies/{slug}` | not yet guarded',
  'Imported hospital profile | `/en/om/hospitals/{slug}` and `/ar/om/hospitals/{slug}` | not yet guarded',
  'Pharmacy, hospital, lab, and imported center profile sitemap entries.',
  'PROFILE-GATE-B imported-pharmacy-route-guard-v1',
  'PROFILE-GATE-C imported-hospital-route-guard-v1',
]) {
  assertNotIncludes(snapshotSource, staleToken, `${snapshotPath} contains stale route snapshot token: ${staleToken}`);
}

assertIncludes(packageSource, 'seo:route-snapshot:validate', 'package.json must expose route snapshot validation.');
assertIncludes(packageSource, 'pnpm seo:route-snapshot:validate', 'seo:check must run route snapshot validation.');
assertIncludes(packageSource, 'import:profile-smoke:validate', 'package.json must expose public import profile smoke validation.');
assertIncludes(packageSource, 'pnpm import:profile-smoke:validate', 'seo:check must run public import profile smoke validation.');
assertIncludes(sitemapSource, 'listSitemapEligibleSeoPageDefinitions()', 'sitemap must still use the readiness-filtered registry.');
assertIncludes(sitemapSource, 'listPublicImportSitemapEntries()', 'sitemap must still include guarded import sitemap entries.');
assertIncludes(importSitemapSource, 'publicImportSitemapFamilyCaps', 'import sitemap must preserve per-family caps.');
assertIncludes(importSitemapSource, 'hasReviewedImportEvidence', 'import sitemap must preserve reviewed import evidence.');
assertIncludes(metadataSource, 'robotsForStaticSeoPage', 'metadata must still use static route readiness for robots.');

console.log('route indexability snapshot check passed.');
