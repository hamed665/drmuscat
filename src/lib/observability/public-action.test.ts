import { describe, expect, it } from 'vitest';

import { recordPublicAction } from './public-action';

describe('recordPublicAction', () => {
  it('returns a local result for a valid public action payload', () => {
    const result = recordPublicAction({
      name: 'whatsapp_click',
      locale: 'en',
      country: 'om',
      routeFamily: 'profile',
      entityFamily: 'doctor',
    });

    expect(result).toEqual({
      ok: true,
      payload: {
        name: 'whatsapp_click',
        locale: 'en',
        country: 'om',
        routeFamily: 'profile',
        entityFamily: 'doctor',
      },
      mode: 'local_only',
    });
  });

  it('rejects an unknown public action name', () => {
    const result = recordPublicAction({
      name: 'unknown_action',
      locale: 'en',
      country: 'om',
    });

    expect(result).toEqual({
      ok: false,
      reason: 'invalid_payload',
      mode: 'local_only',
    });
  });

  it('rejects unsupported locale, country, route family, and entity family values', () => {
    expect(recordPublicAction({ name: 'search_submit', locale: 'fr' })).toEqual({
      ok: false,
      reason: 'invalid_payload',
      mode: 'local_only',
    });

    expect(recordPublicAction({ name: 'search_submit', country: 'ae' })).toEqual({
      ok: false,
      reason: 'invalid_payload',
      mode: 'local_only',
    });

    expect(recordPublicAction({ name: 'search_submit', routeFamily: 'admin' })).toEqual({
      ok: false,
      reason: 'invalid_payload',
      mode: 'local_only',
    });

    expect(recordPublicAction({ name: 'search_submit', entityFamily: 'insurance' })).toEqual({
      ok: false,
      reason: 'invalid_payload',
      mode: 'local_only',
    });
  });
});
