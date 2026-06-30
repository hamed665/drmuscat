import { sitemapMarketCountries } from '@/lib/market/public-market';
import { localizedPathname, localizedRootPath, siteConfig, type SiteCountry, type SiteLocale } from '@/lib/seo/site';

export type PublicUrlFamily = 'home' | 'directory' | 'profile' | 'search' | 'geo_area' | 'geo_specialty' | 'geo_specialty_area' | 'service' | 'service_area' | 'provider_onboarding' | 'policy';
export type PublicUrlIndexPolicy = 'index' | 'noindex_follow' | 'blocked' | 'promotion_required';
export type PublicUrlSitemapPolicy = 'included' | 'excluded' | 'eligible_after_gate';
export type PublicUrlSchemaPolicy = 'site_identity' | 'breadcrumb_allowed' | 'disabled_until_evidence' | 'disabled';
export type PublicUrlLaunchStatus = 'launch_ready' | 'noindex_preview' | 'blocked' | 'future_gate_required';
export type PublicUrlInternalLinkRequirement = 'root_entry' | 'nav_or_contextual_parent' | 'directory_parent_required' | 'promotion_gate_required';
export type PublicUrlRequiredGuard = 'market-root' | 'trust-directory' | 'provider-onboarding' | 'policy-noindex' | 'search-utility-noindex' | 'money-page-needs-real-data' | 'offers-engine-not-public' | 'legacy-non-core-needs-reapproval' | 'parent-internal-link-contract' | 'schema-evidence-contract';
export type PublicUrlChangeFrequency = 'daily' | 'weekly' | 'monthly';

export type PublicUrlRegistryEntry = {
  readonly id: string;
  readonly route: string;
  readonly locale: SiteLocale;
  readonly country: SiteCountry;
  readonly family: PublicUrlFamily;
  readonly canonicalPath: string;
  readonly indexPolicy: PublicUrlIndexPolicy;
  readonly sitemapPolicy: PublicUrlSitemapPolicy;
  readonly parentRoute: string | null;
  readonly parentCanonicalPath: string | null;
  readonly requiredGuards: readonly PublicUrlRequiredGuard[];
  readonly internalLinkRequirement: PublicUrlInternalLinkRequirement;
  readonly schemaPolicy: PublicUrlSchemaPolicy;
  readonly launchStatus: PublicUrlLaunchStatus;
  readonly priority: number;
  readonly changeFrequency: PublicUrlChangeFrequency;
  readonly launchGateReason: PublicUrlRequiredGuard;
};

export function listPublicUrlRegistryEntries(): PublicUrlRegistryEntry[] {
  return sitemapMarketCountries.flatMap((country) =>
    siteConfig.locales.map((locale) => ({
      id: `${locale}_${country}_root`,
      route: '/',
      locale,
      country,
      family: 'home',
      canonicalPath: localizedRootPath(locale, country),
      indexPolicy: 'index',
      sitemapPolicy: 'included',
      parentRoute: null,
      parentCanonicalPath: null,
      requiredGuards: ['market-root', 'schema-evidence-contract'],
      internalLinkRequirement: 'root_entry',
      schemaPolicy: 'site_identity',
      launchStatus: 'launch_ready',
      priority: 1,
      changeFrequency: 'weekly',
      launchGateReason: 'market-root',
    })),
  );
}

export function getPublicUrlRegistryEntry(input: { route: string; locale?: SiteLocale; country?: SiteCountry }): PublicUrlRegistryEntry | null {
  const locale = input.locale ?? siteConfig.defaultLocale;
  const country = input.country ?? siteConfig.defaultCountry;
  const route = input.route === '/' ? '/' : input.route.startsWith('/') ? input.route : `/${input.route}`;
  const canonicalPath = route === '/' ? localizedRootPath(locale, country) : localizedPathname(route, locale, country);
  return listPublicUrlRegistryEntries().find((entry) => entry.canonicalPath === canonicalPath) ?? null;
}

export function isIndexablePublicUrlEntry(entry: PublicUrlRegistryEntry): boolean {
  return entry.indexPolicy === 'index' && entry.launchStatus === 'launch_ready';
}

export function isSitemapIncludedPublicUrlEntry(entry: PublicUrlRegistryEntry): boolean {
  return isIndexablePublicUrlEntry(entry) && entry.sitemapPolicy === 'included';
}

export function listSitemapIncludedPublicUrlEntries(): PublicUrlRegistryEntry[] {
  return listPublicUrlRegistryEntries().filter(isSitemapIncludedPublicUrlEntry);
}

export function hasRequiredInternalLinkContract(entry: PublicUrlRegistryEntry): boolean {
  if (entry.family === 'home') return entry.internalLinkRequirement === 'root_entry' && entry.parentRoute === null;
  if (!isIndexablePublicUrlEntry(entry)) return true;
  return entry.parentRoute !== null && entry.internalLinkRequirement !== 'root_entry';
}
