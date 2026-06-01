import { notFound } from 'next/navigation';

import { getServiceAreaLandingGateData } from '@/lib/catalog/public-landing-page-queries';
import { isSupportedCountry, isSupportedLocale } from '@/lib/i18n/config';
import { decideLandingPageGate } from '@/lib/seo/landing-page-indexability';

type Params = { locale: string; country: string; serviceSlug: string; areaSlug: string };

export default async function ServiceAreaLandingScaffoldPage({ params }: { params: Promise<Params> }) {
  const { locale, country, serviceSlug, areaSlug } = await params;

  if (!isSupportedLocale(locale) || !isSupportedCountry(country)) notFound();

  const landingGateData = getServiceAreaLandingGateData({
    locale,
    country,
    serviceSlug,
    areaSlug
  });
  const gate = decideLandingPageGate(landingGateData.input);

  if (gate.status !== 'indexable_later_only') notFound();

  notFound();
}
