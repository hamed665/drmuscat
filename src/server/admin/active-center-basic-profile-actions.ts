"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/lib/supabase/types";
import { writeAdminAuditEvent } from "@/server/admin/audit-log";
import { requireAdminPermission } from "@/server/admin/permissions";

type CenterRow = Database["public"]["Tables"]["centers"]["Row"];
type CenterUpdate = Database["public"]["Tables"]["centers"]["Update"];

type ActiveCenterProfileEditRow = Pick<
  CenterRow,
  | "id"
  | "slug"
  | "default_country"
  | "status"
  | "is_active"
  | "deleted_at"
  | "name_en"
  | "name_ar"
  | "short_description_en"
  | "short_description_ar"
  | "description_en"
  | "description_ar"
>;

type UpdatedRow = { id: string };

function formText(formData: FormData, key: string, maxLength: number): string | null | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const text = value.normalize("NFKC").trim();
  if (text.length === 0) return null;
  if (text.length > maxLength) return undefined;
  return text;
}

function formRequiredText(formData: FormData, key: string, maxLength: number): string | null | undefined {
  const value = formText(formData, key, maxLength);
  if (value === null) return null;
  return value;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function pathFor(locale: "en" | "ar", country: string, slug: string): string {
  return `/${locale}/${country.toLowerCase()}/center/${slug}`;
}

export async function updateActiveCenterBasicProfileDetails(formData: FormData): Promise<void> {
  const admin = await requireAdminPermission("active_centers.public_state.update");
  const centerId = formRequiredText(formData, "centerId", 64);
  if (centerId === null || centerId === undefined || !isUuid(centerId)) return;

  const nameEn = formRequiredText(formData, "nameEn", 160);
  const nameAr = formText(formData, "nameAr", 160);
  const shortDescriptionEn = formText(formData, "shortDescriptionEn", 240);
  const shortDescriptionAr = formText(formData, "shortDescriptionAr", 240);
  const descriptionEn = formText(formData, "descriptionEn", 4000);
  const descriptionAr = formText(formData, "descriptionAr", 4000);

  if (nameEn === null || nameEn === undefined) return;
  if (
    nameAr === undefined ||
    shortDescriptionEn === undefined ||
    shortDescriptionAr === undefined ||
    descriptionEn === undefined ||
    descriptionAr === undefined
  ) {
    return;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data: center, error } = await supabase
    .from("centers")
    .select(
      "id,slug,default_country,status,is_active,deleted_at,name_en,name_ar,short_description_en,short_description_ar,description_en,description_ar",
    )
    .eq("id", centerId)
    .eq("status", "active")
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error !== null || center === null) return;

  const current = center as ActiveCenterProfileEditRow;
  const updatePayload: CenterUpdate = {
    name_en: nameEn,
    name_ar: nameAr,
    short_description_en: shortDescriptionEn,
    short_description_ar: shortDescriptionAr,
    description_en: descriptionEn,
    description_ar: descriptionAr,
    updated_at: new Date().toISOString(),
  };

  const { data: updated, error: updateError } = await supabase
    .from("centers")
    .update(updatePayload)
    .eq("id", centerId)
    .eq("status", "active")
    .eq("is_active", true)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (updateError !== null || (updated as UpdatedRow | null) === null) return;

  const enPath = pathFor("en", current.default_country, current.slug);
  const arPath = pathFor("ar", current.default_country, current.slug);

  await writeAdminAuditEvent({
    admin,
    permissionKey: "active_centers.public_state.update",
    action: "active_center.basic_profile_updated",
    entityType: "center",
    entityId: centerId,
    targetTable: "centers",
    summary: "Active center basic profile details updated.",
    oldValues: {
      has_name_ar: current.name_ar !== null,
      has_short_description_en: current.short_description_en !== null,
      has_short_description_ar: current.short_description_ar !== null,
      has_description_en: current.description_en !== null,
      has_description_ar: current.description_ar !== null,
    },
    newValues: {
      has_name_ar: nameAr !== null,
      has_short_description_en: shortDescriptionEn !== null,
      has_short_description_ar: shortDescriptionAr !== null,
      has_description_en: descriptionEn !== null,
      has_description_ar: descriptionAr !== null,
    },
    metadata: {
      public_paths: [enPath, arPath],
      fields: Object.keys(updatePayload),
    },
  });

  revalidatePath(enPath);
  revalidatePath(arPath);
  revalidatePath("/admin/active-centers");
  revalidatePath(`/admin/active-centers/${centerId}/edit-profile`);
}
