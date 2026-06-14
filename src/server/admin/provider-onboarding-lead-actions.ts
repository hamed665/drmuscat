"use server";

import { revalidatePath } from "next/cache";

import { requirePlatformAdmin } from "@/lib/permissions/admin";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/lib/supabase/types";

const allowedStatuses = [
  "new",
  "reviewing",
  "contacted",
  "qualified",
  "rejected",
  "converted",
  "closed",
] as const;

const allowedPriorities = ["low", "normal", "high"] as const;
const handledStatuses = [
  "contacted",
  "qualified",
  "rejected",
  "converted",
  "closed",
] as const;

export type ProviderOnboardingLeadMutationState = {
  ok: boolean;
  message: string | null;
};

type ProviderOnboardingLeadStatus = (typeof allowedStatuses)[number];
type ProviderOnboardingLeadPriority = (typeof allowedPriorities)[number];
type ProviderOnboardingLeadUpdate =
  Database["public"]["Tables"]["provider_onboarding_leads"]["Update"];

const genericFailureState: ProviderOnboardingLeadMutationState = {
  ok: false,
  message: "Lead could not be updated.",
};

function readRequiredFormString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function isAllowedStatus(value: string): value is ProviderOnboardingLeadStatus {
  return allowedStatuses.some((status) => status === value);
}

function isAllowedPriority(value: string): value is ProviderOnboardingLeadPriority {
  return allowedPriorities.some((priority) => priority === value);
}

function shouldSetHandledAt(
  handledAt: string | null,
  status: ProviderOnboardingLeadStatus,
): boolean {
  return (
    handledAt === null &&
    handledStatuses.some((handledStatus) => handledStatus === status)
  );
}

export async function updateProviderOnboardingLeadStatusPriority(
  _previousState: ProviderOnboardingLeadMutationState,
  formData: FormData,
): Promise<ProviderOnboardingLeadMutationState> {
  await requirePlatformAdmin();

  const leadId = readRequiredFormString(formData, "leadId");
  const status = readRequiredFormString(formData, "status");
  const priority = readRequiredFormString(formData, "priority");

  if (leadId === null || status === null || priority === null) {
    return genericFailureState;
  }

  if (!isAllowedStatus(status) || !isAllowedPriority(priority)) {
    return genericFailureState;
  }

  const supabase = createSupabaseServiceRoleClient();

  const { data: existingLead, error: readError } = await supabase
    .from("provider_onboarding_leads")
    .select("id, handled_at")
    .eq("id", leadId)
    .is("deleted_at", null)
    .maybeSingle();

  if (readError !== null || existingLead === null) {
    return genericFailureState;
  }

  const updatedAt = new Date().toISOString();
  const updatePayload: ProviderOnboardingLeadUpdate = {
    status,
    priority,
    updated_at: updatedAt,
  };

  if (shouldSetHandledAt(existingLead.handled_at, status)) {
    updatePayload.handled_at = updatedAt;
  }

  const { data: updatedLead, error: updateError } = await supabase
    .from("provider_onboarding_leads")
    .update(updatePayload)
    .eq("id", leadId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (updateError !== null || updatedLead === null) {
    return genericFailureState;
  }

  revalidatePath("/admin/provider-onboarding-leads");
  revalidatePath(`/admin/provider-onboarding-leads/${leadId}`);

  return {
    ok: true,
    message: "Lead status and priority were updated.",
  };
}
