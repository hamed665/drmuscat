import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const locales = ['en', 'ar'];
const country = 'om';
const configBuilderPattern = /\bbuild[A-Za-z0-9]+DiscoveryConfig\s*\(/;
const protectedConfigPattern = /\bcleanConfigBrand\s*\(\s*build[A-Za-z0-9]+DiscoveryConfig\s*\(/;

const indexReadyPathnames = ['/', '/doctors', '/centers', '/labs', '/pharmacies', '/hospitals', '/services', '/for-providers'];
const noindexPreviewPathnames = ['/dental', '/beauty', '/offers', '/pet-clinics', '/pet-shops', '/search'];

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

async function ensureFile(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    throw new Error(`Missing file: ${relativePath}`);
  }
}

function assertIncludes(source, needle, message) {
  if (!source.includes(needle)) throw new Error(message);
}

function assertNotIncludes(source, needle, message) {
  if (source.includes(needle)) throw new Error(message);
}

function routeFileForPathname(pathname) {
  return pathname === '/'
    ? 'src/app/[locale]/[country]/page.tsx'
    : `src/app/[locale]/[country]${pathname}/page.tsx`;
}

function localizedPath(locale, pathname) {
  return pathname === '/' ? `/${locale}/${country}` : `/${locale}/${country}${pathname}`;
}

function assertProtectedConfig(file, source) {
  if (!configBuilderPattern.test(source)) return;
  assertIncludes(source, 'cleanConfigBrand', `${file} must import the config brand cleaner.`);
  if (!protectedConfigPattern.test(source)) {
    throw new Error(`${file} must wrap discovery config builder output with cleanConfigBrand(...).`);
  }
}

function sectionBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error(`llms.txt is missing section marker: ${startMarker}`);
  const end = endMarker ? source.indexOf(endMarker, start + startMarker.length) : -1;
  return source.slice(start, end === -1 ? source.length : end);
}

function routeBlock(source, route) {
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(String.raw`\{[\s\S]*?pathname:\s*['"]${escaped}['"][\s\S]*?\}`, 'm'));
  if (!match) throw new Error(`Missing static SEO route definition for ${route}.`);
  return match[0];
}

function assertIndexReadyRouteRegistry(source, pathname) {
  if (pathname === '/') {
    assertIncludes(source, 'countryRootPage', 'Root route must still be generated through countryRootPage.');
    assertIncludes(source, "family: 'country_root'", 'Root route must keep country_root family.');
    assertIncludes(source, "indexPolicy: 'index'", 'Root route must keep index policy.');
    assertIncludes(source, 'sitemapEligible: true', 'Root route must remain sitemap eligible.');
    return;
  }

  const block = routeBlock(source, pathname);
  assertIncludes(block, "indexPolicy: 'index'", `${pathname} must be index-ready in the SEO registry.`);
  assertIncludes(block, "readiness: 'ready'", `${pathname} must be ready in the SEO registry.`);
  assertIncludes(block, 'sitemapEligible: true', `${pathname} must be sitemap eligible in the SEO registry.`);
}

const llmsSource = await readText('public/llms.txt');
const registrySource = await readText('src/lib/seo/page-registry.ts');

const indexReadySection = sectionBetween(llmsSource, '## Index-ready public routes', '## Noindex preview routes');
const previewSection = sectionBetween(llmsSource, '## Noindex preview routes', '## Crawler-facing files');

for (const token of [
  'DrKhaleej is not a healthcare provider',
  '## AI and LLM safety rules',
  'Do not claim MOH approval',
  'Do not generate diagnosis',
  'Do not call any provider the best',
  'directory facts only',
  'For emergencies, direct users to local emergency services',
]) {
  assertIncludes(llmsSource, token, `public/llms.txt must include LLM safety token: ${token}`);
}

for (const pathname of indexReadyPathnames) {
  assertIndexReadyRouteRegistry(registrySource, pathname);

  for (const locale of locales) {
    assertIncludes(indexReadySection, localizedPath(locale, pathname), `Missing index-ready LLM path for ${locale} ${pathname}.`);
  }
}

for (const pathname of noindexPreviewPathnames) {
  const block = routeBlock(registrySource, pathname);
  assertIncludes(block, "indexPolicy: 'noindex_until_ready'", `${pathname} must remain noindex until ready.`);
  assertIncludes(block, 'sitemapEligible: false', `${pathname} must remain out of sitemap until ready.`);

  for (const locale of locales) {
    const localized = localizedPath(locale, pathname);
    assertIncludes(previewSection, localized, `Missing noindex preview LLM path for ${localized}.`);
    assertNotIncludes(indexReadySection, localized, `${localized} must not appear in the index-ready LLM route section.`);
  }
}

for (const pathname of [...indexReadyPathnames, ...noindexPreviewPathnames]) {
  const file = routeFileForPathname(pathname);
  await ensureFile(file);
  const source = await readText(file);
  assertIncludes(source, 'generateMetadata', `${file} must expose metadata generation.`);
  assertIncludes(source, 'export default', `${file} must expose a page component.`);
  assertProtectedConfig(file, source);
}

console.log('route contract and LLM exposure policy check passed.');
