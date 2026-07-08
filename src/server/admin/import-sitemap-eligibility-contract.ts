import "server-only";

export type ImportSitemapVisibilityPolicy = "private" | "public";
export type ImportSitemapIndexPolicy = "noindex" | "index";
export type ImportSitemapPolicy = "excluded" | "included";

export type ImportSitemapEligibilityEntity = {
  visibility: ImportSitemapVisibilityPolicy | null;
  index_policy: ImportSitemapIndexPolicy | null;
  sitemap_policy: ImportSitemapPolicy | null;
  seo_validated: boolean | null;
  geo_validated: boolean | null;
  content_validated: boolean | null;
  schema_validated: boolean | null;
  relations_validated: boolean | null;
  duplicate_check_passed: boolean | null;
  manual_approved: boolean | null;
  canonical_validated: boolean | null;
};

export type ImportSitemapEligibilityBlocker =
  | "visibility_not_public"
  | "index_policy_not_index"
  | "sitemap_policy_not_included"
  | "seo_not_validated"
  | "geo_not_validated"
  | "content_not_validated"
  | "schema_not_validated"
  | "relations_not_validated"
  | "duplicate_check_not_passed"
  | "manual_approval_missing"
  | "canonical_not_validated";

export const IMPORT_SITEMAP_VALIDATED_PROJECTION = "public_indexable_entities";

export const IMPORT_SITEMAP_FILES = [
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

export function getSitemapBlockers(entity: ImportSitemapEligibilityEntity): readonly ImportSitemapEligibilityBlocker[] {
  const blockers: ImportSitemapEligibilityBlocker[] = [];

  if (entity.visibility !== "public") blockers.push("visibility_not_public");
  if (entity.index_policy !== "index") blockers.push("index_policy_not_index");
  if (entity.sitemap_policy !== "included") blockers.push("sitemap_policy_not_included");
  if (entity.seo_validated !== true) blockers.push("seo_not_validated");
  if (entity.geo_validated !== true) blockers.push("geo_not_validated");
  if (entity.content_validated !== true) blockers.push("content_not_validated");
  if (entity.schema_validated !== true) blockers.push("schema_not_validated");
  if (entity.relations_validated !== true) blockers.push("relations_not_validated");
  if (entity.duplicate_check_passed !== true) blockers.push("duplicate_check_not_passed");
  if (entity.manual_approved !== true) blockers.push("manual_approval_missing");
  if (entity.canonical_validated !== true) blockers.push("canonical_not_validated");

  return [...new Set(blockers)];
}

export function isSitemapEligible(entity: ImportSitemapEligibilityEntity): boolean {
  return getSitemapBlockers(entity).length === 0;
}
