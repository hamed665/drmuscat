"use server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { writeAdminAuditEvent } from "@/server/admin/audit-log";
import { requireAdminPermission } from "@/server/admin/permissions";

type DuplicateResolutionStatus = "same_entity" | "different_entity" | "needs_manual_review" | "ignored";

type QueryResult<T> = { data: T[] | null; error: unknown | null };
type SingleQueryResult<T> = { data: T | null; error: unknown | null };
type MutationPayload = Record<string, unknown>;

type ImportResolutionQueryBuilder<T> = PromiseLike<QueryResult<T>> & {
  select(columns: string): ImportResolutionQueryBuilder<T>;
  eq(column: string, value: string | number | boolean): ImportResolutionQueryBuilder<T>;
  limit(count: number): ImportResolutionQueryBuilder<T>;
  update(values: MutationPayload): ImportResolutionQueryBuilder<T>;
  maybeSingle(): Promise<SingleQueryResult<T>>;
};

type ImportResolutionClient = {
  from<T extends object = Record<string, unknown>>(table: string): ImportResolutionQueryBuilder<T>;
};

type DuplicateCandidateForResolution = {
  id: string;
  batch_id: string;
  raw_row_id: string;
  resolution_status: string;
  metadata: unknown;
};

type DuplicateCandidateCounterRow = {
  raw_row_id: string;
  resolution_status: string;
  metadata: unknown;
};

export type ResolveImportDuplicateResult =
  | { ok: true; batchId: string; resolutionStatus: DuplicateResolutionStatus }
  | { ok: false; reason: "invalid" | "not_found" | "unavailable" };

function createImportResolutionClient(): ImportResolutionClient {
  return createSupabaseServiceRoleClient() as unknown as ImportResolutionClient;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function isDuplicateResolutionStatus(value: string): value is DuplicateResolutionStatus {
  return value === "same_entity" || value === "different_entity" || value === "needs_manual_review" || value === "ignored";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readMatchedRawRowId(metadata: unknown): string | null {
  if (!isRecord(metadata)) return null;
  const value = metadata.matched_raw_row_id;
  return typeof value === "string" && isUuid(value) ? value : null;
}

function countSuspectedRows(rows: DuplicateCandidateCounterRow[]): number {
  const ids = new Set<string>();

  for (const row of rows) {
    if (row.resolution_status === "different_entity" || row.resolution_status === "ignored") continue;
    ids.add(row.raw_row_id);
    const matchedRawRowId = readMatchedRawRowId(row.metadata);
    if (matchedRawRowId !== null) ids.add(matchedRawRowId);
  }

  return ids.size;
}

export async function resolveAdminImportDuplicateCandidate(
  duplicateCandidateId: string,
  resolutionStatus: string,
): Promise<ResolveImportDuplicateResult> {
  const admin = await requireAdminPermission("imports.review");

  if (!isUuid(duplicateCandidateId) || !isDuplicateResolutionStatus(resolutionStatus)) {
    return { ok: false, reason: "invalid" };
  }

  const supabase = createImportResolutionClient();
  const candidateResult = await supabase
    .from<DuplicateCandidateForResolution>("import_duplicate_candidates")
    .select("id, batch_id, raw_row_id, resolution_status, metadata")
    .eq("id", duplicateCandidateId)
    .maybeSingle();

  if (candidateResult.error !== null) {
    return { ok: false, reason: "unavailable" };
  }

  if (candidateResult.data === null) {
    return { ok: false, reason: "not_found" };
  }

  const now = new Date().toISOString();
  const oldStatus = candidateResult.data.resolution_status;
  const oldMetadata = isRecord(candidateResult.data.metadata) ? candidateResult.data.metadata : {};

  const updateResult = await supabase
    .from("import_duplicate_candidates")
    .update({
      resolution_status: resolutionStatus,
      resolved_by_profile_id: admin.profile.id,
      resolved_at: now,
      metadata: {
        ...oldMetadata,
        admin_resolution_version: "v1",
        previous_resolution_status: oldStatus,
        resolved_status: resolutionStatus,
        resolved_at: now,
      },
    })
    .eq("id", duplicateCandidateId);

  if (updateResult.error !== null) {
    return { ok: false, reason: "unavailable" };
  }

  const candidatesResult = await supabase
    .from<DuplicateCandidateCounterRow>("import_duplicate_candidates")
    .select("raw_row_id, resolution_status, metadata")
    .eq("batch_id", candidateResult.data.batch_id)
    .limit(1000);

  if (candidatesResult.error !== null || candidatesResult.data === null) {
    return { ok: false, reason: "unavailable" };
  }

  const duplicateSuspectedRows = countSuspectedRows(candidatesResult.data);
  const batchUpdateResult = await supabase
    .from("import_batches")
    .update({
      duplicate_suspected_rows: duplicateSuspectedRows,
      metadata: {
        duplicate_resolution_version: "v1",
        last_duplicate_resolution_status: resolutionStatus,
        last_duplicate_candidate_id: duplicateCandidateId,
        duplicate_suspected_rows: duplicateSuspectedRows,
      },
    })
    .eq("id", candidateResult.data.batch_id);

  if (batchUpdateResult.error !== null) {
    return { ok: false, reason: "unavailable" };
  }

  await writeAdminAuditEvent({
    admin,
    permissionKey: "imports.review",
    action: "import_review.status_changed",
    entityType: "import_duplicate_candidate",
    entityId: duplicateCandidateId,
    targetTable: "import_duplicate_candidates",
    summary: "Import duplicate candidate resolution status changed.",
    oldValues: { resolutionStatus: oldStatus },
    newValues: { resolutionStatus },
    metadata: {
      batchId: candidateResult.data.batch_id,
      rawRowId: candidateResult.data.raw_row_id,
      duplicateSuspectedRows,
    },
  });

  return {
    ok: true,
    batchId: candidateResult.data.batch_id,
    resolutionStatus,
  };
}
