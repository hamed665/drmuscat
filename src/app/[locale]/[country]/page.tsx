import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomeAds2026 } from '@/components/home/HomeAds2026';
import { HomeAreas2026 } from '@/components/home/HomeAreas2026';
import { HomeArticles2026 } from '@/components/home/HomeArticles2026';
import { HomeCareStories2026 } from '@/components/home/HomeCareStories2026';
import { HomeCategories2026 } from '@/components/home/HomeCategories2026';
import { HomeFeaturedProviders2026 } from '@/components/home/HomeFeaturedProviders2026';
import { HomeForProviders2026 } from '@/components/home/HomeForProviders2026';
import { HomeOffers2026 } from '@/components/home/HomeOffers2026';
import { HomePage2026HeaderHero } from '@/components/home/HomePage2026HeaderHero';
import { HomeTrust2026 } from '@/components/home/HomeTrust2026';
import {
  isSupportedCountry,
  isSupportedLocale,
  localeDirection,
  SupportedCountry,
  SupportedLocale
} from '@/lib/i18n/config';

type Params = { locale: string; country: string };

type HomeMetadataCopy = {
  metadataTitle: string;
  metadataDescription: string;
};

const homeMetadataByLocale: Record<SupportedLocale, HomeMetadataCopy> = {
  en: {
    metadataTitle: 'DrMuscat Oman | Healthcare Discovery in Muscat',
    metadataDescription:
      'Find healthcare options in Oman with DrMuscat public discovery for doctors, clinics, labs, pharmacies, services, offers previews and provider visibility.'
  },
  ar: {
    metadataTitle: 'DrMuscat عُمان | اكتشاف الرعاية الصحية في مسقط',
    metadataDescription:
      'استكشف خيارات الرعاية الصحية في عُمان عبر DrMuscat لاكتشاف الأطباء والعيادات والمختبرات والصيدليات والخدمات ومعاينات العروض وظهور المقدّمين.'
  }
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, country } = await params;

  if (!isSupportedLocale(locale) || !isSupportedCountry(country)) {
    return {};
  }

  const copy = homeMetadataByLocale[locale as SupportedLocale];

  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    alternates: {
      canonical: `/${locale}/${country}`
    }
  };
}

export default async function LocaleCountryHome({ params }: { params: Promise<Params> }) {
  const { locale, country } = await params;

  if (!isSupportedLocale(locale) || !isSupportedCountry(country)) {
    notFound();
  }

  const safeLocale = locale as SupportedLocale;
  const safeCountry = country as SupportedCountry;
  const dir = localeDirection(safeLocale);

  return (
    <div className="home-foundation dm2026-home-page" dir={dir} data-country={safeCountry} data-locale={safeLocale}>
      <HomePage2026HeaderHero locale={safeLocale} country={safeCountry} dir={dir} />
      <div className="dm2026-container dm2026-home-main" role="region" aria-label={safeLocale === 'ar' ? 'محتوى الصفحة الرئيسية' : 'Homepage content'}>
        <HomeCareStories2026 locale={safeLocale} dir={dir} />
        <HomeCategories2026 locale={safeLocale} country={safeCountry} dir={dir} />
        <HomeFeaturedProviders2026 locale={safeLocale} dir={dir} />
        <HomeOffers2026 locale={safeLocale} dir={dir} />
        <HomeAds2026 locale={safeLocale} dir={dir} />
        <HomeArticles2026 locale={safeLocale} dir={dir} />
        <HomeAreas2026 locale={safeLocale} country={safeCountry} dir={dir} />
        <HomeForProviders2026 locale={safeLocale} country={safeCountry} dir={dir} />
        <HomeTrust2026 locale={safeLocale} dir={dir} />
      </div>
    </div>
  );
}
