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
          <path className="dm2026-discovery-card__relief-fill" d="M30 24c6-7 14-8 21-4 7-4 15-3 21 4 11 13 4 36-7 46-7 6-10-12-17-12S38 76 31 70c-11-10-12-33-1-46Z" />
          <path className="dm2026-discovery-card__relief-line" d="M34 28c5-5 12-5 17-2 6-3 13-3 18 2M37 42c8 5 17 6 27 1" />
        </>
      ) : null}

      {id === 'beauty' ? (
        <>
          <path className="dm2026-discovery-card__relief-fill" d="M54 18c-16 7-25 22-22 38 3 15 15 24 31 26" />
          <path className="dm2026-discovery-card__relief-line" d="M61 28c10 10 11 27-2 40-4 4-9 7-15 8M40 47c8 3 17 2 25-1M43 61c7 4 15 4 23 0" />
          <path className="dm2026-discovery-card__relief-accent" d="M72 28c6 8 10 14 10 20a10 10 0 0 1-20 0c0-6 4-12 10-20Z" />
        </>
      ) : null}

      {id === 'offers' ? (
        <>
          <path className="dm2026-discovery-card__relief-fill" d="M28 26h40l12 16-32 34-32-34Z" />
          <path className="dm2026-discovery-card__relief-line" d="M28 26 38 42 48 26 58 42 68 26M16 42h64M38 42l10 34 10-34" />
          <path className="dm2026-discovery-card__relief-accent" d="M73 23v8M69 27h8" />
        </>
      ) : null}

      {id === 'doctors' ? (
        <>
          <path className="dm2026-discovery-card__relief-line" d="M31 25v20c0 12 18 12 18 0V25M49 45c2 18 27 18 29 1" />
          <circle className="dm2026-discovery-card__relief-fill" cx="78" cy="46" r="5" />
          <path className="dm2026-discovery-card__relief-accent" d="M22 67h16l5-9 7 17 7-11h24" />
        </>
      ) : null}

      {id === 'labs' ? (
        <>
          <path className="dm2026-discovery-card__relief-line" d="M35 22h26M43 22v28L31 72c-3 5 1 9 6 9h28c5 0 9-4 6-9L55 50V22" />
          <path className="dm2026-discovery-card__relief-fill" d="M36 66c8 4 19-3 30 2l3 8H33Z" />
          <path className="dm2026-discovery-card__relief-accent" d="M73 29a3 3 0 1 0 0 .1M81 42a4 4 0 1 0 0 .1M75 32l5 8" />
        </>
      ) : null}

      {id === 'pet' ? (
        <>
          <path className="dm2026-discovery-card__relief-fill" d="M35 58c3-9 17-9 20 0 3 8-3 15-10 15S32 66 35 58Z" />
          <circle className="dm2026-discovery-card__relief-dot" cx="33" cy="43" r="5" />
          <circle className="dm2026-discovery-card__relief-dot" cx="46" cy="36" r="5" />
          <circle className="dm2026-discovery-card__relief-dot" cx="59" cy="43" r="5" />
          <path className="dm2026-discovery-card__relief-accent" d="M73 35v19M64 44.5h18" />
        </>
      ) : null}

      {id === 'hospitals' ? (
        <>
          <path className="dm2026-discovery-card__relief-line" d="M28 78V34h40v44M39 78V55h18v23M48 42v17M40 50.5h16M35 34V24h26v10" />
          <path className="dm2026-discovery-card__relief-fill" d="M31 78h34" />
          <path className="dm2026-discovery-card__relief-accent" d="M25 28c7-7 16-10 28-9 10 1 18 6 23 13" />
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
