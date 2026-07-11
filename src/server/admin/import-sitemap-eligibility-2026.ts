import "server-only";

import type { ImportAreaLandingEligibilityResult } from "./import-area-landing-eligibility";
import type { ImportInternalLinkIntelligenceResult } from "./import-internal-link-intelligence";
import type { ImportPageValueGateResult } from "./import-page-value-gate";
import type { ImportPerformanceBlocker } from "./import-performance-guard";
import type { ImportPublicProjectionManifest } from "./import-public-projection-layer";
import type { ImportSeoProfileReadiness } from "./import-seo-profile-contract";

export type ImportSitemap2026PageClass =
  | "entity_profile"
  | "specialty_directory"
  | "service_directory"
  | "area_landing"
  | "guide";

export type ImportSitemap2026VisibilityPolicy = "private" | "public";
export type ImportSitemap2026IndexPolicy = "noindex" | "index";
export type ImportSitemap2026Policy = "excluded" | "included";

export type ImportSitemapEligibility2026Input = {
  pageClass: ImportSitemap2026PageClass;
  routeId: string;
  canonicalPath: string | null;
  visibility: ImportSitemap2026VisibilityPolicy;
  indexPolicy: ImportSitemap2026IndexPolicy;
  sitemapPolicy: ImportSitemap2026Policy;
  seoProfile: ImportSeoProfileReadiness;
  pageValue: ImportPageValueGateResult;
  internalLinks: ImportInternalLinkIntelligenceResult;
  areaLanding: ImportAreaLandingEligibilityResult | null;
  publicProjection: ImportPublicProjectionManifest;
  performanceBlockers: readonly ImportPerformanceBlocker[];
  schemaProjectionReady: boolean;
  duplicateCheckPassed: boolean;
  manualApprovalComplete: boolean;
  publishReady: boolean;
};

export type ImportSitemapEligibility2026Blocker =
  | "visibility_not_public"
  | "index_policy_not_index"
  | "sitemap_policy_not_included"
  | "publish_not_ready"
  | "seo_profile_not_ready"
  | "page_value_not_ready"
  | "internal_links_not_ready"
  | "area_landing_not_eligible"
  | "public_projection_not_ready"
  | "schema_projection_not_ready"
  | "performance_budget_not_ready"
  | "duplicate_check_not_passed"
  | "manual_approval_missing"
  | "canonical_path_missing"
  | "canonical_route_mismatch";

export type ImportSitemapEligibility2026Result = {
  sitemapEligible: boolean;
  publishReady: boolean;
  blockers: readonly ImportSitemapEligibility2026Blocker[];
  validatedProjection: "public_indexable_entities";
};

export const IMPORT_SITEMAP_2026_VALIDATED_PROJECTION =
  "public_indexable_entities" as const;

export const IMPORT_SITEMAP_2026_FILES = [
  "/sitemaps/doctors.xml",
  "/sitemaps/pharmacies.xml",
  "/sitemaps/hospitals.xml",
  "/sitemaps/clinics.xml",
  "/sitemaps/dental.xml",
  "/sitemaps/beauty.xml",
  "/sitemaps/pet.xml",
  "/sitemaps/locations.xml",
  "/sitemaps/articles.xml",
] as const;

function hasReadyRequiredProjection(
  manifest: ImportPublicProjectionManifest,
  pageClass: ImportSitemap2026PageClass,
): boolean {
  const requiredKind = pageClass === "area_landing" ? "area_page" : "entity";
  return manifest.records.some(
    (record) =>
      record.kind === requiredKind &&
      record.status === "ready" &&
      record.routeId === manifest.routeId &&
      record.buildSources.length > 0,
  );
}

function isCanonicalRouteAligned(
  routeId: string,
  canonicalPath: string | null,
): boolean {
  if (!canonicalPath) return false;
  const normalizedRoute = routeId.startsWith("/") ? routeId : `/${routeId}`;
  return canonicalPath === normalizedRoute;
}

export function getImportSitemapEligibility2026(
  input: ImportSitemapEligibility2026Input,
): ImportSitemapEligibility2026Result {
  const blockers: ImportSitemapEligibility2026Blocker[] = [];

  if (input.visibility !== "public") blockers.push("visibility_not_public");
  if (input.indexPolicy !== "index") blockers.push("index_policy_not_index");
  if (input.sitemapPolicy !== "included") blockers.push("sitemap_policy_not_included");
  if (!input.publishReady) blockers.push("publish_not_ready");
  if (!input.seoProfile.seoProfileReady) blockers.push("seo_profile_not_ready");
  if (!input.pageValue.pageValueReady) blockers.push("page_value_not_ready");
  if (!input.internalLinks.internalLinksReady) blockers.push("internal_links_not_ready");
  if (
    input.pageClass === "area_landing" &&
    input.areaLanding?.areaLandingEligible !== true
  ) {
    blockers.push("area_landing_not_eligible");
  }
  if (!hasReadyRequiredProjection(input.publicProjection, input.pageClass)) {
    blockers.push("public_projection_not_ready");
  }
  if (!input.schemaProjectionReady) blockers.push("schema_projection_not_ready");
  if (input.performanceBlockers.length > 0) blockers.push("performance_budget_not_ready");
  if (!input.duplicateCheckPassed) blockers.push("duplicate_check_not_passed");
  if (!input.manualApprovalComplete) blockers.push("manual_approval_missing");
  if (!input.canonicalPath?.trim()) blockers.push("canonical_path_missing");
  else if (!isCanonicalRouteAligned(input.routeId, input.canonicalPath)) {
    blockers.push("canonical_route_mismatch");
  }

  const uniqueBlockers = Array.from(new Set(blockers));
  return {
    sitemapEligible: uniqueBlockers.length === 0,
    publishReady: input.publishReady,
    blockers: uniqueBlockers,
    validatedProjection: IMPORT_SITEMAP_2026_VALIDATED_PROJECTION,
  };
}

export function isImportSitemapEligible2026(
  input: ImportSitemapEligibility2026Input,
): boolean {
  return getImportSitemapEligibility2026(input).sitemapEligible;
}
