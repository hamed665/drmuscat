import type { OmanGeoRouteEntity } from '@/config/geo/route-contract';

export type OmanGeoIndexPromotionStatus = 'blocked-until-content-ready' | 'eligible-for-review' | 'indexable';

export type OmanGeoIndexPromotionRequirement = {
  key: string;
  description: string;
  required: boolean;
};

export type OmanGeoIndexPromotionEntityPolicy = {
  entity: OmanGeoRouteEntity;
  status: OmanGeoIndexPromotionStatus;
  noindexRequired: boolean;
  sitemapAllowed: boolean;
  jsonLdAllowed: boolean;
  minimumPublishedProviders: number;
  minimumEditorialWords: number;
  requirements: readonly OmanGeoIndexPromotionRequirement[];
};

export const OMAN_GEO_INDEX_PROMOTION_POLICY_VERSION = 'v1' as const;

const sharedRequirements = [
  {
    key: 'published-provider-inventory',
    description: 'The page must have enough published provider or listing inventory to be useful on its own.',
    required: true,
  },
  {
    key: 'localized-editorial-copy',
    description: 'The page must include useful English and Arabic editorial copy, not placeholder text.',
    required: true,
  },
  {
    key: 'canonical-and-hreflang-qa',
    description: 'Canonical and hreflang behavior must be reviewed for English and Arabic peers.',
    required: true,
  },
  {
    key: 'thin-page-review',
    description: 'The page must pass a thin-page review before noindex can be removed.',
    required: true,
  },
  {
    key: 'sitemap-policy-review',
    description: 'The page family must have an approved sitemap policy before sitemap inclusion.',
    required: true,
  },
] as const;

export const OMAN_GEO_INDEX_PROMOTION_POLICIES: readonly OmanGeoIndexPromotionEntityPolicy[] = [
  {
    entity: 'governorate',
    status: 'blocked-until-content-ready',
    noindexRequired: true,
    sitemapAllowed: false,
    jsonLdAllowed: false,
    minimumPublishedProviders: 12,
    minimumEditorialWords: 120,
    requirements: sharedRequirements,
  },
  {
    entity: 'wilayat',
    status: 'blocked-until-content-ready',
    noindexRequired: true,
    sitemapAllowed: false,
    jsonLdAllowed: false,
    minimumPublishedProviders: 6,
    minimumEditorialWords: 90,
    requirements: sharedRequirements,
  },
  {
    entity: 'area',
    status: 'blocked-until-content-ready',
    noindexRequired: true,
    sitemapAllowed: false,
    jsonLdAllowed: false,
    minimumPublishedProviders: 3,
    minimumEditorialWords: 70,
    requirements: sharedRequirements,
  },
] as const;

export const OMAN_GEO_INDEX_PROMOTION_POLICY = {
  version: OMAN_GEO_INDEX_PROMOTION_POLICY_VERSION,
  defaultStatus: 'blocked-until-content-ready' as OmanGeoIndexPromotionStatus,
  noindexRequiredByDefault: true,
  sitemapAllowedByDefault: false,
  jsonLdAllowedByDefault: false,
  policies: OMAN_GEO_INDEX_PROMOTION_POLICIES,
  promotionRequiresApprovedPr: true,
  notes: [
    'No geo route is indexable in the current scaffold phase.',
    'No geo route is sitemap-eligible in the current scaffold phase.',
    'Index promotion must happen in a separate approved PR after content and listing readiness is proven.',
  ],
} as const;
