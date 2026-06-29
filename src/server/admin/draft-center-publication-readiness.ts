import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/lib/supabase/types";
import { requireAdminPermission } from "@/server/admin/permissions";

type CenterRow = Database["public"]["Tables"]["centers"]["Row"];
type ProviderStatus = Database["public"]["Enums"]["provider_status"];
type VerificationStatus = Database["public"]["Enums"]["verification_status"];

type ReadinessCenterRow = Pick<
  CenterRow,
  | "id"
  | "slug"
  | "name_en"
  | "name_ar"
  | "status"
  | "verification_status"
  | "is_active"
  | "is_claimable"
  | "short_description_en"
  | "short_description_ar"
  | "description_en"
  | "description_ar"
>;

type ReadinessLocationRow = {
  id: string;
  is_active: boolean;
};

type ReadinessTaxonomyRow = {
  id: string;
  is_primary: boolean;
  is_public: boolean;
  review_status: string;
};

type QueryError = { message?: string };
type QueryResponse<T> = { data: T | null; error: QueryError | null };

type QueryBuilder<T> = PromiseLike<QueryResponse<T>> & {
  eq(column: string, value: unknown): QueryBuilder<T>;
  in(column: string, values: readonly unknown[]): QueryBuilder<T>;
  is(column: string, value: boolean | null): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  maybeSingle(): Promise<QueryResponse<T>>;
  select(columns: string): QueryBuilder<T>;
};

type UntypedSupabaseClient = {
  from<T>(table: string): QueryBuilder<T>;
};

export type DraftCenterPublicationEvidenceSummary = {
  activeLocationCount: number;
  centerStatus: ProviderStatus;
  contactVisibilityRequired: false;
  descriptionPresent: boolean;
  publicActive: boolean;
  publicClaimable: boolean;
  qualityBlockers: number;
  qualityWarnings: number;
  slug: string;
  taxonomyReviewStatus: string | null;
  verificationStatus: VerificationStatus;
};

export type DraftCenterPublicationReadiness = {
  blockers: string[];
  canPublish: boolean;
  evidenceSummary: DraftCenterPublicationEvidenceSummary;
  stillNotPublic: true;
  warnings: string[];
};

export type DraftCenterPublicationReadinessResult =
  | { ok: true; readiness: DraftCenterPublicationReadiness }
  | { ok: false; reason: "not_found" | "unavailable" };

const prePublicationStatuses = ["pending_review"] as const satisfies readonly ProviderStatus[];

function readinessClient(): UntypedSupabaseClient {
  return createSupabaseServiceRoleClient() as unknown as UntypedSupabaseClient;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function hasText(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function descriptionPresent(center: ReadinessCenterRow): boolean {
  return (
    hasText(center.short_description_en) ||
    hasText(center.short_description_ar) ||
    hasText(center.description_en) ||
    hasText(center.description_ar)
  );
}

function qualityIssues(input: {
  activeLocationCount: number;
  center: ReadinessCenterRow;
  taxonomy: ReadinessTaxonomyRow | null;
}) {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!prePublicationStatuses.includes(input.center.status)) {
    blockers.push("Center must be in pending_review before publication readiness can pass.");
  }

  if (input.center.is_active || input.center.is_claimable) {
    blockers.push("Center public flags must remain disabled before the publication workflow.");
  }

  if (input.center.verification_status === "rejected" || input.center.verification_status === "suspended") {
    blockers.push("Verification status blocks publication readiness.");
  }

  if (input.activeLocationCount < 1) {
    blockers.push("At least one internally active location is required.");
  }

  if (input.taxonomy === null) {
    blockers.push("A primary taxonomy assignment is required.");
  } else if (input.taxonomy.review_status !== "approved") {
    blockers.push("Primary taxonomy assignment must be approved.");
  }

  if (!hasText(input.center.name_en)) {
    blockers.push("English center name is required.");
  }

  if (!hasText(input.center.name_ar)) {
    warnings.push("Arabic center name is missing and may need a reviewed fallback.");
  }

  if (!descriptionPresent(input.center)) {
    warnings.push("Description content is missing.");
  }

  if (input.center.verification_status === "unverified" || input.center.verification_status === "pending") {
    warnings.push("Verification is not marked verified yet.");
  }

  return { blockers, warnings };
}

export async function getDraftCenterPublicationReadiness(
  centerId: string,
): Promise<DraftCenterPublicationReadinessResult> {
  await requireAdminPermission("draft_centers.read");

  if (!isUuid(centerId)) {
    return { ok: false, reason: "not_found" };
  }

  const supabase = readinessClient();

  const { data: center, error: centerError } = await supabase
    .from<ReadinessCenterRow>("centers")
    .select("id,slug,name_en,name_ar,status,verification_status,is_active,is_claimable,short_description_en,short_description_ar,description_en,description_ar")
    .eq("id", centerId)
    .is("deleted_at", null)
    .maybeSingle();

  if (centerError !== null) return { ok: false, reason: "unavailable" };
  if (center === null) return { ok: false, reason: "not_found" };

  const [{ data: locations, error: locationsError }, { data: taxonomy, error: taxonomyError }] = await Promise.all([
    supabase
      .from<ReadinessLocationRow[]>("center_locations")
      .select("id,is_active")
      .eq("center_id", centerId)
      .eq("is_active", true)
      .is("deleted_at", null)
      .limit(50),
    supabase
      .from<ReadinessTaxonomyRow>("center_category_assignments")
      .select("id,is_primary,is_public,review_status")
      .eq("center_id", centerId)
      .eq("is_primary", true)
      .is("deleted_at", null)
      .maybeSingle(),
  ]);

  if (locationsError !== null || taxonomyError !== null || locations === null) {
    return { ok: false, reason: "unavailable" };
  }

  const activeLocationCount = locations.length;
  const issues = qualityIssues({ activeLocationCount, center, taxonomy });
  const qualityBlockers = issues.blockers.length;
  const qualityWarnings = issues.warnings.length;

  return {
    ok: true,
    readiness: {
      blockers: issues.blockers,
      canPublish: qualityBlockers === 0,
      evidenceSummary: {
        activeLocationCount,
        centerStatus: center.status,
        contactVisibilityRequired: false,
        descriptionPresent: descriptionPresent(center),
        publicActive: center.is_active,
        publicClaimable: center.is_claimable,
        qualityBlockers,
        qualityWarnings,
        slug: center.slug,
        taxonomyReviewStatus: taxonomy?.review_status ?? null,
        verificationStatus: center.verification_status,
      },
      stillNotPublic: true,
      warnings: issues.warnings,
    },
  };
}
