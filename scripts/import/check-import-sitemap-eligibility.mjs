import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contractPath = 'src/server/admin/import-sitemap-eligibility-contract.ts';
const existingAdminPath = 'src/server/admin/import-sitemap-eligibility.ts';
const architecturePath = 'docs/platform/DRMUSCAT_IMPORT_READINESS_CONTROLLED_PUBLISHING_ARCHITECTURE_V1.md';

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(source, token, message) {
  assert(source.includes(token), message);
}

function assertNotIncludes(source, token, message) {
  assert(!source.includes(token), message);
}

const contractSource = await readText(contractPath);
const existingAdminSource = await readText(existingAdminPath);
const architectureSource = await readText(architecturePath);

for (const token of [
  'export type ImportSitemapVisibilityPolicy = "private" | "public";',
  'export type ImportSitemapIndexPolicy = "noindex" | "index";',
  'export type ImportSitemapPolicy = "excluded" | "included";',
  'export type ImportSitemapEligibilityEntity',
  'visibility: ImportSitemapVisibilityPolicy | null',
  'index_policy: ImportSitemapIndexPolicy | null',
  'sitemap_policy: ImportSitemapPolicy | null',
  'seo_validated: boolean | null',
  'geo_validated: boolean | null',
  'content_validated: boolean | null',
  'schema_validated: boolean | null',
  'relations_validated: boolean | null',
  'duplicate_check_passed: boolean | null',
  'manual_approved: boolean | null',
  'canonical_validated: boolean | null',
  'export type ImportSitemapEligibilityBlocker',
  'visibility_not_public',
  'index_policy_not_index',
  'sitemap_policy_not_included',
  'seo_not_validated',
  'geo_not_validated',
  'content_not_validated',
  'schema_not_validated',
  'relations_not_validated',
  'duplicate_check_not_passed',
  'manual_approval_missing',
  'canonical_not_validated',
  'IMPORT_SITEMAP_VALIDATED_PROJECTION = "public_indexable_entities"',
  'IMPORT_SITEMAP_FILES',
  '/sitemaps/doctors.xml',
  '/sitemaps/pharmacies.xml',
  '/sitemaps/hospitals.xml',
  '/sitemaps/clinics.xml',
  '/sitemaps/dental.xml',
  '/sitemaps/beauty.xml',
  '/sitemaps/pet.xml',
  '/sitemaps/locations.xml',
  '/sitemaps/articles.xml',
  'export function getSitemapBlockers',
  'export function isSitemapEligible',
]) {
  assertIncludes(contractSource, token, `${contractPath} must include ${token}`);
}

for (const forbiddenToken of [
  'return true;',
  'visibility: "public"',
  'index_policy: "index"',
  'sitemap_policy: "included"',
  'manual_approved: true',
]) {
  assertNotIncludes(contractSource, forbiddenToken, `${contractPath} must not include unsafe shortcut ${forbiddenToken}.`);
}

for (const token of [
  'listAdminImportSitemapEligibleCandidates',
  'requireAdminPermission("imports.read")',
  'sitemapIncluded: false',
]) {
  assertIncludes(existingAdminSource, token, `${existingAdminPath} must preserve existing admin sitemap candidate behavior token ${token}`);
}

for (const token of [
  'PR 8: Sitemap Eligibility',
  'isSitemapEligible(entity)',
  'visibility = public',
  'index_policy = index',
  'sitemap_policy = included',
  'seo_validated = true',
  'geo_validated = true',
  'content_validated = true',
  'schema_validated = true',
  'relations_validated = true',
  'duplicate_check_passed = true',
  'manual_approved = true',
  'Sitemap generation must not read from raw entity tables directly.',
  'public_indexable_entities',
]) {
  assertIncludes(architectureSource, token, `${architecturePath} must include sitemap eligibility contract token ${token}`);
}

console.log('import sitemap eligibility check passed.');
