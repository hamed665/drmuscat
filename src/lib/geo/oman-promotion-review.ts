import {
  OMAN_GEO_PROMOTION_REVIEW_CONTRACT,
  OMAN_GEO_PROMOTION_REVIEW_ENTITY_CONTRACTS,
  type OmanGeoPromotionReviewEntityContract,
  type OmanGeoPromotionReviewStatus,
} from '@/config/geo/promotion-review-contract';
import type { OmanGeoRouteEntity } from '@/config/geo/route-contract';

export type OmanGeoPromotionReviewLookupInput = {
  entity: OmanGeoRouteEntity;
};

export type OmanGeoPromotionReviewRuntimeState = {
  status: OmanGeoPromotionReviewStatus;
  promotionReviewEnabled: boolean;
  promotionReviewRequestAllowed: boolean;
  reviewedEntityCount: number;
  approvedEntityCount: number;
  rejectedEntityCount: number;
  readyForPromotionReviewCount: number;
  noindexRemovalAllowed: boolean;
  sitemapPromotionAllowed: boolean;
  jsonLdAllowed: boolean;
  indexPromotionAllowed: boolean;
};

export function listOmanGeoPromotionReviewContracts(): readonly OmanGeoPromotionReviewEntityContract[] {
  return OMAN_GEO_PROMOTION_REVIEW_ENTITY_CONTRACTS;
}

export function getOmanGeoPromotionReviewContract(
  input: OmanGeoPromotionReviewLookupInput,
): OmanGeoPromotionReviewEntityContract | null {
  return listOmanGeoPromotionReviewContracts().find((contract) => contract.entity === input.entity) ?? null;
}

export function getOmanGeoPromotionReviewRuntimeState(): OmanGeoPromotionReviewRuntimeState {
  const contracts = listOmanGeoPromotionReviewContracts();

  return {
    status: OMAN_GEO_PROMOTION_REVIEW_CONTRACT.status,
    promotionReviewEnabled: OMAN_GEO_PROMOTION_REVIEW_CONTRACT.promotionReviewEnabled,
    promotionReviewRequestAllowed: OMAN_GEO_PROMOTION_REVIEW_CONTRACT.promotionReviewRequestAllowed,
    reviewedEntityCount: contracts.filter((contract) => contract.reviewedByHuman).length,
    approvedEntityCount: contracts.filter((contract) => contract.decision === 'approved').length,
    rejectedEntityCount: contracts.filter((contract) => contract.decision === 'rejected').length,
    readyForPromotionReviewCount: contracts.filter((contract) => contract.readyForPromotionReview).length,
    noindexRemovalAllowed: false,
    sitemapPromotionAllowed: false,
    jsonLdAllowed: false,
    indexPromotionAllowed: false,
  };
}
