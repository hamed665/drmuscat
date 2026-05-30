import { notFound } from 'next/navigation';

import { isSupportedCountry, isSupportedLocale } from '@/lib/i18n/config';

type Params = { locale: string; country: string; serviceSlug: string; areaSlug: string };

export default async function ServiceAreaLandingScaffoldPage({ params }: { params: Promise<Params> }) {
  const { locale, country } = await params;

  if (!isSupportedLocale(locale) || !isSupportedCountry(country)) notFound();

  notFound();
}
