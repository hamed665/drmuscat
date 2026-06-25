import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export type PublicImportProfileFamily = "doctors" | "hospitals" | "clinics" | "pharmacies" | "labs";

export type PublicImportProfile = {
  family: PublicImportProfileFamily;
  canonicalPath: string;
  entityType: string;
  name: string;
  nameAr: string | null;
  area: string | null;
  wilayat: string | null;
  governorate: string | null;
  primarySpecialty: string | null;
  services: string[];
  departments: string[];
  languages: string[];
  phoneE164: string | null;
  whatsappE164: string | null;
  websiteUrl: string | null;
  googleMapsUrl: string | null;
  directionUrl: string | null;
  sourceName: string | null;
  lastCheckedAt: string | null;
  qualityScore: number;
};

export type GetPublicImportProfileResult =
  | { ok: true; profile: PublicImportProfile }
  | { ok: false; reason: "not_found" };

type QueryResult<T> = { data: T[] | null; error: unknown | null };
type SingleQueryResult<T> = { data: T | null; error: unknown | null };

type ImportProfileQueryBuilder<T> = PromiseLike<QueryResult<T>> & {
  select(columns: string): ImportProfileQueryBuilder<T>;
  eq(column: string, value: string | number | boolean): ImportProfileQueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean }): ImportProfileQueryBuilder<T>;
  limit(count: number): ImportProfileQueryBuilder<T>;
  maybeSingle(): Promise<SingleQueryResult<T>>;
};

type ImportProfileClient = {
  from<T extends object = Record<string, unknown>>(table: string): ImportProfileQueryBuilder<T>;
};

type ImportPublishQueueRow = {
  id: string;
  target_entity_type: string;
  publish_status: string;
  index_policy: string;
  sitemap_policy: string;
  quality_score: number;
  metadata: unknown;
};

type ImportEntityCandidateRow = {
  id: string;
  entity_type: string;
  candidate_status: string;
  candidate_payload: unknown;
};

type JsonRecord = Record<string, unknown>;

type GuardInput = {
  locale: string;
  country: string;
  family: PublicImportProfileFamily;
  slug: string;
};

const publicProfileLookupLimit = 1000;

function createImportProfileClient(): ImportProfileClient {
  return createSupabaseServiceRoleClient() as unknown as ImportProfileClient;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRecord(value: unknown, key: string): JsonRecord {
  if (!isRecord(value)) return {};
  const result = value[key];
  return isRecord(result) ? result : {};
}

function readString(value: JsonRecord, key: string): string | null {
  const result = value[key];
  if (typeof result !== "string") return null;
  const trimmed = result.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readNumber(value: JsonRecord, key: string): number | null {
  const result = value[key];
  return typeof result === "number" && Number.isFinite(result) ? result : null;
}

function readStringArray(value: JsonRecord, key: string): string[] {
  const result = value[key];
  if (!Array.isArray(result)) return [];
  return result.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function normalizeSlug(value: string): string | null {
  const trimmed = value.trim().toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed) ? trimmed : null;
}

function isSupportedLocale(value: string): value is "en" | "ar" {
  return value === "en" || value === "ar";
}

function isSupportedCountry(value: string): value is "om" {
  return value === "om";
}

function familyEntityTypes(family: PublicImportProfileFamily): readonly string[] {
  switch (family) {
    case "doctors":
      return ["doctor"];
    case "hospitals":
      return ["hospital"];
    case "clinics":
      return ["clinic", "medical_center"];
    case "pharmacies":
      return ["pharmacy"];
    case "labs":
      return ["laboratory"];
  }
}

function canonicalPathForInput(input: GuardInput, slug: string): string | null {
  if (!isSupportedLocale(input.locale)) return null;
  if (!isSupportedCountry(input.country)) return null;
  return `/${input.locale}/${input.country}/${input.family}/${slug}`;
}

function readCandidateId(metadata: unknown): string | null {
  if (!isRecord(metadata)) return null;
  return readString(metadata, "import_entity_candidate_id");
}

function rowHasSafeIncludedState(
  row: ImportPublishQueueRow,
  family: PublicImportProfileFamily,
  canonicalPath: string,
): boolean {
  if (row.publish_status !== "index_eligible") return false;
  if (row.index_policy !== "index") return false;
  if (row.sitemap_policy !== "included") return false;
  if (!familyEntityTypes(family).includes(row.target_entity_type)) return false;
  if (!isRecord(row.metadata)) return false;
  if (row.metadata.sitemap_included !== true) return false;
  if (readString(row.metadata, "robots_policy") !== "index") return false;
  return readString(row.metadata, "canonical_path") === canonicalPath;
}

function buildProfile(
  family: PublicImportProfileFamily,
  canonicalPath: string,
  queueRow: ImportPublishQueueRow,
  candidate: ImportEntityCandidateRow,
): PublicImportProfile | null {
  if (candidate.candidate_status !== "approved") return null;
  if (!familyEntityTypes(family).includes(candidate.entity_type)) return null;
  if (!familyEntityTypes(family).includes(queueRow.target_entity_type)) return null;
  if (!isRecord(candidate.candidate_payload)) return null;

  const payload = candidate.candidate_payload;
  const identity = readRecord(payload, "identity");
  const contact = readRecord(payload, "contact");
  const geo = readRecord(payload, "geo");
  const taxonomy = readRecord(payload, "taxonomy");
  const source = readRecord(payload, "source");
  const quality = readRecord(payload, "quality");
  const primaryName = readString(identity, "primaryName") ?? readString(identity, "nameEn");
  if (primaryName === null) return null;

  return {
    family,
    canonicalPath,
    entityType: candidate.entity_type,
    name: primaryName,
    nameAr: readString(identity, "nameAr"),
    area: readString(geo, "area"),
    wilayat: readString(geo, "wilayat"),
    governorate: readString(geo, "governorate"),
    primarySpecialty: readString(taxonomy, "primarySpecialty"),
    services: readStringArray(taxonomy, "services"),
    departments: readStringArray(taxonomy, "departments"),
    languages: readStringArray(payload, "languages"),
    phoneE164: readString(contact, "phoneE164"),
    whatsappE164: readString(contact, "whatsappE164"),
    websiteUrl: readString(contact, "websiteUrl"),
    googleMapsUrl: readString(contact, "googleMapsUrl"),
    directionUrl: readString(contact, "directionUrl"),
    sourceName: readString(source, "sourceName"),
    lastCheckedAt: readString(source, "lastCheckedAt"),
    qualityScore: Math.max(0, Math.min(100, readNumber(quality, "score") ?? queueRow.quality_score)),
  };
}

export async function getPublicImportProfile(input: GuardInput): Promise<GetPublicImportProfileResult> {
  try {
    const slug = normalizeSlug(input.slug);
    if (slug === null) return { ok: false, reason: "not_found" };

    const canonicalPath = canonicalPathForInput(input, slug);
    if (canonicalPath === null) return { ok: false, reason: "not_found" };

    const supabase = createImportProfileClient();
    const queueResult = await supabase
      .from<ImportPublishQueueRow>("import_publish_queue")
      .select("id, target_entity_type, publish_status, index_policy, sitemap_policy, quality_score, metadata")
      .eq("sitemap_policy", "included")
      .eq("index_policy", "index")
      .eq("publish_status", "index_eligible")
      .order("updated_at", { ascending: false })
      .limit(publicProfileLookupLimit);

    if (queueResult.error !== null || queueResult.data === null) return { ok: false, reason: "not_found" };

    const queueRow = queueResult.data.find((row) => rowHasSafeIncludedState(row, input.family, canonicalPath));
    if (!queueRow) return { ok: false, reason: "not_found" };

    const candidateId = readCandidateId(queueRow.metadata);
    if (candidateId === null) return { ok: false, reason: "not_found" };

    const candidateResult = await supabase
      .from<ImportEntityCandidateRow>("import_entity_candidates")
      .select("id, entity_type, candidate_status, candidate_payload")
      .eq("id", candidateId)
      .eq("candidate_status", "approved")
      .maybeSingle();

    if (candidateResult.error !== null || candidateResult.data === null) return { ok: false, reason: "not_found" };

    const profile = buildProfile(input.family, canonicalPath, queueRow, candidateResult.data);
    return profile === null ? { ok: false, reason: "not_found" } : { ok: true, profile };
  } catch {
    return { ok: false, reason: "not_found" };
  }
}
