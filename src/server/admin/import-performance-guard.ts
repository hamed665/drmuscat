import "server-only";

export type ImportPublicPageDataSource =
  | "public_indexable_entities"
  | "entity_internal_links_cache"
  | "schema_projection"
  | "canonical_geo_projection"
  | "public_content_projection";

export type ImportPublicRenderOperation =
  | "read_public_entity_projection"
  | "read_internal_links_cache"
  | "read_schema_projection"
  | "read_canonical_geo_projection"
  | "read_public_content_projection"
  | "generate_internal_links"
  | "generate_schema"
  | "calculate_geo_distance"
  | "scan_raw_import_tables"
  | "write_publish_state";

export type ImportPerformanceBudget = {
  maxPublicRenderQueries: number;
  maxPublicRenderTtfbMs: number;
  maxPublicRenderPayloadKb: number;
  requireCachedInternalLinks: boolean;
  requirePrecomputedSchema: boolean;
  requireCanonicalGeoProjection: boolean;
};

export type ImportPublicRenderPlan = {
  routeId: string;
  operations: readonly ImportPublicRenderOperation[];
  dataSources: readonly ImportPublicPageDataSource[];
  queryCount: number;
  estimatedPayloadKb: number;
  usesIsrOrStaticGeneration: boolean;
};

export type ImportPerformanceBlocker =
  | "too_many_public_render_queries"
  | "public_render_payload_too_large"
  | "missing_isr_or_static_generation"
  | "internal_links_not_cached"
  | "schema_not_precomputed"
  | "canonical_geo_not_projected"
  | "raw_import_table_read_in_public_render"
  | "runtime_internal_link_generation"
  | "runtime_schema_generation"
  | "runtime_geo_distance_calculation"
  | "runtime_publish_state_write";

export const IMPORT_PUBLIC_PERFORMANCE_BUDGET: ImportPerformanceBudget = {
  maxPublicRenderQueries: 5,
  maxPublicRenderTtfbMs: 2000,
  maxPublicRenderPayloadKb: 256,
  requireCachedInternalLinks: true,
  requirePrecomputedSchema: true,
  requireCanonicalGeoProjection: true,
};

const blockedPublicRenderOperations = new Map<ImportPublicRenderOperation, ImportPerformanceBlocker>([
  ["generate_internal_links", "runtime_internal_link_generation"],
  ["generate_schema", "runtime_schema_generation"],
  ["calculate_geo_distance", "runtime_geo_distance_calculation"],
  ["scan_raw_import_tables", "raw_import_table_read_in_public_render"],
  ["write_publish_state", "runtime_publish_state_write"],
]);

export function getImportPerformanceBlockers(
  plan: ImportPublicRenderPlan,
  budget: ImportPerformanceBudget = IMPORT_PUBLIC_PERFORMANCE_BUDGET,
): readonly ImportPerformanceBlocker[] {
  const blockers: ImportPerformanceBlocker[] = [];

  if (plan.queryCount > budget.maxPublicRenderQueries) blockers.push("too_many_public_render_queries");
  if (plan.estimatedPayloadKb > budget.maxPublicRenderPayloadKb) blockers.push("public_render_payload_too_large");
  if (!plan.usesIsrOrStaticGeneration) blockers.push("missing_isr_or_static_generation");

  if (budget.requireCachedInternalLinks && !plan.dataSources.includes("entity_internal_links_cache")) {
    blockers.push("internal_links_not_cached");
  }

  if (budget.requirePrecomputedSchema && !plan.dataSources.includes("schema_projection")) {
    blockers.push("schema_not_precomputed");
  }

  if (budget.requireCanonicalGeoProjection && !plan.dataSources.includes("canonical_geo_projection")) {
    blockers.push("canonical_geo_not_projected");
  }

  for (const operation of plan.operations) {
    const blocker = blockedPublicRenderOperations.get(operation);
    if (blocker) blockers.push(blocker);
  }

  return [...new Set(blockers)];
}

export function isImportPublicRenderPlanWithinBudget(
  plan: ImportPublicRenderPlan,
  budget: ImportPerformanceBudget = IMPORT_PUBLIC_PERFORMANCE_BUDGET,
): boolean {
  return getImportPerformanceBlockers(plan, budget).length === 0;
}
