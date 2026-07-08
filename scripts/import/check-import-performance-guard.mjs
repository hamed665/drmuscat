import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const performancePath = 'src/server/admin/import-performance-guard.ts';
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

const performanceSource = await readText(performancePath);
const architectureSource = await readText(architecturePath);

for (const token of [
  'export type ImportPublicPageDataSource',
  '"public_indexable_entities"',
  '"entity_internal_links_cache"',
  '"schema_projection"',
  '"canonical_geo_projection"',
  '"public_content_projection"',
  'export type ImportPublicRenderOperation',
  '"read_public_entity_projection"',
  '"read_internal_links_cache"',
  '"read_schema_projection"',
  '"read_canonical_geo_projection"',
  '"read_public_content_projection"',
  '"generate_internal_links"',
  '"generate_schema"',
  '"calculate_geo_distance"',
  '"scan_raw_import_tables"',
  '"write_publish_state"',
  'export type ImportPerformanceBudget',
  'maxPublicRenderQueries: number',
  'maxPublicRenderTtfbMs: number',
  'maxPublicRenderPayloadKb: number',
  'requireCachedInternalLinks: boolean',
  'requirePrecomputedSchema: boolean',
  'requireCanonicalGeoProjection: boolean',
  'export type ImportPublicRenderPlan',
  'routeId: string',
  'operations: readonly ImportPublicRenderOperation[]',
  'dataSources: readonly ImportPublicPageDataSource[]',
  'queryCount: number',
  'estimatedPayloadKb: number',
  'usesIsrOrStaticGeneration: boolean',
  'export type ImportPerformanceBlocker',
  'too_many_public_render_queries',
  'public_render_payload_too_large',
  'missing_isr_or_static_generation',
  'internal_links_not_cached',
  'schema_not_precomputed',
  'canonical_geo_not_projected',
  'raw_import_table_read_in_public_render',
  'runtime_internal_link_generation',
  'runtime_schema_generation',
  'runtime_geo_distance_calculation',
  'runtime_publish_state_write',
  'IMPORT_PUBLIC_PERFORMANCE_BUDGET',
  'maxPublicRenderQueries: 5',
  'maxPublicRenderTtfbMs: 2000',
  'maxPublicRenderPayloadKb: 256',
  'blockedPublicRenderOperations',
  'export function getImportPerformanceBlockers',
  'export function isImportPublicRenderPlanWithinBudget',
]) {
  assertIncludes(performanceSource, token, `${performancePath} must include ${token}`);
}

for (const forbiddenToken of [
  'return true;',
  'maxPublicRenderQueries: 999',
  'requireCachedInternalLinks: false',
  'requirePrecomputedSchema: false',
  'requireCanonicalGeoProjection: false',
]) {
  assertNotIncludes(performanceSource, forbiddenToken, `${performancePath} must not include unsafe performance shortcut ${forbiddenToken}.`);
}

for (const token of [
  'PR 10: Performance Guard',
  'Public rendering must read from lightweight projections and caches only.',
  'Public render must not generate links, schema, or geo calculations on the fly.',
  'Public render query count should stay within a small fixed budget.',
  'Internal links must come from `entity_internal_links_cache`.',
  'Schema must come from a precomputed projection.',
  'Canonical geo must come from a projection/cache.',
]) {
  assertIncludes(architectureSource, token, `${architecturePath} must include performance contract token ${token}`);
}

console.log('import performance guard check passed.');
