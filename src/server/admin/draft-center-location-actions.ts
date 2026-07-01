"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/lib/supabase/types";
import type {
  DraftCenterLocationCreateState,
  DraftCenterLocationEditState,
  DraftCenterLocationPrimaryState,
  DraftCenterLocationReviewState,
} from "@/server/admin/draft-center-location-action-types";
import { writeAdminAuditEvent } from "@/server/admin/audit-log";
import { requireAdminPermission } from "@/server/admin/permissions";

type CenterLocationInsert = Database["public"]["Tables"]["center_locations"]["Insert"];
type CenterLocationRow = Database["public"]["Tables"]["center_locations"]["Row"];
type CenterLocationUpdate = Database["public"]["Tables"]["center_locations"]["Update"];
type DraftCenterStatus = Database["public"]["Enums"]["provider_status"];

type ReviewLocationRow = Pick<
  CenterLocationRow,
  | "address_line1_ar"
  | "address_line1_en"
  | "city_id"
  | "country_id"
  | "id"
  | "map_url"
  | "name_ar"
  | "name_en"
  | "region_id"
>;

const draftStatuses = ["draft", "pending_review"] as const satisfies readonly DraftCenterStatus[];

const failure: DraftCenterLocationCreateState = {
  ok: false,
  message: "Location candidate could not be created.",
};

const editFailure: DraftCenterLocationEditState = {
  ok: false,
  message: "Location candidate could not be updated.",
};

const primaryFailure: DraftCenterLocationPrimaryState = {
  ok: false,
  message: "Primary location candidate could not be updated.",
};

const reviewFailure: DraftCenterLocationReviewState = {
  ok: false,
  message: "Location candidate could not be marked ready for review.",
};

function formString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function hasText(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function limitedString(value: string | null, maxLength: number): string | null {
  if (value === null) return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  return trimmed.slice(0, maxLength);
}

function safeSlugPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "location";
}

function isNextControlFlowError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return false;
  }

  const digest = (error as { digest?: unknown }).digest;
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND"))
  );
}

function safeActionFailure<T>(error: unknown, state: T): T {
  if (isNextControlFlowError(error)) {
    throw error;
  }

  return state;
}

function hasEditableLocationText(formData: FormData): boolean {
  return (
    formString(formData, "nameEn") !== null ||
    formString(formData, "nameAr") !== null ||
    formString(formData, "addressLine1En") !== null ||
    formString(formData, "addressLine1Ar") !== null ||
    formString(formData, "mapUrl") !== null
  );
}

function hasReviewLocationIdentity(location: ReviewLocationRow): boolean {
  return (
    hasText(location.name_en) ||
    hasText(location.name_ar) ||
    hasText(location.address_line1_en) ||
    hasText(location.address_line1_ar) ||
    hasText(location.map_url)
  );
}

function hasReviewLocationGeography(location: ReviewLocationRow): boolean {
  return hasText(location.country_id) && hasText(location.region_id) && hasText(location.city_id);
}

function locationPayload(input: {
  centerId: string;
  centerSlug: string;
  countryId: string;
  regionId: string;
  cityId: string;
  areaId: string | null;
  formData: FormData;
}): CenterLocationInsert {
  const nameEn = limitedString(formString(input.formData, "nameEn"), 160);
  const nameAr = limitedString(formString(input.formData, "nameAr"), 160);
  const addressLine1En = limitedString(formString(input.formData, "addressLine1En"), 240);
  const addressLine1Ar = limitedString(formString(input.formData, "addressLine1Ar"), 240);
  const mapUrl = limitedString(formString(input.formData, "mapUrl"), 500);
  const primaryPhone = limitedString(formString(input.formData, "primaryPhone"), 64);
  const whatsappPhone = limitedString(formString(input.formData, "whatsappPhone"), 64);
  const slug = `draft-${safeSlugPart(input.centerSlug)}-${randomUUID().slice(0, 8)}`;

  return {
    address_line1_ar: addressLine1Ar,
    address_line1_en: addressLine1En,
    area_id: input.areaId,
    center_id: input.centerId,
    city_id: input.cityId,
    contact_review_status: "pending",
    contact_reviewed_at: null,
    country_id: input.countryId,
    is_active: false,
    is_primary: false,
    map_url: mapUrl,
    metadata: {
      created_from: "admin_draft_location_create",
      workflow_state: "candidate",
    },
    name_ar: nameAr,
    name_en: nameEn,
    primary_phone: primaryPhone,
    public_email_visible: false,
    public_primary_phone_visible: false,
    public_secondary_phone_visible: false,
    public_whatsapp_phone_visible: false,
    region_id: input.regionId,
    slug,
    whatsapp_phone: whatsappPhone,
  };
}

function locationUpdatePayload(formData: FormData): CenterLocationUpdate {
  return {
    address_line1_ar: limitedString(formString(formData, "addressLine1Ar"), 240),
    address_line1_en: limitedString(formString(formData, "addressLine1En"), 240),
    contact_review_status: "pending",
    contact_reviewed_at: null,
    is_active: false,
    map_url: limitedString(formString(formData, "mapUrl"), 500),
    name_ar: limitedString(formString(formData, "nameAr"), 160),
    name_en: limitedString(formString(formData, "nameEn"), 160),
    primary_phone: limitedString(formString(formData, "primaryPhone"), 64),
    public_email_visible: false,
    public_primary_phone_visible: false,
    public_secondary_phone_visible: false,
    public_whatsapp_phone_visible: false,
    updated_at: new Date().toISOString(),
    whatsapp_phone: limitedString(formString(formData, "whatsappPhone"), 64),
  };
}

async function createDraftCenterLocationCandidateImpl(
  _previousState: DraftCenterLocationCreateState,
  formData: FormData,
): Promise<DraftCenterLocationCreateState> {
  const adminContext = await requireAdminPermission("draft_centers.update");
  const centerId = formString(formData, "centerId");
  const countryId = formString(formData, "countryId");
  const regionId = formString(formData, "regionId");
  const cityId = formString(formData, "cityId");
  const areaId = formString(formData, "areaId");

  if (centerId === null || !isUuid(centerId)) return failure;
  if (countryId === null || !isUuid(countryId)) return failure;
  if (regionId === null || !isUuid(regionId)) return failure;
  if (cityId === null || !isUuid(cityId)) return failure;
  if (areaId !== null && !isUuid(areaId)) return failure;

  if (!hasEditableLocationText(formData)) {
    return {
      ok: false,
      message: "Add a name, address, or map URL before saving this location candidate.",
    };
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data: center, error: centerError } = await supabase
    .from("centers")
    .select("id, slug, status")
    .eq("id", centerId)
    .in("status", [...draftStatuses])
    .is("deleted_at", null)
    .maybeSingle();

  if (centerError !== null || center === null) return failure;

  const payload = locationPayload({
    centerId,
    centerSlug: center.slug,
    countryId,
    regionId,
    cityId,
    areaId,
    formData,
  });

  const { data: insertedLocation, error: insertError } = await supabase
    .from("center_locations")
    .insert(payload)
    .select("id")
    .maybeSingle();

  if (insertError !== null || insertedLocation === null) return failure;

  await writeAdminAuditEvent({
    admin: adminContext,
    permissionKey: "draft_centers.update",
    action: "draft_center.details_updated",
    entityType: "center",
    entityId: centerId,
    targetTable: "center_locations",
    summary: "Draft center location candidate created.",
    newValues: {
      location_id: insertedLocation.id,
      is_active: false,
      public_primary_phone_visible: false,
      public_whatsapp_phone_visible: false,
    },
  });

  revalidatePath(`/admin/draft-centers/${centerId}`);

  return {
    ok: true,
    message: "Location candidate was created privately.",
  };
}

export async function createDraftCenterLocationCandidate(
  previousState: DraftCenterLocationCreateState,
  formData: FormData,
): Promise<DraftCenterLocationCreateState> {
  try {
    return await createDraftCenterLocationCandidateImpl(previousState, formData);
  } catch (error) {
    return safeActionFailure(error, failure);
  }
}

async function updateDraftCenterLocationCandidateImpl(
  _previousState: DraftCenterLocationEditState,
  formData: FormData,
): Promise<DraftCenterLocationEditState> {
  const adminContext = await requireAdminPermission("draft_centers.update");
  const centerId = formString(formData, "centerId");
  const locationId = formString(formData, "locationId");

  if (centerId === null || !isUuid(centerId)) return editFailure;
  if (locationId === null || !isUuid(locationId)) return editFailure;

  if (!hasEditableLocationText(formData)) {
    return {
      ok: false,
      message: "Keep at least one location name, address, or map URL before saving.",
    };
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data: center, error: centerError } = await supabase
    .from("centers")
    .select("id,status")
    .eq("id", centerId)
    .in("status", [...draftStatuses])
    .is("deleted_at", null)
    .maybeSingle();

  if (centerError !== null || center === null) return editFailure;

  const { data: location, error: locationError } = await supabase
    .from("center_locations")
    .select("id")
    .eq("id", locationId)
    .eq("center_id", centerId)
    .eq("is_active", false)
    .is("deleted_at", null)
    .maybeSingle();

  if (locationError !== null || location === null) return editFailure;

  const { error: updateError } = await supabase
    .from("center_locations")
    .update(locationUpdatePayload(formData))
    .eq("id", locationId)
    .eq("center_id", centerId)
    .eq("is_active", false)
    .is("deleted_at", null);

  if (updateError !== null) return editFailure;

  await writeAdminAuditEvent({
    admin: adminContext,
    permissionKey: "draft_centers.update",
    action: "draft_center.details_updated",
    entityType: "center",
    entityId: centerId,
    targetTable: "center_locations",
    summary: "Draft center location candidate updated.",
    newValues: {
      location_id: locationId,
      is_active: false,
      public_primary_phone_visible: false,
      public_whatsapp_phone_visible: false,
    },
  });

  revalidatePath(`/admin/draft-centers/${centerId}`);

  return {
    ok: true,
    message: "Location candidate was updated privately.",
  };
}

export async function updateDraftCenterLocationCandidate(
  previousState: DraftCenterLocationEditState,
  formData: FormData,
): Promise<DraftCenterLocationEditState> {
  try {
    return await updateDraftCenterLocationCandidateImpl(previousState, formData);
  } catch (error) {
    return safeActionFailure(error, editFailure);
  }
}

async function setPrimaryDraftCenterLocationCandidateImpl(
  _previousState: DraftCenterLocationPrimaryState,
  formData: FormData,
): Promise<DraftCenterLocationPrimaryState> {
  const adminContext = await requireAdminPermission("draft_centers.update");
  const centerId = formString(formData, "centerId");
  const locationId = formString(formData, "locationId");

  if (centerId === null || !isUuid(centerId)) return primaryFailure;
  if (locationId === null || !isUuid(locationId)) return primaryFailure;

  const supabase = createSupabaseServiceRoleClient();
  const { data: center, error: centerError } = await supabase
    .from("centers")
    .select("id,status")
    .eq("id", centerId)
    .in("status", [...draftStatuses])
    .is("deleted_at", null)
    .maybeSingle();

  if (centerError !== null || center === null) return primaryFailure;

  const { data: location, error: locationError } = await supabase
    .from("center_locations")
    .select("id")
    .eq("id", locationId)
    .eq("center_id", centerId)
    .eq("is_active", false)
    .is("deleted_at", null)
    .maybeSingle();

  if (locationError !== null || location === null) return primaryFailure;

  const { error: resetError } = await supabase
    .from("center_locations")
    .update({ is_primary: false, updated_at: new Date().toISOString() })
    .eq("center_id", centerId)
    .eq("is_active", false)
    .is("deleted_at", null);

  if (resetError !== null) return primaryFailure;

  const { error: primaryError } = await supabase
    .from("center_locations")
    .update({ is_primary: true, updated_at: new Date().toISOString() })
    .eq("id", locationId)
    .eq("center_id", centerId)
    .eq("is_active", false)
    .is("deleted_at", null);

  if (primaryError !== null) return primaryFailure;

  await writeAdminAuditEvent({
    admin: adminContext,
    permissionKey: "draft_centers.update",
    action: "draft_center.details_updated",
    entityType: "center",
    entityId: centerId,
    targetTable: "center_locations",
    summary: "Draft center primary location candidate updated.",
    newValues: {
      location_id: locationId,
      is_active: false,
      is_primary: true,
      public_primary_phone_visible: false,
      public_whatsapp_phone_visible: false,
    },
  });

  revalidatePath(`/admin/draft-centers/${centerId}`);

  return {
    ok: true,
    message: "Primary location candidate was updated privately.",
  };
}

export async function setPrimaryDraftCenterLocationCandidate(
  previousState: DraftCenterLocationPrimaryState,
  formData: FormData,
): Promise<DraftCenterLocationPrimaryState> {
  try {
    return await setPrimaryDraftCenterLocationCandidateImpl(previousState, formData);
  } catch (error) {
    return safeActionFailure(error, primaryFailure);
  }
}

async function markDraftCenterLocationReadyForReviewImpl(
  _previousState: DraftCenterLocationReviewState,
  formData: FormData,
): Promise<DraftCenterLocationReviewState> {
  const adminContext = await requireAdminPermission("draft_centers.update");
  const centerId = formString(formData, "centerId");
  const locationId = formString(formData, "locationId");

  if (centerId === null || !isUuid(centerId)) return reviewFailure;
  if (locationId === null || !isUuid(locationId)) return reviewFailure;

  const supabase = createSupabaseServiceRoleClient();
  const { data: center, error: centerError } = await supabase
    .from("centers")
    .select("id,status")
    .eq("id", centerId)
    .in("status", [...draftStatuses])
    .is("deleted_at", null)
    .maybeSingle();

  if (centerError !== null || center === null) return reviewFailure;

  const { data: location, error: locationError } = await supabase
    .from("center_locations")
    .select("id,name_en,name_ar,address_line1_en,address_line1_ar,map_url,country_id,region_id,city_id")
    .eq("id", locationId)
    .eq("center_id", centerId)
    .eq("is_active", false)
    .is("deleted_at", null)
    .maybeSingle();

  if (locationError !== null || location === null) return reviewFailure;

  const reviewLocation = location as ReviewLocationRow;

  if (!hasReviewLocationGeography(reviewLocation)) {
    return {
      ok: false,
      message: "Country, governorate/region, and city/wilayat are required before review.",
    };
  }

  if (!hasReviewLocationIdentity(reviewLocation)) {
    return {
      ok: false,
      message: "Add a location name, address, or map URL before review.",
    };
  }

  const { error: updateError } = await supabase
    .from("center_locations")
    .update({
      contact_review_status: "pending",
      contact_reviewed_at: null,
      is_active: true,
      public_email_visible: false,
      public_primary_phone_visible: false,
      public_secondary_phone_visible: false,
      public_whatsapp_phone_visible: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", locationId)
    .eq("center_id", centerId)
    .eq("is_active", false)
    .is("deleted_at", null);

  if (updateError !== null) return reviewFailure;

  await writeAdminAuditEvent({
    admin: adminContext,
    permissionKey: "draft_centers.update",
    action: "draft_center.details_updated",
    entityType: "center",
    entityId: centerId,
    targetTable: "center_locations",
    summary: "Draft center location candidate marked ready for quality review.",
    newValues: {
      location_id: locationId,
      is_active: true,
      public_email_visible: false,
      public_primary_phone_visible: false,
      public_secondary_phone_visible: false,
      public_whatsapp_phone_visible: false,
    },
  });

  revalidatePath(`/admin/draft-centers/${centerId}`);

  return {
    ok: true,
    message: "Location candidate is ready for quality gate review.",
  };
}

export async function markDraftCenterLocationReadyForReview(
  previousState: DraftCenterLocationReviewState,
  formData: FormData,
): Promise<DraftCenterLocationReviewState> {
  try {
    return await markDraftCenterLocationReadyForReviewImpl(previousState, formData);
  } catch (error) {
    return safeActionFailure(error, reviewFailure);
  }
}
