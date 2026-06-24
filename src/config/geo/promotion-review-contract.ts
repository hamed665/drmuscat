import type { OmanGeoRouteEntity } from '@/config/geo/route-contract';

export type OmanGeoPromotionReviewStatus = 'blocked-readiness-missing' | 'ready-for-review' | 'approved' | 'rejected';
export type OmanGeoPromotionReviewDecision = 'none' | 'approved' | 'rejected';

export type OmanGeoPromotionReviewEvidenceKey =
  | 'provider-inventory-ready'
  | 'editorial-content-ready'
  | 'qa-evidence-ready'
  | 'index-eligibility-ready'
  | 'promotion-reviewer-approved';

export type OmanGeoPromotionReviewEvidenceRequirement = {
  key: OmanGeoPromotionReviewEvidenceKey;
  description: string;
  required: boolean;
  complete: boolean;
};

export type OmanGeoPromotionReviewEntityContract = {
  entity: OmanGeoRouteEntity;
  status: OmanGeoPromotionReviewStatus;
  decision: OmanGeoPromotionReviewDecision;
  reviewRequested: boolean;
  reviewedByHuman: boolean;
  reviewerRole: 'seo-lead' | 'medical-editor' | 'technical-reviewer' | null;
  reviewedAt: string | null;
  requiresProviderInventoryReady: boolean;
  requiresEditorialContentReady: boolean;
  requiresQaEvidenceReady: boolean;
  requiresIndexEligibilityReady: boolean;
  requiresPromotionReviewerApproval: boolean;
  readyForPromotionReview: boolean;
  noindexRemovalAllowed: boolean;
  sitemapPromotionAllowed: boolean;
  jsonLdAllowed: boolean;
  indexPromotionAllowed: boolean;
  requirements: readonly OmanGeoPromotionReviewEvidenceRequirement[];
};

export const OMAN_GEO_PROMOTION_REVIEW_CONTRACT_VERSION = 'v1' as const;

const sharedPromotionReviewRequirements = [
  {
    key: 'provider-inventory-ready',
    description: 'Provider inventory must meet the published provider threshold for the entity.',
    required: true,
    complete: false,
  },
  {
    key: 'editorial-content-ready',
    description: 'Localized human-reviewed editorial content must exist for the geo page.',
    required: true,
    complete: false,
  },
  {
    key: 'qa-evidence-ready',
    description: 'Canonical, hreflang, thin-page and sitemap policy QA evidence must be complete.',
    required: true,
    complete: false,
  },
  {
    key: 'index-eligibility-ready',
    description: 'The central index promotion eligibility gate must be ready.',
    required: true,
    complete: false,
  },
  {
    key: 'promotion-reviewer-approved',
    description: 'A separate human promotion reviewer must approve the final promotion decision.',
    required: true,
    complete: false,
  },
] as const satisfies readonly OmanGeoPromotionReviewEvidenceRequirement[];

export const OMAN_GEO_PROMOTION_REVIEW_ENTITY_CONTRACTS: readonly OmanGeoPromotionReviewEntityContract[] = [
  {
    entity: 'governorate',
    status: 'blocked-readiness-missing',
    decision: 'none',
    reviewRequested: false,
    reviewedByHuman: false,
    reviewerRole: null,
    reviewedAt: null,
    requiresProviderInventoryReady: true,
    requiresEditorialContentReady: true,
    requiresQaEvidenceReady: true,
    requiresIndexEligibilityReady: true,
    requiresPromotionReviewerApproval: true,
    readyForPromotionReview: false,
    noindexRemovalAllowed: false,
    sitemapPromotionAllowed: false,
    jsonLdAllowed: false,
    indexPromotionAllowed: false,
    requirements: sharedPromotionReviewRequirements,
  },
  {
    entity: 'wilayat',
    status: 'blocked-readiness-missing',
    decision: 'none',
    reviewRequested: false,
    reviewedByHuman: false,
    reviewerRole: null,
    reviewedAt: null,
    requiresProviderInventoryReady: true,
    requiresEditorialContentReady: true,
    requiresQaEvidenceReady: true,
    requiresIndexEligibilityReady: true,
    requiresPromotionReviewerApproval: true,
    readyForPromotionReview: false,
    noindexRemovalAllowed: false,
    sitemapPromotionAllowed: false,
    jsonLdAllowed: false,
    indexPromotionAllowed: false,
    requirements: sharedPromotionReviewRequirements,
  },
  {
    entity: 'area',
    status: 'blocked-readiness-missing',
    decision: 'none',
    reviewRequested: false,
    reviewedByHuman: false,
    reviewerRole: null,
    reviewedAt: null,
    requiresProviderInventoryReady: true,
    requiresEditorialContentReady: true,
    requiresQaEvidenceReady: true,
    requiresIndexEligibilityReady: true,
    requiresPromotionReviewerApproval: true,
    readyForPromotionReview: false,
    noindexRemovalAllowed: false,
    sitemapPromotionAllowed: false,
    jsonLdAllowed: false,
    indexPromotionAllowed: false,
    requirements: sharedPromotionReviewRequirements,
  },
] as const;

export const OMAN_GEO_PROMOTION_REVIEW_CONTRACT = {
  version: OMAN_GEO_PROMOTION_REVIEW_CONTRACT_VERSION,
  status: 'blocked-readiness-missing' as OmanGeoPromotionReviewStatus,
  contracts: OMAN_GEO_PROMOTION_REVIEW_ENTITY_CONTRACTS,
  promotionReviewEnabled: false,
  promotionReviewRequestAllowed: false,
  noindexRemovalAllowed: false,
  sitemapPromotionAllowed: false,
  jsonLdAllowed: false,
  indexPromotionAllowed: false,
  nonGoals: [
    'No noindex guardrail is removed by this promotion review contract.',
    'No sitemap inclusion is allowed by this promotion review contract.',
    'No JSON-LD is generated by this promotion review contract.',
    'No geo route becomes indexable by this promotion review contract.',
    'No runtime provider or editorial query is added by this promotion review contract.',
  ],
} as const;
