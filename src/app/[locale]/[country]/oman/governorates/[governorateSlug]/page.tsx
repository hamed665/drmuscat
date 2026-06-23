import { notFound } from 'next/navigation';

import { OmanGeoRuntimeScaffold } from '@/components/geo/oman-geo-runtime-scaffold';
import { OMAN_GOVERNORATES } from '@/config/geo/oman';
import { isSupportedCountry, isSupportedLocale } from '@/lib/i18n/config';

type Params = {
  locale: string;
  country: string;
  governorateSlug: string;
};

export default async function OmanGovernoratePage({ params }: { params: Promise<Params> }) {
  const { locale, country, governorateSlug } = await params;

  if (!isSupportedLocale(locale) || !isSupportedCountry(country) || country !== 'om') {
    notFound();
  }

  const governorate = OMAN_GOVERNORATES.find((item) => item.slug === governorateSlug);

  if (!governorate) {
    notFound();
  }

  return (
    <OmanGeoRuntimeScaffold
      locale={locale}
      country={country}
      entity="governorate"
      item={governorate}
    />
  );
}
