import { describe, expect, it } from 'vitest';

import { cleanConfigBrand } from './configBrand';
import type { PublicDiscoveryPageConfig } from './publicDiscoveryPageConfig';
import * as discoveryConfig from './publicDiscoveryPageConfig';

const legacyNames = [
  'Dr' + 'Muscat',
  'Dr ' + 'Muscat',
  'Doc' + 'tor Muscat',
  'دکتر' + ' مسقط',
  'دكتور' + ' مسقط',
  'د.' + ' مسقط'
] as const;

type ConfigBuilder = (locale: 'en' | 'ar', country: 'om', dir: 'ltr' | 'rtl') => PublicDiscoveryPageConfig;

const configBuilders = Object.entries(discoveryConfig)
  .filter(([name, value]) => name.startsWith('build') && name.endsWith('DiscoveryConfig') && typeof value === 'function') as [
  string,
  ConfigBuilder
][];

function stringify(value: unknown): string {
  return JSON.stringify(value);
}

describe('public discovery config brand output', () => {
  it('covers every exported discovery config builder', () => {
    expect(configBuilders.length).toBeGreaterThanOrEqual(8);
  });

  it.each(configBuilders)('normalizes legacy brand copy from %s output', (_name, buildConfig) => {
    for (const locale of ['en', 'ar'] as const) {
      const dir = locale === 'ar' ? 'rtl' : 'ltr';
      const output = stringify(cleanConfigBrand(buildConfig(locale, 'om', dir)));

      for (const legacyName of legacyNames) {
        expect(output).not.toContain(legacyName);
      }
    }
  });
});
