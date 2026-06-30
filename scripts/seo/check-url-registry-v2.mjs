import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registryPath = 'src/lib/seo/url-registry-v2.ts';

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing file: ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function mustHave(source, token) {
  if (!source.includes(token)) throw new Error(`${registryPath} must include: ${token}`);
}

const source = read(registryPath);

for (const token of [
  'SeoUrlFamilyV2',
  'SeoUrlIndexPolicyV2',
  'SeoUrlSitemapPolicyV2',
  'SeoUrlGateV2',
  'seoUrlRegistryV2',
  'country-root',
  'doctors-directory',
  'centers-directory',
  'labs-directory',
  'pharmacies-directory',
  'hospitals-directory',
  'services-directory',
  'provider-onboarding',
  'search_noindex',
  'provider_eligibility',
  'geo_promotion',
  'editorial_review',
  'private_exclusion',
  'gate_before_index',
  'gate_before_include',
  'listSeoUrlRegistryV2ByGate',
]) {
  mustHave(source, token);
}

if (!source.includes("indexPolicy: 'noindex'") || !source.includes("sitemapPolicy: 'exclude'")) {
  throw new Error('Registry v2 must preserve explicit noindex/exclude entries.');
}

console.log('SEO URL registry v2 checks passed.');
