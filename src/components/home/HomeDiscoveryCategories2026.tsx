import Link from 'next/link';

import { SupportedCountry, SupportedLocale } from '@/lib/i18n/config';
import { PublicDiscoverySlug, publicDiscoveryRoute } from '@/lib/routes/public';

type HomeDiscoveryCategories2026Props = {
  locale: SupportedLocale;
  country: SupportedCountry;
  dir: 'ltr' | 'rtl';
};

type DiscoveryCardTone = 'dental' | 'beauty' | 'offers' | 'doctors' | 'labs' | 'pet' | 'hospitals';
type DiscoveryCardSize = 'large' | 'medium';

type DiscoveryCard = {
  id: DiscoveryCardTone;
  size: DiscoveryCardSize;
  title: Record<SupportedLocale, string>;
  description: Record<SupportedLocale, string>;
  routeSlug?: PublicDiscoverySlug;
};

const discoveryCopy: Record<SupportedLocale, { title: string; subtitle: string; cta: string; ariaLabel: string }> = {
  en: {
    title: 'Explore care categories',
    subtitle: 'Browse the care paths people search most across Oman.',
    cta: 'Explore',
    ariaLabel: 'Explore care categories'
  },
  ar: {
    title: 'استكشف فئات الرعاية',
    subtitle: 'تصفّح أكثر مسارات الرعاية بحثاً في عُمان.',
    cta: 'استكشف',
    ariaLabel: 'استكشف فئات الرعاية'
  }
};

const discoveryCards: readonly DiscoveryCard[] = [
  {
    id: 'dental',
    size: 'large',
    title: { en: 'Dental', ar: 'الأسنان' },
    description: {
      en: 'Browse clinics, specialists and dental care.',
      ar: 'تصفّح العيادات والاختصاصيين ورعاية الأسنان.'
    }
  },
  {
    id: 'beauty',
    size: 'large',
    title: { en: 'Beauty & Aesthetics', ar: 'الجمال والتجميل' },
    description: {
      en: 'Explore skin, laser and aesthetic care profiles.',
      ar: 'استكشف ملفات الجلدية والليزر والرعاية التجميلية.'
    }
  },
  {
    id: 'offers',
    size: 'large',
    title: { en: 'Special Offers', ar: 'العروض الخاصة' },
    description: {
      en: 'Browse approved packages and provider special offers.',
      ar: 'تصفّح الباقات والعروض الخاصة المعتمدة من مقدّمي الخدمة.'
    }
  },
  {
    id: 'doctors',
    size: 'medium',
    title: { en: 'Doctors', ar: 'الأطباء' },
    description: {
      en: 'Find care profiles across major specialties.',
      ar: 'اعثر على ملفات الرعاية عبر التخصصات الرئيسية.'
    },
    routeSlug: 'doctors'
  },
  {
    id: 'labs',
    size: 'medium',
    title: { en: 'Labs', ar: 'المختبرات' },
    description: {
      en: 'Browse diagnostics and test service profiles.',
      ar: 'تصفّح ملفات التشخيص وخدمات الفحوصات.'
    },
    routeSlug: 'labs'
  },
  {
    id: 'pet',
    size: 'medium',
    title: { en: 'Pet Clinic', ar: 'العيادات البيطرية' },
    description: {
      en: 'Discover trusted veterinary care profiles.',
      ar: 'اكتشف ملفات رعاية بيطرية موثوقة.'
    }
  },
  {
    id: 'hospitals',
    size: 'medium',
    title: { en: 'Hospitals', ar: 'المستشفيات' },
    description: {
      en: 'Explore hospital profiles and care services.',
      ar: 'استكشف ملفات المستشفيات وخدمات الرعاية.'
    }
  }
];

function EmbossedSymbol({ id }: { id: DiscoveryCardTone }) {
  return (
    <svg className="dm2026-discovery-card__embossed-svg" viewBox="0 0 96 96" aria-hidden="true" focusable="false">
      {id === 'dental' ? (
        <>
          <path className="dm2026-discovery-card__relief-shadow" d="M31 24c6.5-8 15.5-9 23-4.5C61.5 15 70.5 16 77 24c12 15 4.5 39-8 50-8 7-12-13-21-13S35 81 27 74c-12.5-11-8-35 4-50Z" />
          <path className="dm2026-discovery-card__relief-fill dm2026-discovery-card__relief-fill--hero" d="M31 22c6.5-8 15.5-9 23-4.5C61.5 13 70.5 14 77 22c12 15 4.5 39-8 50-8 7-12-13-21-13S35 79 27 72c-12.5-11-8-35 4-50Z" />
          <path className="dm2026-discovery-card__relief-highlight" d="M36 27c5-4.5 12-5 18-1.5 6-3.5 13-3 18 1.5" />
          <path className="dm2026-discovery-card__relief-line dm2026-discovery-card__relief-line--soft" d="M38 42c9 5 20 5 30 0M39 53c8 4 18 5 28 1" />
        </>
      ) : null}

      {id === 'beauty' ? (
        <>
          <path className="dm2026-discovery-card__relief-shadow" d="M53 16c-15 5-25 18-26 34-1 17 9 30 27 36 15-5 25-17 28-33 2-15-5-29-20-36" />
          <path className="dm2026-discovery-card__relief-fill dm2026-discovery-card__relief-fill--hero" d="M53 14c-15 5-25 18-26 34-1 17 9 30 27 36 15-5 25-17 28-33 2-15-5-29-20-36" />
          <path className="dm2026-discovery-card__relief-line dm2026-discovery-card__relief-line--face" d="M56 23c-9 8-13 18-11 30 2 12 10 20 24 24" />
          <path className="dm2026-discovery-card__relief-highlight" d="M59 35c7 6 8 16 0 25M49 48c6 2 13 1 19-2M51 62c6 3 13 3 20-1" />
          <path className="dm2026-discovery-card__relief-accent dm2026-discovery-card__relief-accent--drop" d="M75 28c5.5 7 8.5 12 8.5 17.5a8.5 8.5 0 0 1-17 0c0-5.5 3-10.5 8.5-17.5Z" />
        </>
      ) : null}

      {id === 'offers' ? (
        <>
          <path className="dm2026-discovery-card__relief-shadow" d="M28 26h40l12 16-32 34-32-34Z" />
          <path className="dm2026-discovery-card__relief-fill dm2026-discovery-card__relief-fill--hero" d="M28 24h40l12 16-32 34-32-34Z" />
          <path className="dm2026-discovery-card__relief-line" d="M28 24 38 40 48 24 58 40 68 24M16 40h64M38 40l10 34 10-34" />
          <path className="dm2026-discovery-card__relief-highlight" d="M33 31c10 4 20 4 31 0" />
          <path className="dm2026-discovery-card__relief-accent" d="M73 21v8M69 25h8" />
        </>
      ) : null}

      {id === 'doctors' ? (
        <>
          <path className="dm2026-discovery-card__relief-shadow" d="M28 24v21c0 13 19 13 19 0V24M47 45c1 18 26 22 35 7" />
          <path className="dm2026-discovery-card__relief-line dm2026-discovery-card__relief-line--stethoscope" d="M28 22v21c0 13 19 13 19 0V22M47 43c1 18 26 22 35 7" />
          <circle className="dm2026-discovery-card__relief-fill" cx="82" cy="48" r="6" />
          <path className="dm2026-discovery-card__relief-accent" d="M21 70h16l5-10 7 18 7-12h22" />
          <path className="dm2026-discovery-card__relief-highlight" d="M23 29h10M42 29h10M74 48h16" />
        </>
      ) : null}

      {id === 'labs' ? (
        <>
          <path className="dm2026-discovery-card__relief-shadow" d="M35 22h26M43 22v28L31 72c-3 5 1 9 6 9h28c5 0 9-4 6-9L55 50V22" />
          <path className="dm2026-discovery-card__relief-line" d="M35 20h26M43 20v28L31 70c-3 5 1 9 6 9h28c5 0 9-4 6-9L55 48V20" />
          <path className="dm2026-discovery-card__relief-fill" d="M36 64c8 4 19-3 30 2l3 8H33Z" />
          <path className="dm2026-discovery-card__relief-highlight" d="M42 32h17M39 70c8 3 18 2 27 0" />
          <path className="dm2026-discovery-card__relief-accent" d="M73 27a3 3 0 1 0 0 .1M81 40a4 4 0 1 0 0 .1M75 30l5 8" />
        </>
      ) : null}

      {id === 'pet' ? (
        <>
          <path className="dm2026-discovery-card__relief-shadow" d="M35 58c3-9 17-9 20 0 3 8-3 15-10 15S32 66 35 58Z" />
          <path className="dm2026-discovery-card__relief-fill" d="M35 56c3-9 17-9 20 0 3 8-3 15-10 15S32 64 35 56Z" />
          <circle className="dm2026-discovery-card__relief-dot" cx="33" cy="41" r="5" />
          <circle className="dm2026-discovery-card__relief-dot" cx="46" cy="34" r="5" />
          <circle className="dm2026-discovery-card__relief-dot" cx="59" cy="41" r="5" />
          <path className="dm2026-discovery-card__relief-accent" d="M73 33v19M64 42.5h18" />
          <path className="dm2026-discovery-card__relief-highlight" d="M38 57c5-4 10-4 15 0" />
        </>
      ) : null}

      {id === 'hospitals' ? (
        <>
          <path className="dm2026-discovery-card__relief-shadow" d="M28 78V34h40v44M39 78V55h18v23M48 42v17M40 50.5h16M35 34V24h26v10" />
          <path className="dm2026-discovery-card__relief-line" d="M28 76V32h40v44M39 76V53h18v23M48 40v17M40 48.5h16M35 32V22h26v10" />
          <path className="dm2026-discovery-card__relief-fill" d="M31 76h34" />
          <path className="dm2026-discovery-card__relief-accent" d="M25 26c7-7 16-10 28-9 10 1 18 6 23 13" />
          <path className="dm2026-discovery-card__relief-highlight" d="M35 40h26M35 66h10M58 66h10" />
        </>
      ) : null}
    </svg>
  );
}

export function HomeDiscoveryCategories2026({ locale, country, dir }: HomeDiscoveryCategories2026Props) {
  const copy = discoveryCopy[locale];

  return (
    <section className="dm2026-discovery-categories" dir={dir} aria-labelledby="dm2026-discovery-categories-title" data-country={country}>
      <div className="dm2026-container">
        <div className="dm2026-discovery-categories__module dm2026-glass">
          <span className="dm2026-discovery-categories__glow dm2026-discovery-categories__glow--teal" aria-hidden="true" />
          <span className="dm2026-discovery-categories__glow dm2026-discovery-categories__glow--gold" aria-hidden="true" />

          <header className="dm2026-discovery-categories__header">
            <span className="dm2026-badge dm2026-discovery-categories__badge">{copy.cta}</span>
            <div>
              <h2 id="dm2026-discovery-categories-title">{copy.title}</h2>
              <p>{copy.subtitle}</p>
            </div>
          </header>

          <div className="dm2026-discovery-categories__grid" aria-label={copy.ariaLabel}>
            {discoveryCards.map((card) => {
              const variant = card.size === 'large' ? 'hero' : 'secondary';
              const className = `dm2026-discovery-card dm2026-discovery-card--${variant} dm2026-discovery-card--${card.size} dm2026-discovery-card--${card.id} dm2026-card-glass`;
              const content = (
                <>
                  <span className="dm2026-discovery-card__visual" aria-hidden="true">
                    <span className="dm2026-discovery-card__visual-plate">
                      <EmbossedSymbol id={card.id} />
                    </span>
                  </span>
                  <span className="dm2026-discovery-card__copy">
                    <strong>{card.title[locale]}</strong>
                    <span>{card.description[locale]}</span>
                  </span>
                  <span className="dm2026-discovery-card__cta">{copy.cta}</span>
                </>
              );

              if (card.routeSlug) {
                return (
                  <Link key={card.id} className={className} data-card-variant={variant} href={publicDiscoveryRoute(locale, country, card.routeSlug)}>
                    {content}
                  </Link>
                );
              }

              return (
                <article key={card.id} className={className} data-card-variant={variant}>
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
