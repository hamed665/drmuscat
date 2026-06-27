import { normalizePublicBrandCopy } from '@/lib/brand/public-brand-copy';

import type { PublicDiscoveryPageConfig } from './publicDiscoveryPageConfig';

type CleanValue = string | number | boolean | null | undefined | readonly CleanValue[] | { readonly [key: string]: CleanValue };

function cleanValue<T extends CleanValue>(value: T): T {
  if (typeof value === 'string') return normalizePublicBrandCopy(value) as T;
  if (Array.isArray(value)) return value.map((entry) => cleanValue(entry)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cleanValue(entry)])) as T;
  }
  return value;
}

export function cleanConfigBrand<T extends PublicDiscoveryPageConfig>(config: T): T {
  return cleanValue(config as CleanValue) as T;
}
