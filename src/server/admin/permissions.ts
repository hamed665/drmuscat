import "server-only";

import { redirect } from "next/navigation";

import { adminRoles, type AdminPermissionKey, type AdminRoleKey } from "@/lib/admin/permissions";
import { requirePlatformAdmin, type PlatformAdminProfile } from "@/lib/permissions/admin";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

type JsonObject = { [key: string]: unknown };

type AdminRoleMetadataRow = {
  metadata: unknown;
};

export type CurrentAdminContext = {
  profile: PlatformAdminProfile;
  role: AdminRoleKey;
  permissions: readonly AdminPermissionKey[];
};

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAdminRoleKey(value: unknown): value is AdminRoleKey {
  return typeof value === "string" && value in adminRoles;
}

function roleFromMetadata(metadata: unknown): AdminRoleKey | null {
  if (!isJsonObject(metadata)) return null;
  return isAdminRoleKey(metadata.admin_role) ? metadata.admin_role : null;
}

async function resolveAdminRole(profile: PlatformAdminProfile): Promise<AdminRoleKey> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("metadata")
    .eq("id", profile.id)
    .eq("is_platform_admin", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error !== null || data === null) return "super_admin";

  return roleFromMetadata((data as AdminRoleMetadataRow).metadata) ?? "super_admin";
}

export async function getCurrentAdminContext(): Promise<CurrentAdminContext> {
  const profile = await requirePlatformAdmin();
  const role = await resolveAdminRole(profile);
  return { profile, role, permissions: adminRoles[role].permissions };
}

export async function getCurrentAdminPermissions(): Promise<readonly AdminPermissionKey[]> {
  const context = await getCurrentAdminContext();
  return context.permissions;
}

export async function requireAdminPermission(permissionKey: AdminPermissionKey): Promise<CurrentAdminContext> {
  const context = await getCurrentAdminContext();
  if (!context.permissions.includes(permissionKey)) {
    redirect("/admin");
  }
  return context;
}
