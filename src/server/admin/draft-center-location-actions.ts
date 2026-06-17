"use server";

import { revalidatePath } from "next/cache";

import { requirePlatformAdmin } from "@/lib/permissions/admin";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/lib/supabase/types";

type CenterStatus = Database["public"]["Enums"]["provider_status"];

type QueryError = { message?: string };
type QueryResponse<T> = { data: T | null; error: QueryError | null };

type QueryBuilder<T> = PromiseLike<QueryResponse<T>> & {
  eq(column: string, value: unknown): QueryBuilder<T>;
  insert(values: Record<string, unknown>): QueryBuilder<T>;
  is(column: string, value: boolean | null): QueryBuilder<T>;
  maybeSingle(): Promise<QueryResponse<T>>;
  select(columns: string): QueryBuilder<T>;
  update(values: Record<string, unknown>): QueryBuilder<T>;
};

type UntypedSupabaseClient = {
  from<T>(table: string): QueryBuilder<T>;
};

type CenterWorkflowRow = {
  id: string;
  status: CenterStatus;
};

type LocationIdRow = {
  id: string;
};

type GeoCountryRow = {
  id: string;
  phone_country_code: string | null;
};

type GeoRegionRow = {
  country_id: string;
  id: string;
};

type GeoCityRow = {
  country_id: string;
  id: string;
  region_id: string | null;
};

type GeoAreaRow = {
  city_id: string;
  country_id: string;
  id: string;
  region_id: string | null;
};

export type DraftCenterLocationState = {
  ok: boolean;
  message: string | null;
};

const allowedWorkflowStatuses = ["draft", "pending_review"] as const satisfies readonly CenterStatus[];

function locationClient(): UntypedSupabaseClient {
  return createSupabaseServiceRoleClient() as unknown as UntypedSupabaseClient;
}

function failure(message: string): DraftCenterLocationState {
  return { ok: false, message };
}

function readFormString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function isAllowedWorkflowStatus(status: CenterStatus): boolean {
  return allowedWorkflowStatuses.some((allowedStatus) => allowedStatus === status);
}

function normalizePhone(value: string | null): string | null {
  if (value === null) return null;
  const stripped = value.replace(/[\s().-]/g, "").trim();
  if (stripped.length === 0) return null;
  return stripped;
}

function normalizeWhatsApp(value: string | null, countryCode: string | null): string | null {
  const phone = normalizePhone(value);
  if (phone === null) return null;

  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length === 8 && countryCode !== null) return `${countryCode.replace(/[^0-9]/g, "")}${digits}`;
  if (digits.length >= 9) return digits;

  return null;
}

function parseCoordinate(value: string | null, min: number, max: number): number | null | "invalid" {
  if (value === null) return null;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < min || numberValue > max) return "invalid";
  return Number(numberValue.toFixed(6));
}

function googleMapUrlFromCoordinates(latitude: number | null, longitude: number | null): string | null {
  if (latitude === null || longitude === null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${latitude},${longitude}`)}`;
}

function isAllowedGoogleMapUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      (host.includes("google.") || host === "maps.app.goo.gl" || host === "goo.gl")
    );
  } catch {
    return false;
  }
}

function revalidateCenterLocation(centerId: string): void {
  revalidatePath("/admin/draft-centers");
  revalidatePath(`/admin/draft-centers/${centerId}`);
}

export async function saveDraftCenterPrimaryLocation(
  _previousState: DraftCenterLocationState,
  formData: FormData,
): Promise<DraftCenterLocationState> {
  await requirePlatformAdmin();

  const centerId = readFormString(formData, "centerId");
  const countryId = readFormString(formData, "countryId");
  const regionId = readFormString(formData, "regionId");
  const cityId = readFormString(formData, "cityId");
  const areaId = readFormString(formData, "areaId");

  if (centerId === null || !isUuid(centerId)) return failure("Center could not be identified.");
  if (countryId === null || !isUuid(countryId)) return failure("Select a valid country.");
  if (regionId === null || !isUuid(regionId)) return failure("Select a valid region.");
  if (cityId === null || !isUuid(cityId)) return failure("Select a valid city.");
  if (areaId !== null && !isUuid(areaId)) return failure("Select a valid area or leave it empty.");

  const nameEn = readFormString(formData, "nameEn");
  const nameAr = readFormString(formData, "nameAr");
  const addressLine1En = readFormString(formData, "addressLine1En");
  const addressLine1Ar = readFormString(formData, "addressLine1Ar");
  const addressLine2En = readFormString(formData, "addressLine2En");
  const addressLine2Ar = readFormString(formData, "addressLine2Ar");
  const landmarkEn = readFormString(formData, "landmarkEn");
  const landmarkAr = readFormString(formData, "landmarkAr");
  const postalCode = readFormString(formData, "postalCode");
  const primaryPhone = normalizePhone(readFormString(formData, "primaryPhone"));
  const secondaryPhone = normalizePhone(readFormString(formData, "secondaryPhone"));
  const email = readFormString(formData, "email");
  const mapUrlInput = readFormString(formData, "mapUrl");
  const latitudeValue = parseCoordinate(readFormString(formData, "latitude"), -90, 90);
  const longitudeValue = parseCoordinate(readFormString(formData, "longitude"), -180, 180);

  if (latitudeValue === "invalid") return failure("Latitude must be a valid number between -90 and 90.");
  if (longitudeValue === "invalid") return failure("Longitude must be a valid number between -180 and 180.");
  if ((latitudeValue === null) !== (longitudeValue === null)) {
    return failure("Latitude and longitude must be filled together, or both left empty.");
  }

  const hasTextLocation =
    nameEn !== null ||
    nameAr !== null ||
    addressLine1En !== null ||
    addressLine1Ar !== null ||
    landmarkEn !== null ||
    landmarkAr !== null;

  if (!hasTextLocation && latitudeValue === null && mapUrlInput === null) {
    return failure("Add a location name, address, Google Maps URL, or coordinates.");
  }

  const supabase = locationClient();

  const { data: center, error: centerError } = await supabase
    .from<CenterWorkflowRow>("centers")
    .select("id, status")
    .eq("id", centerId)
    .is("deleted_at", null)
    .maybeSingle();

  if (centerError !== null || center === null) return failure("Center could not be loaded.");
  if (!isAllowedWorkflowStatus(center.status)) {
    return failure("Only draft or pending-review centers can receive a draft location candidate.");
  }

  const { data: country, error: countryError } = await supabase
    .from<GeoCountryRow>("geo_countries")
    .select("id, phone_country_code")
    .eq("id", countryId)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (countryError !== null || country === null) return failure("Country is not available.");

  const { data: region, error: regionError } = await supabase
    .from<GeoRegionRow>("geo_regions")
    .select("id, country_id")
    .eq("id", regionId)
    .eq("country_id", countryId)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (regionError !== null || region === null) return failure("Region is not available for this country.");

  const { data: city, error: cityError } = await supabase
    .from<GeoCityRow>("geo_cities")
    .select("id, country_id, region_id")
    .eq("id", cityId)
    .eq("country_id", countryId)
    .eq("region_id", regionId)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (cityError !== null || city === null) return failure("City is not available for this region.");

  if (areaId !== null) {
    const { data: area, error: areaError } = await supabase
      .from<GeoAreaRow>("geo_areas")
      .select("id, country_id, region_id, city_id")
      .eq("id", areaId)
      .eq("country_id", countryId)
      .eq("region_id", regionId)
      .eq("city_id", cityId)
      .eq("is_active", true)
      .is("deleted_at", null)
      .maybeSingle();

    if (areaError !== null || area === null) return failure("Area is not available for this city.");
  }

  const whatsappPhone = normalizeWhatsApp(readFormString(formData, "whatsappPhone"), country.phone_country_code ?? "968");
  if (whatsappPhone === null) return failure("Add a valid WhatsApp number for this center location.");

  const generatedMapUrl = googleMapUrlFromCoordinates(latitudeValue, longitudeValue);
  const mapUrl = mapUrlInput ?? generatedMapUrl;

  if (mapUrl === null) {
    return failure("Add a Google Maps URL or latitude/longitude so patients can get directions.");
  }

  if (!isAllowedGoogleMapUrl(mapUrl)) {
    return failure("Google Maps URL must be an HTTPS Google Maps link, or use latitude/longitude instead.");
  }

  const now = new Date().toISOString();
  const slug = "primary-location";

  const { error: clearPrimaryError } = await supabase
    .from<unknown>("center_locations")
    .update({ is_primary: false, updated_at: now })
    .eq("center_id", centerId)
    .is("deleted_at", null);

  if (clearPrimaryError !== null) return failure("Existing primary location could not be updated.");

  const { data: existingBySlug, error: existingBySlugError } = await supabase
    .from<LocationIdRow>("center_locations")
    .select("id")
    .eq("center_id", centerId)
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (existingBySlugError !== null) return failure("Existing location candidate could not be checked.");

  const payload = {
    address_line1_ar: addressLine1Ar,
    address_line1_en: addressLine1En,
    address_line2_ar: addressLine2Ar,
    address_line2_en: addressLine2En,
    area_id: areaId,
    center_id: centerId,
    city_id: cityId,
    country_id: countryId,
    email,
    is_active: true,
    is_primary: true,
    landmark_ar: landmarkAr,
    landmark_en: landmarkEn,
    latitude: latitudeValue,
    longitude: longitudeValue,
    map_url: mapUrl,
    metadata: {
      assigned_from: "CENTER-LOCATION-A",
      google_directions_ready: true,
      whatsapp_ready: true,
    },
    name_ar: nameAr,
    name_en: nameEn,
    postal_code: postalCode,
    primary_phone: primaryPhone,
    region_id: regionId,
    secondary_phone: secondaryPhone,
    slug,
    sort_order: 0,
    updated_at: now,
    whatsapp_phone: whatsappPhone,
  } satisfies Record<string, unknown>;

  if (existingBySlug !== null) {
    const { data: updatedLocation, error: updateError } = await supabase
      .from<LocationIdRow>("center_locations")
      .update(payload)
      .eq("id", existingBySlug.id)
      .select("id")
      .maybeSingle();

    if (updateError !== null || updatedLocation === null) return failure("Location candidate could not be saved.");
  } else {
    const { data: insertedLocation, error: insertError } = await supabase
      .from<LocationIdRow>("center_locations")
      .insert({ ...payload, created_at: now })
      .select("id")
      .maybeSingle();

    if (insertError !== null || insertedLocation === null) return failure("Location candidate could not be created.");
  }

  revalidateCenterLocation(centerId);

  return {
    ok: true,
    message: "Location, WhatsApp, and Google directions saved. The center is still not public or active.",
  };
}
