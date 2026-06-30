"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/lib/supabase/types";
import { writeAdminAuditEvent } from "@/server/admin/audit-log";
import { getAdminActiveCenterPublicStateReadiness } from "@/server/admin/active-center-public-state-readiness";
import { requireAdminPermission } from "@/server/admin/permissions";

type CenterRow = Database["public"]["Tables"]["centers"]["Row"];
type CenterUpdate = Database["public"]["Tables"]["centers"]["Update"];

type ActiveCenterPublicStateMutationRow = Pick<
  CenterRow,
  "id" | "slug" | "status" | "default_country" | "is_active" | "deleted_at"
>;

type UpdatedCenterRow = Pick<CenterRow, "id">;

export type ActiveCenterPublicStateActionState = {
  ok: boolean;
  message: string | null;
};

const failure: ActiveCenterPublicStateActionState = {
  ok: false,
  message: "Center public state could not be changed.",
};

function formString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function publicCenterPath(locale: "en" | "ar", country: string, slug: string): string {
  return `/${locale}/${country.toLowerCase()}/center/${slug}`;
}

export async function deactivateActiveCenterPublicProfile(
  _previousState: ActiveCenterPublicStateActionState,
  formData: FormData,
): Promise<ActiveCenterPublicStateActionState> {
  const admin = await requireAdminPermission("active_centers.public_state.update");
  const centerId = formString(formData, "centerId");
  const reason = formString(formData, "reason");

  if (centerId === null || !isUuid(centerId)) return failure;
  if (reason === null) {
    return {
      ok: false,
      message: "A public state change reason is required.",
    };
  }

  const readinessResult = await getAdminActiveCenterPublicStateReadiness(centerId);
  if (!readinessResult.ok) return failure;

  const { readiness } = readinessResult;
  if (!readiness.canDeactivate) {
    return {
      ok: false,
      message: `Center is not ready: ${readiness.blockers.join(" ")}`,
    };
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data: center, error: centerError } = await supabase
    .from("centers")
    .select("id,slug,status,default_country,is_active,deleted_at")
    .eq("id", centerId)
    .eq("status", "active")
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (centerError !== null || center === null) return failure;

  const current = center as ActiveCenterPublicStateMutationRow;
  const updatePayload: CenterUpdate = {
    is_active: false,
    status: "inactive",
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

  if (updateError !== null || (updated as UpdatedCenterRow | null) === null) return failure;

  const enPath = readiness.publicPaths.en ?? publicCenterPath("en", current.default_country, current.slug);
  const arPath = readiness.publicPaths.ar ?? publicCenterPath("ar", current.default_country, current.slug);

  await writeAdminAuditEvent({
    admin,
    permissionKey: "active_centers.public_state.update",
    action: "active_center.public_profile_deactivated",
    entityType: "center",
    entityId: centerId,
    targetTable: "centers",
    summary: "Active center public profile deactivated.",
    reason,
    oldValues: {
      deleted_at: current.deleted_at,
      is_active: current.is_active,
      status: current.status,
    },
    newValues: {
      deleted_at: current.deleted_at,
      is_active: false,
      status: "inactive",
    },
    metadata: {
      evidence_summary: readiness.evidenceSummary,
      public_paths: [enPath, arPath],
      sitemap_revalidated: true,
    },
  });

  revalidatePath(enPath);
  revalidatePath(arPath);
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/active-centers");
  revalidatePath(`/admin/active-centers/${centerId}`);

  return {
    ok: true,
    message: "Center public profile was deactivated.",
  };
}
