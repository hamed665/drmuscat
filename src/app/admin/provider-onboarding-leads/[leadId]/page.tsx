import { notFound } from "next/navigation";

import {
  ProviderOnboardingLeadDetail,
  ProviderOnboardingLeadUnavailable,
} from "@/components/admin/provider-onboarding-lead-detail";
import { getAdminProviderOnboardingLeadById } from "@/server/admin/provider-onboarding-leads";

type AdminProviderOnboardingLeadDetailPageProps = {
  params: Promise<{
    leadId: string;
  }>;
};

export default async function AdminProviderOnboardingLeadDetailPage({
  params,
}: AdminProviderOnboardingLeadDetailPageProps) {
  const { leadId } = await params;
  const result = await getAdminProviderOnboardingLeadById(leadId);

  if (!result.ok) {
    if (result.reason === "not_found") {
      notFound();
    }

    return <ProviderOnboardingLeadUnavailable />;
  }

  return <ProviderOnboardingLeadDetail lead={result.lead} />;
}
