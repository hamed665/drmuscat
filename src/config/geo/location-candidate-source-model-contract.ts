import type { OmanLocationCandidateDimension } from '@/config/geo/location-threshold-policy';
import type { OmanGeoRouteEntity } from '@/config/geo/route-contract';

export type OmanLocationCandidateSourceModelStatus = 'contract-only' | 'ready-for-audit' | 'active';

export type OmanLocationCandidateSourceModelScope = 'provider-count' | 'verified-provider-count' | 'evidence-count';

export type OmanLocationCandidateSourceModelRule = {
  scope: OmanLocationCandidateSourceModelScope;
  sourceRefsRequired: true;
  reviewerRequired: true;
  lastReviewedAtRequired: true;
  runtimeCollectionAllowed: false;
  databaseAccessAllowed: false;
  importAllowed: false;
};

export type OmanLocationCandidateSourceModelPolicy = {
  entity: OmanGeoRouteEntity;
  dimension: OmanLocationCandidateDimension;
  rules: readonly OmanLocationCandidateSourceModelRule[];
  routeCreationAllowed: false;
  sitemapAllowed: false;
  jsonLdAllowed: false;
  indexPromotionAllowed: false;
};

export const OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_CONTRACT_VERSION = 'v1' as const;

export const OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_RULES: readonly OmanLocationCandidateSourceModelRule[] = [
  {
    scope: 'provider-count',
    sourceRefsRequired: true,
    reviewerRequired: true,
    lastReviewedAtRequired: true,
    runtimeCollectionAllowed: false,
    databaseAccessAllowed: false,
    importAllowed: false,
  },
  {
    scope: 'verified-provider-count',
    sourceRefsRequired: true,
    reviewerRequired: true,
    lastReviewedAtRequired: true,
    runtimeCollectionAllowed: false,
    databaseAccessAllowed: false,
    importAllowed: false,
  },
  {
    scope: 'evidence-count',
    sourceRefsRequired: true,
    reviewerRequired: true,
    lastReviewedAtRequired: true,
    runtimeCollectionAllowed: false,
    databaseAccessAllowed: false,
    importAllowed: false,
  },
] as const;

export const OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_POLICIES: readonly OmanLocationCandidateSourceModelPolicy[] = [
  { entity: 'governorate', dimension: 'category', rules: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_RULES, routeCreationAllowed: false, sitemapAllowed: false, jsonLdAllowed: false, indexPromotionAllowed: false },
  { entity: 'governorate', dimension: 'service', rules: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_RULES, routeCreationAllowed: false, sitemapAllowed: false, jsonLdAllowed: false, indexPromotionAllowed: false },
  { entity: 'governorate', dimension: 'specialty', rules: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_RULES, routeCreationAllowed: false, sitemapAllowed: false, jsonLdAllowed: false, indexPromotionAllowed: false },
  { entity: 'wilayat', dimension: 'category', rules: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_RULES, routeCreationAllowed: false, sitemapAllowed: false, jsonLdAllowed: false, indexPromotionAllowed: false },
  { entity: 'wilayat', dimension: 'service', rules: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_RULES, routeCreationAllowed: false, sitemapAllowed: false, jsonLdAllowed: false, indexPromotionAllowed: false },
  { entity: 'wilayat', dimension: 'specialty', rules: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_RULES, routeCreationAllowed: false, sitemapAllowed: false, jsonLdAllowed: false, indexPromotionAllowed: false },
  { entity: 'area', dimension: 'category', rules: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_RULES, routeCreationAllowed: false, sitemapAllowed: false, jsonLdAllowed: false, indexPromotionAllowed: false },
  { entity: 'area', dimension: 'service', rules: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_RULES, routeCreationAllowed: false, sitemapAllowed: false, jsonLdAllowed: false, indexPromotionAllowed: false },
  { entity: 'area', dimension: 'specialty', rules: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_RULES, routeCreationAllowed: false, sitemapAllowed: false, jsonLdAllowed: false, indexPromotionAllowed: false },
] as const;

export const OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_CONTRACT = {
  version: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_CONTRACT_VERSION,
  status: 'contract-only' as OmanLocationCandidateSourceModelStatus,
  policies: OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_POLICIES,
  runtimeCollectionAllowed: false,
  databaseAccessAllowed: false,
  importAllowed: false,
  routeCreationAllowed: false,
  sitemapAllowed: false,
  jsonLdAllowed: false,
  indexPromotionAllowed: false,
  nonGoals: [
    'No provider data is collected by this contract.',
    'No evidence data is collected by this contract.',
    'No import pipeline is enabled by this contract.',
    'No database access is enabled by this contract.',
    'No route or index behavior changes by this contract.',
  ],
} as const;
