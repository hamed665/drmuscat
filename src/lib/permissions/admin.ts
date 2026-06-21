import "server-only";

import { redirect } from "next/navigation";

import { createSessionAwareSupabaseServerClient } from "@/lib/auth/server";

export type PlatformAdminProfile = {
  id: string;
  email: string;
  display_name: string | null;
  full_name: string | null;
  is_platform_admin: true;
};

function getAdminEmailAllowlist(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0),
  );
}

export function isEmailAllowedForAdmin(email: string | null | undefined): boolean {
  if (!email) return false;

  const allowlist = getAdminEmailAllowlist();
  if (allowlist.size === 0) return false;

  return allowlist.has(email.trim().toLowerCase());
}

export async function getCurrentAllowedAdmin(): Promise<PlatformAdminProfile | null> {
  const supabase = await createSessionAwareSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isEmailAllowedForAdmin(user.email)) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    display_name: user.user_metadata?.display_name ?? null,
    full_name: user.user_metadata?.full_name ?? null,
    is_platform_admin: true,
  };
}

export async function requirePlatformAdmin(): Promise<PlatformAdminProfile> {
  const admin = await getCurrentAllowedAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
