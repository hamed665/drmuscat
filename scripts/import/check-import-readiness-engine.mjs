import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const enginePath = 'src/server/admin/import-readiness-engine.ts';
const lifecyclePath = 'src/server/admin/import-publish-lifecycle.ts';
const sitemapPath = 'src/server/admin/import-sitemap-eligibility-contract.ts';
const schemaPath = 'src/server/admin/import-schema-validation.ts';
const geoPath = 'src/server/admin/import-canonical-geo.ts';
const publicationPath = 'src/server/admin/import-publication-validation.ts';

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

const engineSource = await readText(enginePath);
const lifecycleSource = await readText(lifecyclePath);
const sitemapSource = await readText(sitemapPath);
const schemaSource = await readText(schemaPath);
const geoSource = await readText(geoPath);
const publicationSource = await readText(publicationPath);

for (const token of [
  'export type ImportReadinessCategory',
  'export type ImportReadinessSeverity',
  'export type ImportReadinessNextAction',
  'export type ImportReadinessBlocker',
  'export type ImportReadinessInput',
  'export type ImportEntityReadiness',
  'score: number',
  'publishReady: boolean',
  'sitemapReady: boolean',
  'blockers: readonly ImportReadinessBlocker[]',
  'warnings: readonly ImportReadinessBlocker[]',
  'nextAction: ImportReadinessNextAction',
  'categoryWeights',
  'geo: 20',
  'seo: 20',
  'schema: 20',
  'relations: 20',
  'manual: 10',
  'duplicate: 10',
  'severityForCategory',
  'suggestedActionForCategory',
  'categoryFromPublicationBlocker',
  'categoryFromPublishBlocker',
  'scoreFromBlockers',
  'selectNextAction',
  'export function getEntityReadiness',
  'export function getEntityReadinessScore',
  'getPublishBlockers',
  'getSitemapBlockers',
  'getImportPublicationValidationBlockers',
  'getSchemaBlockers',
]) {
  assertIncludes(engineSource, token, `${enginePath} must include ${token}`);
}

for (const forbiddenToken of [
  'return true;',
  'score: 100,',
  'publishReady: true,',
  'sitemapReady: true,',
]) {
  assertNotIncludes(engineSource, forbiddenToken, `${enginePath} must not include unsafe shortcut ${forbiddenToken}.`);
}

for (const token of ['getPublishBlockers', 'canPublishEntity', 'getReadinessStatus']) {
  assertIncludes(lifecycleSource, token, `${lifecyclePath} must still include ${token}`);
}

for (const token of ['getSitemapBlockers', 'isSitemapEligible']) {
  assertIncludes(sitemapSource, token, `${sitemapPath} must still include ${token}`);
}

for (const token of ['getSchemaBlockers', 'validateGeneratedSchema', 'isSchemaReady']) {
  assertIncludes(schemaSource, token, `${schemaPath} must still include ${token}`);
}

for (const token of ['getCanonicalGeoBlockers', 'isCanonicalGeoPublishReady']) {
  assertIncludes(geoSource, token, `${geoPath} must still include ${token}`);
}

for (const token of ['getImportPublicationValidationBlockers', 'isImportPublicationValidationReady']) {
  assertIncludes(publicationSource, token, `${publicationPath} must still include ${token}`);
}

console.log('import readiness engine check passed.');
