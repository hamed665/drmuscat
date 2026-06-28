import { describe, expect, it } from 'vitest';

import { OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_POLICIES } from '@/config/geo/location-candidate-source-model-contract';

import {
  getOmanLocationCandidateSourceModelRuntimeContract,
  getOmanLocationCandidateSourceModelState,
} from './oman-location-candidate-source-model';

describe('Oman location candidate source model', () => {
  it('keeps every source model policy disabled', () => {
    expect(OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_POLICIES).toHaveLength(9);

    for (const policy of OMAN_LOCATION_CANDIDATE_SOURCE_MODEL_POLICIES) {
      const state = getOmanLocationCandidateSourceModelState({
        entity: policy.entity,
        dimension: policy.dimension,
        locationSlug: `${policy.entity}-${policy.dimension}`,
      });

      expect(state.policy).toBe(policy);
      expect(state.status).toBe('disabled');
      expect(state.runtimeCollectionAllowed).toBe(false);
      expect(state.databaseAccessAllowed).toBe(false);
      expect(state.importAllowed).toBe(false);
      expect(state.routeCreationAllowed).toBe(false);
      expect(state.sitemapAllowed).toBe(false);
      expect(state.jsonLdAllowed).toBe(false);
      expect(state.indexPromotionAllowed).toBe(false);
      expect(state.blockedReasons).toContain('candidate-source-model-contract-only');
      expect(state.blockedReasons).toContain('candidate-source-model-runtime-disabled');
      expect(state.blockedReasons).toContain('candidate-source-model-runtime-collection-disabled');
      expect(state.blockedReasons).toContain('candidate-source-model-import-disabled');
    }
  });

  it('exposes the fail-closed source model contract', () => {
    const contract = getOmanLocationCandidateSourceModelRuntimeContract();

    expect(contract.status).toBe('contract-only');
    expect(contract.runtimeCollectionAllowed).toBe(false);
    expect(contract.databaseAccessAllowed).toBe(false);
    expect(contract.importAllowed).toBe(false);
    expect(contract.routeCreationAllowed).toBe(false);
    expect(contract.sitemapAllowed).toBe(false);
    expect(contract.jsonLdAllowed).toBe(false);
    expect(contract.indexPromotionAllowed).toBe(false);
  });
});
