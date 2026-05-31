import { describe, expect, it } from 'vitest';

import {
  getAreaLandingGateData,
  getServiceAreaLandingGateData,
  getServiceLandingGateData,
  getSpecialtyAreaLandingGateData,
  getSpecialtyLandingGateData,
  type PublicLandingGateDataErrorCode,
  type PublicLandingGateDataResult,
  type PublicLandingGateFamily
} from './public-landing-page-queries';

const expectedInputKeys = [
  'locale',
  'country',
  'family',
  'entityExists',
  'providerCount',
  'centerCount',
  'exactCombinationCount',
  'hasUniqueVisibleIntro',
  'hasLocalRelevance',
  'medicalReviewStatus',
  'canonicalIsUnique',
  'privateDataExcluded',
  'helperAvailable',
  'entityIsAmbiguous',
  'routeFamilyAllowed'
].sort();

const expectFailClosedResult = (
  result: PublicLandingGateDataResult,
  family: PublicLandingGateFamily,
  code: PublicLandingGateDataErrorCode
) => {
  expect(result.ok).toBe(false);
  expect(result.error.message).toBe('Public landing gate data unavailable.');
  expect(result.error.code).toBe(code);
  expect(result.sourceTables).toEqual([]);
  expect(result.input.family).toBe(family);
  expect(result.input.entityExists).toBe(false);
  expect(result.input.providerCount).toBe(0);
  expect(result.input.centerCount).toBe(0);
  expect(result.input.exactCombinationCount).toBe(0);
  expect(result.input.hasUniqueVisibleIntro).toBe(false);
  expect(result.input.hasLocalRelevance).toBe(false);
  expect(result.input.medicalReviewStatus).toBe('missing');
  expect(result.input.canonicalIsUnique).toBe(false);
  expect(result.input.privateDataExcluded).toBe(true);
  expect(result.input.helperAvailable).toBe(false);
  expect(result.input.entityIsAmbiguous).toBe(false);
  expect(result.input.routeFamilyAllowed).toBe(true);
  expect(Object.keys(result).sort()).toEqual(['error', 'input', 'ok', 'sourceTables'].sort());
  expect(Object.keys(result.input).sort()).toEqual(expectedInputKeys);
};

describe('public landing page query helper skeleton', () => {
  it('returns fail-closed results for supported specialty input shape', () => {
    expectFailClosedResult(
      getSpecialtyLandingGateData({
        locale: 'en',
        country: 'om',
        specialtySlug: 'dentist'
      }),
      'specialty',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
  });

  it('returns fail-closed results for supported specialty-area input shape', () => {
    expectFailClosedResult(
      getSpecialtyAreaLandingGateData({
        locale: 'ar',
        country: 'om',
        specialtySlug: 'dentist',
        areaSlug: 'al-khuwair'
      }),
      'specialty_area',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
  });

  it('returns fail-closed results for supported area input shape', () => {
    expectFailClosedResult(
      getAreaLandingGateData({
        locale: 'en',
        country: 'om',
        areaSlug: 'al-khuwair'
      }),
      'area',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
  });

  it('returns fail-closed results for supported service input shape', () => {
    expectFailClosedResult(
      getServiceLandingGateData({
        locale: 'ar',
        country: 'om',
        serviceSlug: 'teeth-cleaning'
      }),
      'service',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
  });

  it('returns fail-closed results for supported service-area input shape', () => {
    expectFailClosedResult(
      getServiceAreaLandingGateData({
        locale: 'en',
        country: 'om',
        serviceSlug: 'teeth-cleaning',
        areaSlug: 'al-khuwair'
      }),
      'service_area',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
  });

  it('returns unsupported locale while staying fail-closed for every helper family', () => {
    expectFailClosedResult(
      getSpecialtyLandingGateData({ locale: 'fr', country: 'om', specialtySlug: 'dentist' }),
      'specialty',
      'UNSUPPORTED_LOCALE'
    );
    expectFailClosedResult(
      getSpecialtyAreaLandingGateData({
        locale: 'fr',
        country: 'om',
        specialtySlug: 'dentist',
        areaSlug: 'al-khuwair'
      }),
      'specialty_area',
      'UNSUPPORTED_LOCALE'
    );
    expectFailClosedResult(
      getAreaLandingGateData({ locale: 'fr', country: 'om', areaSlug: 'al-khuwair' }),
      'area',
      'UNSUPPORTED_LOCALE'
    );
    expectFailClosedResult(
      getServiceLandingGateData({ locale: 'fr', country: 'om', serviceSlug: 'teeth-cleaning' }),
      'service',
      'UNSUPPORTED_LOCALE'
    );
    expectFailClosedResult(
      getServiceAreaLandingGateData({
        locale: 'fr',
        country: 'om',
        serviceSlug: 'teeth-cleaning',
        areaSlug: 'al-khuwair'
      }),
      'service_area',
      'UNSUPPORTED_LOCALE'
    );
  });

  it('returns unsupported country while staying fail-closed for every helper family', () => {
    expectFailClosedResult(
      getSpecialtyLandingGateData({ locale: 'en', country: 'ae', specialtySlug: 'dentist' }),
      'specialty',
      'UNSUPPORTED_COUNTRY'
    );
    expectFailClosedResult(
      getSpecialtyAreaLandingGateData({
        locale: 'ar',
        country: 'ae',
        specialtySlug: 'dentist',
        areaSlug: 'al-khuwair'
      }),
      'specialty_area',
      'UNSUPPORTED_COUNTRY'
    );
    expectFailClosedResult(
      getAreaLandingGateData({ locale: 'en', country: 'ae', areaSlug: 'al-khuwair' }),
      'area',
      'UNSUPPORTED_COUNTRY'
    );
    expectFailClosedResult(
      getServiceLandingGateData({ locale: 'ar', country: 'ae', serviceSlug: 'teeth-cleaning' }),
      'service',
      'UNSUPPORTED_COUNTRY'
    );
    expectFailClosedResult(
      getServiceAreaLandingGateData({
        locale: 'en',
        country: 'ae',
        serviceSlug: 'teeth-cleaning',
        areaSlug: 'al-khuwair'
      }),
      'service_area',
      'UNSUPPORTED_COUNTRY'
    );
  });

  it('returns not implemented and fail-closed results for blank slug inputs', () => {
    expectFailClosedResult(
      getSpecialtyLandingGateData({ locale: 'en', country: 'om', specialtySlug: '' }),
      'specialty',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
    expectFailClosedResult(
      getSpecialtyLandingGateData({ locale: 'en', country: 'om', specialtySlug: '   ' }),
      'specialty',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
    expectFailClosedResult(
      getAreaLandingGateData({ locale: 'en', country: 'om', areaSlug: '' }),
      'area',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
    expectFailClosedResult(
      getServiceLandingGateData({ locale: 'ar', country: 'om', serviceSlug: '' }),
      'service',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
    expectFailClosedResult(
      getServiceAreaLandingGateData({
        locale: 'en',
        country: 'om',
        serviceSlug: 'teeth-cleaning',
        areaSlug: '   '
      }),
      'service_area',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
  });

  it('returns not implemented and fail-closed results for invalid runtime slug types without throwing', () => {
    expect(() =>
      getSpecialtyLandingGateData({
        locale: 'en',
        country: 'om',
        specialtySlug: null as unknown as string
      })
    ).not.toThrow();
    expectFailClosedResult(
      getSpecialtyLandingGateData({
        locale: 'en',
        country: 'om',
        specialtySlug: null as unknown as string
      }),
      'specialty',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );

    expect(() =>
      getAreaLandingGateData({
        locale: 'en',
        country: 'om',
        areaSlug: 123 as unknown as string
      })
    ).not.toThrow();
    expectFailClosedResult(
      getAreaLandingGateData({
        locale: 'en',
        country: 'om',
        areaSlug: 123 as unknown as string
      }),
      'area',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );

    expect(() =>
      getServiceLandingGateData({
        locale: 'ar',
        country: 'om',
        serviceSlug: undefined as unknown as string
      })
    ).not.toThrow();
    expectFailClosedResult(
      getServiceLandingGateData({
        locale: 'ar',
        country: 'om',
        serviceSlug: undefined as unknown as string
      }),
      'service',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
  });

  it('prioritizes unsupported locale over unsupported country and invalid slug inputs', () => {
    expectFailClosedResult(
      getSpecialtyLandingGateData({ locale: 'fr', country: 'ae', specialtySlug: 'dentist' }),
      'specialty',
      'UNSUPPORTED_LOCALE'
    );
    expectFailClosedResult(
      getSpecialtyLandingGateData({ locale: 'fr', country: 'om', specialtySlug: '' }),
      'specialty',
      'UNSUPPORTED_LOCALE'
    );
  });

  it('prioritizes unsupported country over invalid slug inputs', () => {
    expectFailClosedResult(
      getSpecialtyLandingGateData({ locale: 'en', country: 'ae', specialtySlug: '' }),
      'specialty',
      'UNSUPPORTED_COUNTRY'
    );
  });

  it('never returns a passing output for any helper family', () => {
    expectFailClosedResult(
      getSpecialtyLandingGateData({ locale: 'en', country: 'om', specialtySlug: 'dentist' }),
      'specialty',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
    expectFailClosedResult(
      getSpecialtyAreaLandingGateData({
        locale: 'ar',
        country: 'om',
        specialtySlug: 'dentist',
        areaSlug: 'al-khuwair'
      }),
      'specialty_area',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
    expectFailClosedResult(
      getAreaLandingGateData({ locale: 'en', country: 'om', areaSlug: 'al-khuwair' }),
      'area',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
    expectFailClosedResult(
      getServiceLandingGateData({ locale: 'ar', country: 'om', serviceSlug: 'teeth-cleaning' }),
      'service',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
    expectFailClosedResult(
      getServiceAreaLandingGateData({
        locale: 'en',
        country: 'om',
        serviceSlug: 'teeth-cleaning',
        areaSlug: 'al-khuwair'
      }),
      'service_area',
      'QUERY_HELPER_NOT_IMPLEMENTED'
    );
  });
});
