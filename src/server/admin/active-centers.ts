import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/lib/supabase/types";
import { requireAdminPermission } from "@/server/admin/permissions";

type CenterRow = Database["public"]["Tables"]["centers"]["Row"];

type ActiveCenterRow = Pick<
  CenterRow,
  | "id"
  | "slug"
  | "name_en"
  | "name_ar"
  | "center_type"
  | "status"
  | "verification_status"
  | "default_country"
  | "is_active"
  | "is_claimable"
  | "updated_at"
>;

export type AdminActiveCenterListItem = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  centerType: CenterRow["center_type"];
  status: CenterRow["status"];
  verificationStatus: CenterRow["verification_status"];
  defaultCountry: CenterRow["default_country"];
  isActive: boolean;
  isClaimable: boolean;
  publicPathAr: string;
  publicPathEn: string;
  updatedAt: string;
};

export type AdminActiveCentersResult =
  | { ok: true; items: AdminActiveCenterListItem[]; limit: number }
  | { ok: false; reason: "unavailable"; items: []; limit: number };

const fixedLimit = 100;

function publicCenterPath(locale: "en" | "ar", country: string, slug: string): string {
  return `/${locale}/${country}/center/${slug}`;
}

function mapActiveCenter(row: ActiveCenterRow): AdminActiveCenterListItem {
  const country = row.default_country.toLowerCase();

  return {
    id: row.id,
    slug: row.slug,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    centerType: row.center_type,
    status: row.status,
    verificationStatus: row.verification_status,
    defaultCountry: row.default_country,
    isActive: row.is_active,
    isClaimable: row.is_claimable,
    publicPathAr: publicCenterPath("ar", country, row.slug),
    publicPathEn: publicCenterPath("en", country, row.slug),
    updatedAt: row.updated_at,
  };
}

export async function listAdminActiveCenters(): Promise<AdminActiveCentersResult> {
  await requireAdminPermission("draft_centers.read");

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("centers")
    .select("id, slug, name_en, name_ar, center_type, status, verification_status, default_country, is_active, is_claimable, updated_at")
    .eq("status", "active")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(fixedLimit);

  if (error !== null || data === null) {
    return { ok: false, reason: "unavailable", items: [], limit: fixedLimit };
  }

  return { ok: true, items: data.map(mapActiveCenter), limit: fixedLimit };
}
