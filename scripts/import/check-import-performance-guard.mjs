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
  '"public_seo_projection"',
  '"public_nearby_entities_projection"',
  '"public_llm_answer_projection"',
  'export type ImportPublicRenderOperation',
  '"read_public_entity_projection"',
  '"read_internal_links_cache"',
  '"read_schema_projection"',
  '"read_canonical_geo_projection"',
  '"read_public_content_projection"',
  '"read_public_seo_projection"',
  '"read_public_nearby_entities_projection"',
  '"read_public_llm_answer_projection"',
  '"generate_internal_links"',
  '"generate_schema"',
  '"generate_seo_metadata"',
  '"generate_llm_answer_block"',
  '"calculate_geo_distance"',
  '"scan_raw_import_tables"',
  '"write_publish_state"',
  '"load_uncached_images"',
  '"load_unoptimized_fonts"',
  '"load_large_client_bundle"',
  'export type ImportPerformanceBudget',
  'maxPublicRenderQueries: number',
  'maxPublicRenderTtfbMs: number',
  'targetPublicRenderTtfbMs: number',
  'maxPublicRenderPayloadKb: number',
  'maxHtmlPayloadKb: number',
  'maxRouteJsPayloadKb: number',
  'maxAboveFoldImageCount: number',
  'maxLargestContentfulPaintMs: number',
  'maxInteractionToNextPaintMs: number',
  'maxCumulativeLayoutShift: number',
  'requireCachedInternalLinks: boolean',
  'requirePrecomputedSchema: boolean',
  'requireCanonicalGeoProjection: boolean',
  'requireSeoProjection: boolean',
  'requireNearbyEntitiesProjection: boolean',
  'requireLlmAnswerProjection: boolean',
  'requireStaticOrIsr: boolean',
  'requireOptimizedImages: boolean',
  'requireOptimizedFonts: boolean',
  'export type ImportPublicRenderPlan',
  'routeId: string',
  'operations: readonly ImportPublicRenderOperation[]',
  'dataSources: readonly ImportPublicPageDataSource[]',
  'queryCount: number',
  'estimatedPayloadKb: number',
  'estimatedTtfbMs?: number | null',
  'estimatedHtmlPayloadKb?: number | null',
  'estimatedRouteJsPayloadKb?: number | null',
  'aboveFoldImageCount?: number | null',
  'estimatedLargestContentfulPaintMs?: number | null',
  'estimatedInteractionToNextPaintMs?: number | null',
  'estimatedCumulativeLayoutShift?: number | null',
  'usesIsrOrStaticGeneration: boolean',
  'usesOptimizedImages?: boolean | null',
  'usesOptimizedFonts?: boolean | null',
  'export type ImportPerformanceBlocker',
  'too_many_public_render_queries',
  'public_render_ttfb_over_budget',
  'largest_contentful_paint_over_budget',
  'interaction_to_next_paint_over_budget',
  'cumulative_layout_shift_over_budget',
  'public_render_payload_too_large',
  'html_payload_too_large',
  'route_js_payload_too_large',
  'too_many_above_fold_images',
  'missing_isr_or_static_generation',
  'internal_links_not_cached',
  'schema_not_precomputed',
  'canonical_geo_not_projected',
  'seo_projection_missing',
  'nearby_entities_projection_missing',
  'llm_answer_projection_missing',
  'images_not_optimized',
  'fonts_not_optimized',
  'runtime_internal_link_generation',
  'runtime_schema_generation',
  'runtime_seo_metadata_generation',
  'runtime_llm_answer_generation',
  'runtime_geo_distance_calculation',
  'runtime_publish_state_write',
  'uncached_image_loading',
  'unoptimized_font_loading',
  'large_client_bundle_loading',
  'IMPORT_PUBLIC_PERFORMANCE_BUDGET',
  'maxPublicRenderQueries: 5',
  'maxPublicRenderTtfbMs: 2000',
  'targetPublicRenderTtfbMs: 800',
  'maxPublicRenderPayloadKb: 256',
  'maxHtmlPayloadKb: 120',
  'maxRouteJsPayloadKb: 180',
  'maxAboveFoldImageCount: 1',
  'maxLargestContentfulPaintMs: 2500',
  'maxInteractionToNextPaintMs: 200',
  'maxCumulativeLayoutShift: 0.1',
  'blockedPublicRenderOperations',
  'isExplicitlyFalse',
  'export function getImportPerformanceBlockers',
  'export function isImportPublicRenderPlanWithinBudget',
  'export function isImportPublicRenderPlanFastEnoughForTarget',
]) {
  assertIncludes(performanceSource, token, `${performancePath} must include ${token}`);
}

for (const forbiddenToken of [
  'return true;',
  'maxPublicRenderQueries: 999',
  'requireCachedInternalLinks: false',
  'requirePrecomputedSchema: false',
  'requireCanonicalGeoProjection: false',
  'requireSeoProjection: false',
  'requireNearbyEntitiesProjection: false',
  'requireLlmAnswerProjection: false',
  'requireStaticOrIsr: false',
  'requireOptimizedImages: false',
  'requireOptimizedFonts: false',
]) {
  assertNotIncludes(performanceSource, forbiddenToken, `${performancePath} must not include unsafe performance shortcut ${forbiddenToken}.`);
}

for (const token of [
  'PR 12: Performance Guard',
  'Goal: public profile pages must stay fast and avoid heavy runtime work.',
  'Public pages should read only page-ready data.',
  'Internal links must be read from cache.',
  'Schema should be precomputed or lightweight.',
  'Sitemap runtime must not run heavy validation or geo queries.',
  'No heavy distance calculation should happen during public page render.',
  'Admin/import workflows may perform heavy validation outside the public render path.',
  'Public pages should remain under 2 seconds for TTFB/render budget under normal production conditions.',
  'entity_internal_links_cache',
  'public_indexable_entities or equivalent validated projection',
]) {
  assertIncludes(architectureSource, token, `${architecturePath} must include performance contract token ${token}`);
}

console.log('import performance guard check passed.');
