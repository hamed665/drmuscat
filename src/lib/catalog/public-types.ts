import type { Database } from '@/lib/supabase/types';

export type PublicCatalogLocale = 'en' | 'ar';

export type PublicCatalogCountry = 'om';

export type PublicCatalogSlug = 'doctors' | 'centers' | 'pharmacies' | 'labs' | 'services' | 'search';

export type PublicCatalogEmptyReason =
  | 'no_rows'
  | 'unsupported_entity'
  | 'query_not_implemented'
  | 'query_error'
  | 'search_query_too_short';

export type PublicCatalogQueryError = {
  code: 'PUBLIC_CATALOG_QUERY_FAILED';
  message: 'Public catalog query failed.';
};

export type PublicCatalogQueryResult<T> = {
  ok: boolean;
  data: T;
  emptyReason: PublicCatalogEmptyReason | null;
  error: PublicCatalogQueryError | null;
};

export type PublicDiscoveryCategory = {
  slug: Exclude<PublicCatalogSlug, 'search'>;
  label: string;
};

export type CenterType = Database['public']['Enums']['center_type'];
export type CountryCode = Database['public']['Enums']['country_code'];
export type DoctorGender = Database['public']['Enums']['doctor_gender'];
export type DoctorTitle = Database['public']['Enums']['doctor_title'];

export type PublicCenterSummary = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  centerType: CenterType;
  descriptionEn: string | null;
  descriptionAr: string | null;
  shortDescriptionEn: string | null;
  shortDescriptionAr: string | null;
  defaultCountry: CountryCode;
};

export type PublicDoctorSummary = {
  id: string;
  slug: string;
  fullNameEn: string;
  fullNameAr: string | null;
  titleEn: DoctorTitle;
  titleAr: DoctorTitle;
  gender: DoctorGender;
  defaultCountry: CountryCode;
};

export type PublicServiceSummary = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  categoryId: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
};

export type PublicGeoAreaSummary = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  cityId: string;
  countryId: string;
};

export type PublicCatalogSearchResult = {
  centers: PublicCenterSummary[];
  doctors: PublicDoctorSummary[];
  services: PublicServiceSummary[];
  areas: PublicGeoAreaSummary[];
};

export type PublicListOptions = {
  limit?: number;
};

export type PublicCenterListOptions = PublicListOptions & {
  country?: CountryCode;
  centerType?: CenterType;
};

export type PublicDoctorListOptions = PublicListOptions & {
  country?: CountryCode;
};

export type PublicServiceListOptions = PublicListOptions & {
  categoryId?: string;
};

export type PublicGeoAreaListOptions = PublicListOptions & {
  countryId?: string;
  cityId?: string;
};

export type PublicSearchOptions = PublicListOptions;
