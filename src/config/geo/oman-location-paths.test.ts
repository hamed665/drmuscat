import { describe, expect, it } from 'vitest';

import {
  buildOmanAreaLocationPath,
  buildOmanGovernorateLocationPath,
  buildOmanLocationPath,
  buildOmanWilayatLocationPath,
} from './oman-location-paths';

describe('Oman parent-aware location paths', () => {
  it('builds canonical governorate, wilayat, and area location paths', () => {
    expect(
      buildOmanGovernorateLocationPath({
        locale: 'en',
        country: 'om',
        governorateSlug: 'muscat',
      })
    ).toBe('/en/om/locations/muscat');

    expect(
      buildOmanWilayatLocationPath({
        locale: 'ar',
        country: 'om',
        governorateSlug: 'muscat',
        wilayatSlug: 'al-seeb',
      })
    ).toBe('/ar/om/locations/muscat/al-seeb');

    expect(
      buildOmanAreaLocationPath({
        locale: 'en',
        country: 'om',
        governorateSlug: 'muscat',
        wilayatSlug: 'al-seeb',
        areaSlug: 'al-khoud',
      })
    ).toBe('/en/om/locations/muscat/al-seeb/al-khoud');
  });

  it('requires parent governorate and wilayat values for area paths at runtime', () => {
    expect(() =>
      buildOmanLocationPath({
        level: 'area',
        locale: 'en',
        country: 'om',
        governorateSlug: 'muscat',
        areaSlug: 'al-khoud',
      } as Parameters<typeof buildOmanLocationPath>[0])
    ).toThrow('wilayatSlug must be a lowercase kebab-case canonical slug.');
  });

  it('rejects non-canonical slug values instead of normalizing dirty input', () => {
    expect(() =>
      buildOmanAreaLocationPath({
        locale: 'en',
        country: 'om',
        governorateSlug: 'Muscat',
        wilayatSlug: 'al-seeb',
        areaSlug: 'al-khoud',
      })
    ).toThrow('governorateSlug must be a lowercase kebab-case canonical slug.');

    expect(() =>
      buildOmanAreaLocationPath({
        locale: 'en',
        country: 'om',
        governorateSlug: 'muscat',
        wilayatSlug: 'al-seeb',
        areaSlug: 'al khoud',
      })
    ).toThrow('areaSlug must be a lowercase kebab-case canonical slug.');
  });
});
