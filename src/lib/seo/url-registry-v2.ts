export type SeoUrlFamilyV2 =
  | 'country_root'
  | 'core_directory'
  | 'search_utility'
  | 'provider_onboarding'
  | 'article_surface'
  | 'provider_detail'
  | 'geo_surface'
  | 'private_surface';

export type SeoUrlIndexPolicyV2 = 'index' | 'noindex' | 'gate_before_index';
export type SeoUrlSitemapPolicyV2 = 'include' | 'exclude' | 'gate_before_include';
export type SeoUrlGateV2 =
  | 'market_enabled'
  | 'static_ready'
  | 'search_noindex'
  | 'provider_eligibility'
  | 'geo_promotion'
  | 'editorial_review'
  | 'private_exclusion';

export type SeoUrlRegistryEntryV2 = {
  readonly id: string;
  readonly family: SeoUrlFamilyV2;
  readonly pattern: string;
  readonly indexPolicy: SeoUrlIndexPolicyV2;
  readonly sitemapPolicy: SeoUrlSitemapPolicyV2;
  readonly gate: SeoUrlGateV2;
  readonly localeAware: boolean;
  readonly countryAware: boolean;
};

export const seoUrlRegistryV2 = [
  { id: 'country-root', family: 'country_root', pattern: '/:locale/:country', indexPolicy: 'index', sitemapPolicy: 'include', gate: 'market_enabled', localeAware: true, countryAware: true },
  { id: 'doctors-directory', family: 'core_directory', pattern: '/:locale/:country/doctors', indexPolicy: 'index', sitemapPolicy: 'include', gate: 'static_ready', localeAware: true, countryAware: true },
  { id: 'centers-directory', family: 'core_directory', pattern: '/:locale/:country/centers', indexPolicy: 'index', sitemapPolicy: 'include', gate: 'static_ready', localeAware: true, countryAware: true },
  { id: 'labs-directory', family: 'core_directory', pattern: '/:locale/:country/labs', indexPolicy: 'index', sitemapPolicy: 'include', gate: 'static_ready', localeAware: true, countryAware: true },
  { id: 'pharmacies-directory', family: 'core_directory', pattern: '/:locale/:country/pharmacies', indexPolicy: 'index', sitemapPolicy: 'include', gate: 'static_ready', localeAware: true, countryAware: true },
  { id: 'hospitals-directory', family: 'core_directory', pattern: '/:locale/:country/hospitals', indexPolicy: 'index', sitemapPolicy: 'include', gate: 'static_ready', localeAware: true, countryAware: true },
  { id: 'services-directory', family: 'core_directory', pattern: '/:locale/:country/services', indexPolicy: 'index', sitemapPolicy: 'include', gate: 'static_ready', localeAware: true, countryAware: true },
  { id: 'provider-onboarding', family: 'provider_onboarding', pattern: '/:locale/:country/for-providers', indexPolicy: 'index', sitemapPolicy: 'include', gate: 'static_ready', localeAware: true, countryAware: true },
  { id: 'search', family: 'search_utility', pattern: '/:locale/:country/search', indexPolicy: 'noindex', sitemapPolicy: 'exclude', gate: 'search_noindex', localeAware: true, countryAware: true },
  { id: 'articles', family: 'article_surface', pattern: '/:locale/:country/articles/:slug?', indexPolicy: 'gate_before_index', sitemapPolicy: 'gate_before_include', gate: 'editorial_review', localeAware: true, countryAware: true },
  { id: 'center-detail', family: 'provider_detail', pattern: '/:locale/:country/center/:centerSlug', indexPolicy: 'gate_before_index', sitemapPolicy: 'gate_before_include', gate: 'provider_eligibility', localeAware: true, countryAware: true },
  { id: 'doctor-detail', family: 'provider_detail', pattern: '/:locale/:country/doctor/:doctorSlug', indexPolicy: 'gate_before_index', sitemapPolicy: 'gate_before_include', gate: 'provider_eligibility', localeAware: true, countryAware: true },
  { id: 'pharmacy-detail', family: 'provider_detail', pattern: '/:locale/:country/pharmacies/:pharmacySlug', indexPolicy: 'gate_before_index', sitemapPolicy: 'gate_before_include', gate: 'provider_eligibility', localeAware: true, countryAware: true },
  { id: 'hospital-detail', family: 'provider_detail', pattern: '/:locale/:country/hospitals/:hospitalSlug', indexPolicy: 'gate_before_index', sitemapPolicy: 'gate_before_include', gate: 'provider_eligibility', localeAware: true, countryAware: true },
  { id: 'location-geo', family: 'geo_surface', pattern: '/:locale/:country/locations/:slug+', indexPolicy: 'gate_before_index', sitemapPolicy: 'gate_before_include', gate: 'geo_promotion', localeAware: true, countryAware: true },
  { id: 'admin-private', family: 'private_surface', pattern: '/admin/**', indexPolicy: 'noindex', sitemapPolicy: 'exclude', gate: 'private_exclusion', localeAware: false, countryAware: false },
  { id: 'preview-private', family: 'private_surface', pattern: '/preview/**', indexPolicy: 'noindex', sitemapPolicy: 'exclude', gate: 'private_exclusion', localeAware: false, countryAware: false },
] as const satisfies readonly SeoUrlRegistryEntryV2[];

export function listSeoUrlRegistryV2(): readonly SeoUrlRegistryEntryV2[] {
  return seoUrlRegistryV2;
}

export function listSeoUrlRegistryV2ByGate(gate: SeoUrlGateV2): readonly SeoUrlRegistryEntryV2[] {
  return seoUrlRegistryV2.filter((entry) => entry.gate === gate);
}
