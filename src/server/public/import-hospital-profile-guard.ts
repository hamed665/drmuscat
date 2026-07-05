import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export type PublicImportHospitalRelatedDoctor = {
  name: string;
  nameAr: string | null;
  slug: string | null;
  specialty: string | null;
  department: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  lastCheckedAt: string | null;
  confidence: string | null;
};

export type PublicImportHospitalLocalSuggestionFamily = "doctor" | "pharmacy" | "hospital" | "radiology" | "dentistry" | "beauty";

export type PublicImportHospitalLocalSuggestion = {
  family: PublicImportHospitalLocalSuggestionFamily;
  name: string;
  nameAr: string | null;
  slug: string | null;
  area: string;
  governorate: string;
  sourceName: string | null;
  sourceUrl: string | null;
  lastCheckedAt: string | null;
  confidence: "high" | "medium";
};

export type PublicImportHospitalProfile = {
  family: "hospitals";
  canonicalPath: string;
  entityType: "hospital";
  name: string;
  nameAr: string | null;
  area: string | null;
  wilayat: string | null;
  governorate: string | null;
  services: string[];
  departments: string[];
  languages: string[];
  doctors: PublicImportHospitalRelatedDoctor[];
  localSuggestions: PublicImportHospitalLocalSuggestion[];
  phoneE164: string | null;
  whatsappE164: string | null;
  email: string | null;
  websiteUrl: string | null;
  googleMapsUrl: string | null;
  directionUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  lastCheckedAt: string | null;
  qualityScore: number;
};

export type GetPublicImportHospitalProfileResult =
  | { ok: true; profile: PublicImportHospitalProfile }
  | { ok: false; reason: "not_found" };

type QueryResult<T> = { data: T[] | null; error: unknown | null };
type SingleQueryResult<T> = { data: T | null; error: unknown | null };

type QueryBuilder<T> = PromiseLike<QueryResult<T>> & {
  select(columns: string): QueryBuilder<T>;
  eq(column: string, value: string | number | boolean): QueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean }): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  maybeSingle(): Promise<SingleQueryResult<T>>;
};

type ProfileClient = {
  from<T extends object = Record<string, unknown>>(table: string): QueryBuilder<T>;
};

type QueueRow = {
  target_entity_type: string;
  publish_status: string;
  index_policy: string;
  sitemap_policy: string;
  quality_score: number;
  metadata: unknown;
};

type CandidateRow = {
  entity_type: string;
  candidate_status: string;
  candidate_payload: unknown;
};

type JsonRecord = Record<string, unknown>;

const lookupLimit = 1000;
const relatedDoctorLimit = 24;
const localSuggestionLimit = 12;

const localSuggestionFamilyAliases: Record<string, PublicImportHospitalLocalSuggestionFamily> = {
  doctor: "doctor",
  doctors: "doctor",
  physician: "doctor",
  physicians: "doctor",
  pharmacy: "pharmacy",
  pharmacies: "pharmacy",
  hospital: "hospital",
  hospitals: "hospital",
  radiology: "radiology",
  radiologies: "radiology",
  imaging: "radiology",
  diagnostic_imaging: "radiology",
  dentistry: "dentistry",
  dental: "dentistry",
  dentist: "dentistry",
  dentists: "dentistry",
  beauty: "beauty",
  beauty_center: "beauty",
  beauty_centers: "beauty",
  beauty_salon: "beauty",
  beauty_salons: "beauty",
};

function client(): ProfileClient {
  return createSupabaseServiceRoleClient() as unknown as ProfileClient;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function record(value: unknown, key: string): JsonRecord {
  if (!isRecord(value)) return {};
  const next = value[key];
  return isRecord(next) ? next : {};
}

function recordArray(value: JsonRecord, key: string): JsonRecord[] {
  const next = value[key];
  if (!Array.isArray(next)) return [];
  return next.filter(isRecord);
}

function stringValue(value: JsonRecord, key: string): string | null {
  const next = value[key];
  if (typeof next !== "string") return null;
  const trimmed = next.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function stringValueAny(value: JsonRecord, ...keys: readonly string[]): string | null {
  for (const key of keys) {
    const next = stringValue(value, key);
    if (next !== null) return next;
  }
  return null;
}

function booleanValue(value: JsonRecord, key: string): boolean | null {
  const next = value[key];
  return typeof next === "boolean" ? next : null;
}

function booleanValueAny(value: JsonRecord, ...keys: readonly string[]): boolean | null {
  for (const key of keys) {
    const next = booleanValue(value, key);
    if (next !== null) return next;
  }
  return null;
}

function numberValue(value: JsonRecord, key: string): number | null {
  const next = value[key];
  return typeof next === "number" && Number.isFinite(next) ? next : null;
}

function stringArray(value: JsonRecord, key: string): string[] {
  const next = value[key];
  if (!Array.isArray(next)) return [];
  return next.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function safeSlug(value: string): string | null {
  const trimmed = value.trim().toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed) ? trimmed : null;
}

function canonicalPath(locale: string, country: string, slug: string): string | null {
  if (locale !== "en" && locale !== "ar") return null;
  if (country !== "om") return null;
  return `/${locale}/${country}/hospitals/${slug}`;
}

function currentHospitalSlug(path: string): string | null {
  return safeSlug(path.split("/").filter(Boolean).at(-1) ?? "");
}

function cleanLocation(value: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function locationKey(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function safeQueueRow(row: QueueRow, path: string): boolean {
  if (row.target_entity_type !== "hospital") return false;
  if (row.publish_status !== "index_eligible") return false;
  if (row.index_policy !== "index") return false;
  if (row.sitemap_policy !== "included") return false;
  if (!isRecord(row.metadata)) return false;
  if (row.metadata.sitemap_included !== true) return false;
  if (stringValue(row.metadata, "robots_policy") !== "index") return false;
  return stringValue(row.metadata, "canonical_path") === path;
}

function candidateId(metadata: unknown): string | null {
  return isRecord(metadata) ? stringValue(metadata, "import_entity_candidate_id") : null;
}

function hasSourceEvidence(sourceName: string | null, sourceUrl: string | null, lastCheckedAt: string | null): boolean {
  return (sourceName !== null || sourceUrl !== null) && lastCheckedAt !== null;
}

function hasContactOrMap(input: {
  phoneE164: string | null;
  whatsappE164: string | null;
  email: string | null;
  websiteUrl: string | null;
  googleMapsUrl: string | null;
  directionUrl: string | null;
}): boolean {
  return Object.values(input).some((value) => value !== null);
}

function hasLocalGeo(geo: JsonRecord): boolean {
  return (
    stringValue(geo, "area") !== null ||
    stringValue(geo, "wilayat") !== null ||
    stringValue(geo, "governorate") !== null ||
    numberValue(geo, "latitude") !== null ||
    numberValue(geo, "longitude") !== null
  );
}

function relatedDoctorRows(payload: JsonRecord): JsonRecord[] {
  const relations = record(payload, "relations");
  const fromRelations = recordArray(relations, "doctors");
  const fromRoot = recordArray(payload, "doctors");
  return [...fromRelations, ...fromRoot];
}

function localSuggestionRows(payload: JsonRecord): JsonRecord[] {
  const relations = record(payload, "relations");
  return [
    ...recordArray(relations, "localSuggestions"),
    ...recordArray(relations, "local_suggestions"),
    ...recordArray(relations, "nearby"),
    ...recordArray(payload, "localSuggestions"),
    ...recordArray(payload, "local_suggestions"),
    ...recordArray(payload, "nearby"),
  ];
}

function relatedDoctorSource(row: JsonRecord): JsonRecord {
  const source = record(row, "source");
  return Object.keys(source).length > 0 ? source : row;
}

function normalizeLocalSuggestionFamily(value: string | null): PublicImportHospitalLocalSuggestionFamily | null {
  if (value === null) return null;
  return localSuggestionFamilyAliases[value.trim().toLocaleLowerCase()] ?? null;
}

function localSuggestionFamily(row: JsonRecord): PublicImportHospitalLocalSuggestionFamily | null {
  return normalizeLocalSuggestionFamily(stringValueAny(row, "targetFamily", "target_family", "entityType", "entity_type", "family"));
}

function localSuggestionSlug(row: JsonRecord): string | null {
  const rawSlug = stringValueAny(row, "slug", "targetSlug", "target_slug", "candidateSlug", "candidate_slug");
  return rawSlug ? safeSlug(rawSlug) : null;
}

function approvedRelatedDoctor(row: JsonRecord): PublicImportHospitalRelatedDoctor | null {
  const source = relatedDoctorSource(row);
  const name = stringValue(row, "name") ?? stringValue(row, "fullName") ?? stringValue(row, "nameEn");
  const rawSlug = stringValue(row, "slug") ?? stringValue(row, "doctorSlug");
  const slug = rawSlug ? safeSlug(rawSlug) : null;
  const sourceName = stringValue(source, "sourceName");
  const sourceUrl = stringValue(source, "sourceUrl");
  const lastCheckedAt = stringValue(source, "lastCheckedAt");
  const branchVerified = booleanValue(row, "branchVerified") ?? booleanValue(row, "branch_verified");
  const publicVisible = booleanValue(row, "publicVisible") ?? booleanValue(row, "public_visible");
  const relationStatus = stringValue(row, "relationStatus") ?? stringValue(row, "relationshipStatus") ?? stringValue(row, "status");
  const confidence = stringValue(row, "confidence");

  if (name === null) return null;
  if (branchVerified !== true) return null;
  if (publicVisible !== true) return null;
  if (relationStatus !== null && relationStatus !== "active" && relationStatus !== "approved") return null;
  if (confidence !== null && confidence !== "high" && confidence !== "medium") return null;
  if (!hasSourceEvidence(sourceName, sourceUrl, lastCheckedAt)) return null;

  return {
    name,
    nameAr: stringValue(row, "nameAr"),
    slug,
    specialty: stringValue(row, "specialty") ?? stringValue(row, "primarySpecialty"),
    department: stringValue(row, "department"),
    sourceName,
    sourceUrl,
    lastCheckedAt,
    confidence,
  };
}

function approvedRelatedDoctors(payload: JsonRecord): PublicImportHospitalRelatedDoctor[] {
  const seen = new Set<string>();
  const doctors: PublicImportHospitalRelatedDoctor[] = [];

  for (const row of relatedDoctorRows(payload)) {
    const doctor = approvedRelatedDoctor(row);
    if (doctor === null) continue;
    const key = doctor.slug ?? doctor.name.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    doctors.push(doctor);
    if (doctors.length >= relatedDoctorLimit) break;
  }

  return doctors;
}

function approvedLocalSuggestion(
  row: JsonRecord,
  sourceGeo: JsonRecord,
  sourceHospitalSlug: string | null,
): PublicImportHospitalLocalSuggestion | null {
  const source = relatedDoctorSource(row);
  const family = localSuggestionFamily(row);
  const name = stringValueAny(row, "targetName", "target_name", "displayName", "display_name", "name", "nameEn");
  const slug = localSuggestionSlug(row);
  const sourceArea = cleanLocation(stringValue(sourceGeo, "area"));
  const sourceGovernorate = cleanLocation(stringValue(sourceGeo, "governorate"));
  const targetArea = cleanLocation(stringValueAny(row, "targetArea", "target_area", "area"));
  const targetGovernorate = cleanLocation(stringValueAny(row, "targetGovernorate", "target_governorate", "governorate"));
  const sourceName = stringValueAny(source, "sourceName", "source_name");
  const sourceUrl = stringValueAny(source, "sourceUrl", "source_url", "url");
  const lastCheckedAt = stringValueAny(source, "lastCheckedAt", "last_checked_at", "lastVerifiedDate", "last_verified_date");
  const publicVisible = booleanValueAny(row, "publicVisible", "public_visible");
  const relationStatus = stringValueAny(row, "relationStatus", "relationshipStatus", "status", "relation_status");
  const confidence = stringValue(row, "confidence");

  if (family === null) return null;
  if (name === null) return null;
  if (sourceArea === null || sourceGovernorate === null || targetArea === null || targetGovernorate === null) return null;
  if (locationKey(sourceArea) !== locationKey(targetArea)) return null;
  if (locationKey(sourceGovernorate) !== locationKey(targetGovernorate)) return null;
  if (publicVisible !== true) return null;
  if (relationStatus !== null && relationStatus !== "active" && relationStatus !== "approved") return null;
  if (confidence !== "high" && confidence !== "medium") return null;
  if (!hasSourceEvidence(sourceName, sourceUrl, lastCheckedAt)) return null;
  if (family === "hospital" && sourceHospitalSlug !== null && slug === sourceHospitalSlug) return null;

  return {
    family,
    name,
    nameAr: stringValueAny(row, "targetNameAr", "target_name_ar", "nameAr"),
    slug,
    area: targetArea,
    governorate: targetGovernorate,
    sourceName,
    sourceUrl,
    lastCheckedAt,
    confidence,
  };
}

function approvedLocalSuggestions(
  payload: JsonRecord,
  sourceGeo: JsonRecord,
  sourceHospitalSlug: string | null,
): PublicImportHospitalLocalSuggestion[] {
  const seen = new Set<string>();
  const suggestions: PublicImportHospitalLocalSuggestion[] = [];

  for (const row of localSuggestionRows(payload)) {
    const suggestion = approvedLocalSuggestion(row, sourceGeo, sourceHospitalSlug);
    if (suggestion === null) continue;
    const key = `${suggestion.family}:${suggestion.slug ?? suggestion.name.toLocaleLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push(suggestion);
    if (suggestions.length >= localSuggestionLimit) break;
  }

  return suggestions;
}

function buildProfile(path: string, queue: QueueRow, candidate: CandidateRow): PublicImportHospitalProfile | null {
  if (candidate.entity_type !== "hospital") return null;
  if (candidate.candidate_status !== "approved") return null;
  if (!isRecord(candidate.candidate_payload)) return null;

  const payload = candidate.candidate_payload;
  const identity = record(payload, "identity");
  const contact = record(payload, "contact");
  const geo = record(payload, "geo");
  const taxonomy = record(payload, "taxonomy");
  const source = record(payload, "source");
  const quality = record(payload, "quality");
  const name = stringValue(identity, "primaryName") ?? stringValue(identity, "nameEn");
  const phoneE164 = stringValue(contact, "phoneE164");
  const whatsappE164 = stringValue(contact, "whatsappE164");
  const email = stringValue(contact, "email");
  const websiteUrl = stringValue(contact, "websiteUrl");
  const googleMapsUrl = stringValue(contact, "googleMapsUrl");
  const directionUrl = stringValue(contact, "directionUrl");
  const sourceName = stringValue(source, "sourceName");
  const sourceUrl = stringValue(source, "sourceUrl");
  const lastCheckedAt = stringValue(source, "lastCheckedAt");

  if (name === null) return null;
  if (!hasLocalGeo(geo)) return null;
  if (!hasSourceEvidence(sourceName, sourceUrl, lastCheckedAt)) return null;
  if (!hasContactOrMap({ phoneE164, whatsappE164, email, websiteUrl, googleMapsUrl, directionUrl })) return null;

  return {
    family: "hospitals",
    canonicalPath: path,
    entityType: "hospital",
    name,
    nameAr: stringValue(identity, "nameAr"),
    area: stringValue(geo, "area"),
    wilayat: stringValue(geo, "wilayat"),
    governorate: stringValue(geo, "governorate"),
    services: stringArray(taxonomy, "services"),
    departments: stringArray(taxonomy, "departments"),
    languages: stringArray(payload, "languages"),
    doctors: approvedRelatedDoctors(payload),
    localSuggestions: approvedLocalSuggestions(payload, geo, currentHospitalSlug(path)),
    phoneE164,
    whatsappE164,
    email,
    websiteUrl,
    googleMapsUrl,
    directionUrl,
    sourceName,
    sourceUrl,
    lastCheckedAt,
    qualityScore: Math.max(0, Math.min(100, numberValue(quality, "score") ?? queue.quality_score)),
  };
}

export async function getPublicImportHospitalProfile(input: {
  locale: string;
  country: string;
  hospitalSlug: string;
}): Promise<GetPublicImportHospitalProfileResult> {
  try {
    const slug = safeSlug(input.hospitalSlug);
    if (slug === null) return { ok: false, reason: "not_found" };

    const path = canonicalPath(input.locale, input.country, slug);
    if (path === null) return { ok: false, reason: "not_found" };

    const supabase = client();
    const queueResult = await supabase
      .from<QueueRow>("import_publish_queue")
      .select("target_entity_type, publish_status, index_policy, sitemap_policy, quality_score, metadata")
      .eq("target_entity_type", "hospital")
      .eq("sitemap_policy", "included")
      .eq("index_policy", "index")
      .eq("publish_status", "index_eligible")
      .order("updated_at", { ascending: false })
      .limit(lookupLimit);

    if (queueResult.error !== null || queueResult.data === null) return { ok: false, reason: "not_found" };

    const queue = queueResult.data.find((row) => safeQueueRow(row, path));
    if (!queue) return { ok: false, reason: "not_found" };

    const id = candidateId(queue.metadata);
    if (id === null) return { ok: false, reason: "not_found" };

    const candidateResult = await supabase
      .from<CandidateRow>("import_entity_candidates")
      .select("entity_type, candidate_status, candidate_payload")
      .eq("id", id)
      .eq("candidate_status", "approved")
      .maybeSingle();

    if (candidateResult.error !== null || candidateResult.data === null) return { ok: false, reason: "not_found" };

    const profile = buildProfile(path, queue, candidateResult.data);
    return profile === null ? { ok: false, reason: "not_found" } : { ok: true, profile };
  } catch {
    return { ok: false, reason: "not_found" };
  }
}
