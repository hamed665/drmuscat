"use server";

import { revalidatePath } from "next/cache";

import { requireAdminPermission } from "@/server/admin/permissions";
import { writeAdminAuditEvent } from "@/server/admin/audit-log";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/lib/supabase/types";

type CenterInsert = Database["public"]["Tables"]["centers"]["Insert"];
type CenterType = Database["public"]["Enums"]["center_type"];
type AppLocale = Database["public"]["Enums"]["app_locale"];
type CountryCode = Database["public"]["Enums"]["country_code"];
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonValue[];
type JsonObject = { [key: string]: JsonValue | undefined };

export type ManualDraftCenterCreateState = {
  ok: boolean;
  message: string | null;
  centerId?: string;
  slug?: string;
};

const allowedCenterTypes = [
  "clinic",
  "hospital",
  "dental_clinic",
  "beauty_clinic",
  "laboratory",
  "imaging_center",
  "pharmacy",
  "wellness_center",
  "physiotherapy_center",
  "other",
] as const satisfies readonly CenterType[];

const allowedLocales = ["en", "ar"] as const satisfies readonly AppLocale[];
const allowedCountries = ["om"] as const satisfies readonly CountryCode[];
const phoneSafePattern = /^[\d\s+\-()]+$/;
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const htmlLikeTagPattern = /<[^>]+>/;

function failure(message: string): ManualDraftCenterCreateState {
  return { ok: false, message };
}

function readFormString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;

  const trimmed = value.normalize("NFKC").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readOptionalText(
  formData: FormData,
  key: string,
  maxLength: number,
): string | null | undefined {
  const value = readFormString(formData, key);
  if (value === null) return null;
  if (value.length > maxLength || htmlLikeTagPattern.test(value)) return undefined;

  return value;
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function isCenterType(value: string): value is CenterType {
  return allowedCenterTypes.some((centerType) => centerType === value);
}

function isLocale(value: string): value is AppLocale {
  return allowedLocales.some((locale) => locale === value);
}

function isCountryCode(value: string): value is CountryCode {
  return allowedCountries.some((country) => country === value);
}

function isValidPhone(value: string): boolean {
  return value.length >= 6 && value.length <= 64 && phoneSafePattern.test(value);
}

function isValidEmail(value: string): boolean {
  return value.length <= 240 && emailPattern.test(value.toLowerCase());
}

function isValidWebsiteUrl(value: string): boolean {
  return value.length <= 500 && /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value);
}

function manualCenterPayload(input: {
  areaText: string | null;
  centerType: CenterType;
  cityText: string | null;
  createdByProfileId: string;
  defaultCountry: CountryCode;
  defaultLocale: AppLocale;
  email: string | null;
  nameAr: string | null;
  nameEn: string;
  primaryPhone: string | null;
  shortDescriptionAr: string | null;
  shortDescriptionEn: string | null;
  slug: string;
  websiteUrl: string | null;
  whatsappPhone: string | null;
}): CenterInsert {
  const metadata: JsonObject = {
    created_from: "manual_admin",
    manual_center_create_version: "v1",
    created_by_profile_id: input.createdByProfileId,
    draft_location_hint: {
      area_text: input.areaText,
      city_text: input.cityText,
    },
  };

  return {
    center_type: input.centerType,
    default_country: input.defaultCountry,
    default_locale: input.defaultLocale,
    email: input.email,
    is_active: false,
    is_claimable: false,
    is_featured: false,
    metadata,
    name_ar: input.nameAr,
    name_en: input.nameEn,
    primary_phone: input.primaryPhone,
    public_email_visible: false,
    public_primary_phone_visible: false,
    public_secondary_phone_visible: false,
    public_whatsapp_phone_visible: false,
    short_description_ar: input.shortDescriptionAr,
    short_description_en: input.shortDescriptionEn,
    slug: input.slug,
    status: "draft",
    verification_status: "unverified",
    website_url: input.websiteUrl,
    whatsapp_phone: input.whatsappPhone,
  };
}

export async function createManualDraftCenter(
  _previousState: ManualDraftCenterCreateState,
  formData: FormData,
): Promise<ManualDraftCenterCreateState> {
  const admin = await requireAdminPermission("draft_centers.create");

  const nameEn = readOptionalText(formData, "nameEn", 160);
  const nameAr = readOptionalText(formData, "nameAr", 160);
  const rawSlug = readOptionalText(formData, "slug", 72);
  const centerType = readFormString(formData, "centerType");
  const defaultLocale = readFormString(formData, "defaultLocale");
  const defaultCountry = readFormString(formData, "defaultCountry");
  const areaText = readOptionalText(formData, "areaText", 120);
  const cityText = readOptionalText(formData, "cityText", 120);
  const primaryPhone = readOptionalText(formData, "primaryPhone", 64);
  const whatsappPhone = readOptionalText(formData, "whatsappPhone", 64);
  const email = readOptionalText(formData, "email", 240);
  const websiteUrl = readOptionalText(formData, "websiteUrl", 500);
  const shortDescriptionEn = readOptionalText(formData, "shortDescriptionEn", 240);
  const shortDescriptionAr = readOptionalText(formData, "shortDescriptionAr", 240);

  if (nameEn === null || nameEn === undefined || nameEn.length < 2) {
    return failure("English center name is required and must be under 160 characters.");
  }

  if (
    nameAr === undefined ||
    rawSlug === undefined ||
    areaText === undefined ||
    cityText === undefined ||
    primaryPhone === undefined ||
    whatsappPhone === undefined ||
    email === undefined ||
    websiteUrl === undefined ||
    shortDescriptionEn === undefined ||
    shortDescriptionAr === undefined
  ) {
    return failure("One or more fields are too long or contain unsupported markup.");
  }

  if (centerType === null || !isCenterType(centerType)) {
    return failure("Center type is not valid.");
  }

  if (defaultLocale === null || !isLocale(defaultLocale)) {
    return failure("Default locale is not valid.");
  }

  if (defaultCountry === null || !isCountryCode(defaultCountry)) {
    return failure("Default country is not valid.");
  }

  if (primaryPhone === null && whatsappPhone === null) {
    return failure("Add at least one phone or WhatsApp number before creating the draft center.");
  }

  if (primaryPhone !== null && !isValidPhone(primaryPhone)) {
    return failure("Primary phone is not valid.");
  }

  if (whatsappPhone !== null && !isValidPhone(whatsappPhone)) {
    return failure("WhatsApp phone is not valid.");
  }

  const normalizedEmail = email === null ? null : email.toLowerCase();
  if (normalizedEmail !== null && !isValidEmail(normalizedEmail)) {
    return failure("Email format is not valid.");
  }

  if (websiteUrl !== null && !isValidWebsiteUrl(websiteUrl)) {
    return failure("Website URL must start with http:// or https://.");
  }

  const slug = normalizeSlug(rawSlug ?? nameEn);
  if (slug.length === 0) {
    return failure("Slug must contain at least one letter or number.");
  }

  const supabase = createSupabaseServiceRoleClient();

  const { data: existingCenter, error: existingCenterError } = await supabase
    .from("centers")
    .select("id")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (existingCenterError !== null) {
    return failure("Slug availability could not be checked.");
  }

  if (existingCenter !== null) {
    return failure("Slug is already used by another center.");
  }

  const payload = manualCenterPayload({
    areaText,
    centerType,
    cityText,
    createdByProfileId: admin.profile.id,
    defaultCountry,
    defaultLocale,
    email: normalizedEmail,
    nameAr,
    nameEn,
    primaryPhone,
    shortDescriptionAr,
    shortDescriptionEn,
    slug,
    websiteUrl,
    whatsappPhone,
  });

  const { data: insertedCenter, error: insertError } = await supabase
    .from("centers")
    .insert(payload)
    .select("id, slug")
    .maybeSingle();

  if (insertError !== null || insertedCenter === null) {
    return failure("Draft center could not be created.");
  }

  revalidatePath("/admin/draft-centers");
  revalidatePath(`/admin/draft-centers/${insertedCenter.id}`);

  await writeAdminAuditEvent({
    admin,
    permissionKey: "draft_centers.create",
    action: "draft_center.manual_created",
    entityType: "draft_center",
    entityId: insertedCenter.id,
    targetTable: "centers",
    summary: "Manual draft center created from admin form.",
    newValues: {
      center_type: centerType,
      default_country: defaultCountry,
      default_locale: defaultLocale,
      slug,
      status: "draft",
      verification_status: "unverified",
      is_active: false,
      is_claimable: false,
    },
  });

  return {
    ok: true,
    message: "Manual draft center was created. It is not public, active, claimable, verified, sponsored, billed, or indexed.",
    centerId: insertedCenter.id,
    slug: insertedCenter.slug,
  };
}
