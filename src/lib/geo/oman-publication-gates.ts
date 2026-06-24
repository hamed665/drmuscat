import {
  OMAN_GEO_PUBLICATION_GATES_CONTRACT,
  OMAN_GEO_PUBLICATION_GATE_ENTITY_CONTRACTS,
  type OmanGeoPublicationGateEntityContract,
  type OmanGeoPublicationGateStatus,
} from '@/config/geo/publication-gates-contract';
import type { OmanGeoRouteEntity } from '@/config/geo/route-contract';
import {
  getOmanGeoEvidenceRegistryEntityContract,
  getOmanGeoEvidenceRegistryRuntimeState,
} from '@/lib/geo/oman-evidence-registry';
import { getOmanGeoPromotionReviewContract } from '@/lib/geo/oman-promotion-review';
import { getOmanGeoReadiness, type OmanGeoReadinessInput, type OmanGeoReadinessRuntimeState } from '@/lib/geo/oman-readiness';

export type OmanGeoPublicationGatesInput = OmanGeoReadinessInput & {
  readiness?: OmanGeoReadinessRuntimeState;
};

export type OmanGeoPublicationGatesRuntimeState = {
  entity: OmanGeoRouteEntity;
  slug: string;
  locale: 'en' | 'ar';
  status: OmanGeoPublicationGateStatus;
  contract: OmanGeoPublicationGateEntityContract | null;
  readinessComplete: boolean;
  reviewApproved: boolean;
  evidenceApproved: boolean;
  technicalGateEnabled: boolean;
  noindexRemovalAllowed: boolean;
  sitemapPromotionAllowed: boolean;
  jsonLdAllowed: boolean;
  indexPromotionAllowed: boolean;
  blockedReasons: readonly string[];
};

export function listOmanGeoPublicationGateContracts(): readonly OmanGeoPublicationGateEntityContract[] {
  return OMAN_GEO_PUBLICATION_GATE_ENTITY_CONTRACTS;
}

export function getOmanGeoPublicationGateContract(entity: OmanGeoRouteEntity): OmanGeoPublicationGateEntityContract | null {
  return listOmanGeoPublicationGateContracts().find((contract) => contract.entity === entity) ?? null;
}

export function getOmanGeoPublicationGates(input: OmanGeoPublicationGatesInput): OmanGeoPublicationGatesRuntimeState {
  const readiness = input.readiness ?? getOmanGeoReadiness(input);
  const contract = getOmanGeoPublicationGateContract(input.entity);
  const reviewContract = getOmanGeoPromotionReviewContract({ entity: input.entity });
  const evidenceContract = getOmanGeoEvidenceRegistryEntityContract(input.entity);
  const evidenceRegistryState = getOmanGeoEvidenceRegistryRuntimeState();
  const readinessComplete = Boolean(readiness.readyForPromotionReview);
  const reviewApproved = Boolean(reviewContract?.decision === 'approved' && reviewContract.reviewedByHuman);
  const evidenceApproved = Boolean(
    evidenceContract?.approvedEvidenceEntries === evidenceContract?.minimumApprovedEvidenceEntries &&
      evidenceRegistryState.approvedEntries > 0,
  );
  const technicalGateEnabled = false;
  const gateBlockers = new Set([
    ...(contract ? [] : ['missing-publication-gate-contract']),
    ...(readinessComplete ? [] : ['readiness-incomplete']),
    ...(reviewApproved ? [] : ['promotion-review-not-approved']),
    ...(evidenceApproved ? [] : ['evidence-registry-not-approved']),
    ...(technicalGateEnabled ? [] : ['technical-publication-gate-disabled']),
    ...readiness.blockedReasons,
  ]);
  const blockedReasons = [...gateBlockers];

  return {
    entity: input.entity,
    slug: input.slug,
    locale: input.locale,
    status: OMAN_GEO_PUBLICATION_GATES_CONTRACT.status,
    contract,
    readinessComplete,
    reviewApproved,
    evidenceApproved,
    technicalGateEnabled,
    noindexRemovalAllowed: false,
    sitemapPromotionAllowed: false,
    jsonLdAllowed: false,
    indexPromotionAllowed: false,
    blockedReasons,
  };
}
