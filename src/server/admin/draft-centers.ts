import "server-only";

import { requirePlatformAdmin } from "@/lib/permissions/admin";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/lib/supabase/types";

type CenterRow = Database["public"]["Tables"]["centers"]["Row"];

const fixedLimit = 100;
const selectColumns =
  "id, slug, name_en, name_ar, center_type, status, verification_status, primary_phone, whatsapp_phone, email, default_locale, default_country, is_active, is_claimable, metadata, created_at, updated_at";

type CenterListRow = Pick<
  CenterRow,
  | "id"
  | "slug"
  | "name_en"
  | "name_ar"
  | "center_type"
  | "status"
  | "verification_status"
  | "primary_phone"
  | "whatsapp_phone"
  | "email"
  | "default_locale"
  | "default_country"
  | "is_active"
  | "is_claimable"
  | "metadata"
  | "created_at"
  | "updated_at"
>;

export type AdminDraftCenterListItem = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  centerType: CenterRow["center_type"];
  status: CenterRow["status"];
  verificationStatus: CenterRow["verification_status"];
  primaryPhone: string | null;
  whatsappPhone: string | null;
  email: string | null;
  defaultLocale: CenterRow["default_locale"];
  defaultCountry: CenterRow["default_country"];
  isActive: boolean;
  isClaimable: boolean;
  createdFrom: string | null;
  sourceLeadId: string | null;
  sourceProviderType: string | null;
  sourceRequest: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminDraftCentersListResult =
  | { ok: true; items: AdminDraftCenterListItem[]; limit: number }
  | { ok: false; reason: "unavailable"; items: []; limit: number };

function metadataRecord(value: CenterRow["metadata"]): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function metadataText(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function mapCenter(row: CenterListRow): AdminDraftCenterListItem {
  const metadata = metadataRecord(row.metadata);

  return {
    id: row.id,
    slug: row.slug,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    centerType: row.center_type,
    status: row.status,
    verificationStatus: row.verification_status,
    primaryPhone: row.primary_phone,
    whatsappPhone: row.whatsapp_phone,
    email: row.email,
    defaultLocale: row.default_locale,
    defaultCountry: row.default_country,
    isActive: row.is_active,
    isClaimable: row.is_claimable,
    createdFrom: metadataText(metadata, "created_from"),
    sourceLeadId: metadataText(metadata, "source_provider_onboarding_lead_id"),
    sourceProviderType: metadataText(metadata, "source_provider_type"),
    sourceRequest: metadataText(metadata, "source_request"),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAdminDraftCenters(): Promise<AdminDraftCentersListResult> {
  await requirePlatformAdmin();

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("centers")
    .select(selectColumns)
    .eq("status", "draft")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(fixedLimit);

  if (error !== null || data === null) {
    return { ok: false, reason: "unavailable", items: [], limit: fixedLimit };
  }

  return { ok: true, items: data.map(mapCenter), limit: fixedLimit };
}
