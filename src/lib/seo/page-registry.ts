import { siteConfig, type SiteCountry, type SiteLocale } from '@/lib/seo/site';
import {
  getPublicUrlRegistryEntry,
  isSitemapIncludedPublicUrlEntry,
  listPublicUrlRegistryEntries,
  type PublicUrlRegistryEntry,
} from '@/lib/seo/url-registry';

export type SeoPageFamily =
  | 'country_root'
  | 'directory'
  | 'provider_onboarding'
  | 'policy';

export type SeoPageIndexPolicy = 'index' | 'noindex_until_ready';
export type SeoPageReadiness = 'ready' | 'needs_content' | 'blocked';

export type SeoPageLaunchGateReason =
  | 'market-root'
  | 'trust-directory'
  | 'provider-onboarding'
  | 'policy-noindex'
  | 'search-utility-noindex'
  | 'money-page-needs-real-data'
  | 'offers-engine-not-public'
  | 'legacy-non-core-needs-reapproval';

export type PublicSeoPageDefinition = {
  readonly id: string;
  readonly pathname: string;
  readonly family: SeoPageFamily;
  readonly indexPolicy: SeoPageIndexPolicy;
  readonly readiness: SeoPageReadiness;
  readonly sitemapEligible: boolean;
  readonly priority: number;
  readonly changeFrequency: 'daily' | 'weekly' | 'monthly';
  readonly launchGateReason: SeoPageLaunchGateReason;
};

function legacyFamily(entry: PublicUrlRegistryEntry): SeoPageFamily {
  if (entry.family === 'home') return 'country_root';
  if (entry.family === 'provider_onboarding') return 'provider_onboarding';
  if (entry.family === 'policy') return 'policy';
  return 'directory';
}

function legacyIndexPolicy(entry: PublicUrlRegistryEntry): SeoPageIndexPolicy {
  return entry.indexPolicy === 'index' ? 'index' : 'noindex_until_ready';
}

function legacyReadiness(entry: PublicUrlRegistryEntry): SeoPageReadiness {
  if (entry.launchStatus === 'launch_ready') return 'ready';
  if (entry.launchStatus === 'blocked') return 'blocked';
  return 'needs_content';
}

function mapUrlEntryToSeoPageDefinition(entry: PublicUrlRegistryEntry): PublicSeoPageDefinition {
  return {
    id: entry.id,
    pathname: entry.canonicalPath,
    family: legacyFamily(entry),
    indexPolicy: legacyIndexPolicy(entry),
    readiness: legacyReadiness(entry),
    sitemapEligible: entry.sitemapPolicy === 'included',
    priority: entry.priority,
    changeFrequency: entry.changeFrequency,
    launchGateReason: entry.launchGateReason as SeoPageLaunchGateReason,
  };
}

export function listPublicSeoPageDefinitions(): PublicSeoPageDefinition[] {
  return listPublicUrlRegistryEntries().map(mapUrlEntryToSeoPageDefinition);
}

export function getPublicSeoPageDefinition(input: {
  pathname: string;
  locale?: SiteLocale;
  country?: SiteCountry;
}): PublicSeoPageDefinition | null {
  const entry = getPublicUrlRegistryEntry({
    route: input.pathname,
    locale: input.locale ?? siteConfig.defaultLocale,
    country: input.country ?? siteConfig.defaultCountry,
  });

  return entry === null ? null : mapUrlEntryToSeoPageDefinition(entry);
}

export function isSitemapReadySeoPageDefinition(page: PublicSeoPageDefinition): boolean {
  return page.indexPolicy === 'index' && page.readiness === 'ready' && page.sitemapEligible;
}

export function listSitemapEligibleSeoPageDefinitions(): PublicSeoPageDefinition[] {
  return listPublicUrlRegistryEntries()
    .filter(isSitemapIncludedPublicUrlEntry)
    .map(mapUrlEntryToSeoPageDefinition);
}
