import {
  OMAN_LOCATION_CANDIDATE_VERIFIED_COUNT_METHOD,
  OMAN_LOCATION_CANDIDATE_VERIFIED_COUNT_METHOD_CONTRACT,
  type OmanLocationCandidateVerifiedCountMethod,
} from '@/config/geo/location-candidate-verified-count-method-contract';
import type { OmanLocationCandidateDimension } from '@/config/geo/location-threshold-policy';
import type { OmanGeoRouteEntity } from '@/config/geo/route-contract';

export type OmanLocationCandidateVerifiedCountStatus = 'disabled' | 'blocked' | 'ready-for-audit' | 'active';

export type OmanLocationCandidateVerifiedCountInput = {
  entity: OmanGeoRouteEntity;
  dimension: OmanLocationCandidateDimension;
  locationSlug: string;
};

export type OmanLocationCandidateVerifiedCountState = {
  entity: OmanGeoRouteEntity;
  dimension: OmanLocationCandidateDimension;
  locationSlug: string;
  status: 'disabled';
  method: OmanLocationCandidateVerifiedCountMethod;
  verifiedCount: null;
  runtimeCountingAllowed: false;
  databaseAccessAllowed: false;
  importAllowed: false;
  routeCreationAllowed: false;
  sitemapAllowed: false;
  jsonLdAllowed: false;
  indexPromotionAllowed: false;
  internalSeoLinksAllowed: false;
  blockedReasons: readonly string[];
};

export function getOmanLocationCandidateVerifiedCountState(
  input: OmanLocationCandidateVerifiedCountInput,
): OmanLocationCandidateVerifiedCountState {
  return {
    entity: input.entity,
    dimension: input.dimension,
    locationSlug: input.locationSlug,
    status: 'disabled',
    method: OMAN_LOCATION_CANDIDATE_VERIFIED_COUNT_METHOD,
    verifiedCount: null,
    runtimeCountingAllowed: false,
    databaseAccessAllowed: false,
    importAllowed: false,
    routeCreationAllowed: false,
    sitemapAllowed: false,
    jsonLdAllowed: false,
    indexPromotionAllowed: false,
    internalSeoLinksAllowed: false,
    blockedReasons: [
      'candidate-verified-count-contract-only',
      'candidate-verified-count-runtime-disabled',
      'candidate-verified-count-import-disabled',
    ],
  };
}

export function getOmanLocationCandidateVerifiedCountRuntimeContract() {
  return OMAN_LOCATION_CANDIDATE_VERIFIED_COUNT_METHOD_CONTRACT;
}
