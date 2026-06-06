import Link from 'next/link';
import type { ReactNode } from 'react';

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

function DentalScene() {
  return (
    <svg className="dm2026-discovery-card__svg" viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      <path className="dm2026-discovery-card__halo" d="M28 28c12-17 43-22 62-4 19 18 7 48-11 55-12 5-12-12-18-12s-6 17-18 12C24 72 16 45 28 28Z" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--float" d="M38 27c7-8 18-8 25-3 7-5 18-4 25 4 12 15 3 38-8 47-8 6-11-12-17-12s-9 18-17 12c-12-9-20-34-8-48Z" />
      <path className="dm2026-discovery-card__shine" d="M42 37c6-8 16-10 25-5" />
      <path className="dm2026-discovery-card__sparkle dm2026-discovery-card__sparkle--one" d="M91 19v10M86 24h10" />
      <path className="dm2026-discovery-card__sparkle dm2026-discovery-card__sparkle--two" d="M27 63v8M23 67h8" />
    </svg>
  );
}

function BeautyScene() {
  return (
    <svg className="dm2026-discovery-card__svg" viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      <path className="dm2026-discovery-card__halo" d="M29 24c15-18 53-18 67 3 14 20-3 52-28 57-31 5-53-31-39-60Z" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--draw" d="M65 18c-18 9-25 27-20 42 4 12 13 19 27 22" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--soft" d="M71 30c8 9 9 26-4 36" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--soft" d="M52 43c6 2 13 2 19-1" />
      <path className="dm2026-discovery-card__droplet" d="M89 34c7 9 11 16 11 22a11 11 0 0 1-22 0c0-6 4-13 11-22Z" />
      <path className="dm2026-discovery-card__shine" d="M82 51c3 3 8 4 12 1" />
    </svg>
  );
}

function OffersScene() {
  return (
    <svg className="dm2026-discovery-card__svg" viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      <path className="dm2026-discovery-card__halo dm2026-discovery-card__halo--gold" d="M26 23h50l21 21-42 42-42-42 13-21Z" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--gold dm2026-discovery-card__line--float" d="M31 25h43l18 18-38 38-38-38 15-18Z" />
      <circle className="dm2026-discovery-card__dot" cx="70" cy="38" r="5" />
      <path className="dm2026-discovery-card__shine dm2026-discovery-card__shine--gold" d="M34 45h48" />
      <path className="dm2026-discovery-card__sparkle dm2026-discovery-card__sparkle--gold" d="M92 24v9M87.5 28.5h9" />
    </svg>
  );
}

function DoctorsScene() {
  return (
    <svg className="dm2026-discovery-card__svg" viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      <path className="dm2026-discovery-card__halo" d="M24 34c16-16 55-18 70 2 13 18 0 44-23 51-28 8-58-28-47-53Z" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--soft" d="M35 27v22c0 13 20 13 20 0V27" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--pulse" d="M55 50c4 22 33 18 33-2" />
      <circle className="dm2026-discovery-card__dot" cx="88" cy="48" r="6" />
      <path className="dm2026-discovery-card__pulse" d="M25 71h17l5-10 8 18 7-12h28" />
    </svg>
  );
}

function LabsScene() {
  return (
    <svg className="dm2026-discovery-card__svg" viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      <path className="dm2026-discovery-card__halo" d="M29 23c17-15 53-15 68 3 17 22-8 54-34 57-28 3-56-34-34-60Z" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--float" d="M47 22h30M55 22v30L42 74c-3 5 1 10 7 10h30c6 0 10-5 7-10L69 52V22" />
      <path className="dm2026-discovery-card__fluid" d="M47 69c9 5 22-4 34 2l4 8H43Z" />
      <circle className="dm2026-discovery-card__molecule dm2026-discovery-card__molecule--one" cx="86" cy="29" r="3" />
      <circle className="dm2026-discovery-card__molecule dm2026-discovery-card__molecule--two" cx="93" cy="42" r="4" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--soft" d="M87 32l5 8" />
    </svg>
  );
}

function PetScene() {
  return (
    <svg className="dm2026-discovery-card__svg" viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      <path className="dm2026-discovery-card__halo" d="M25 31c15-19 52-21 69-2 17 19 1 51-22 58-29 9-59-29-47-56Z" />
      <path className="dm2026-discovery-card__paw" d="M45 60c3-9 17-9 21 0 3 8-3 16-11 16s-13-8-10-16Z" />
      <circle className="dm2026-discovery-card__toe dm2026-discovery-card__toe--one" cx="43" cy="45" r="5" />
      <circle className="dm2026-discovery-card__toe dm2026-discovery-card__toe--two" cx="56" cy="38" r="5" />
      <circle className="dm2026-discovery-card__toe dm2026-discovery-card__toe--three" cx="69" cy="45" r="5" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--soft" d="M88 36v20M78 46h20" />
      <path className="dm2026-discovery-card__pulse" d="M75 69h8l4-7 5 12 4-6h8" />
    </svg>
  );
}

function HospitalsScene() {
  return (
    <svg className="dm2026-discovery-card__svg" viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      <path className="dm2026-discovery-card__halo" d="M24 25c17-17 55-17 72 1 18 21-2 53-28 59-30 6-58-33-44-60Z" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--float" d="M38 82V35h44v47M49 82V57h22v25" />
      <path className="dm2026-discovery-card__line dm2026-discovery-card__line--soft" d="M60 43v18M51 52h18M45 35V24h30v11" />
      <path className="dm2026-discovery-card__beacon" d="M33 26c7-8 19-12 31-10 12 1 21 7 26 15" />
      <path className="dm2026-discovery-card__shine" d="M44 68h10M76 68h10" />
    </svg>
  );
}

const sceneById: Record<DiscoveryCardTone, ReactNode> = {
  dental: <DentalScene />,
  beauty: <BeautyScene />,
  offers: <OffersScene />,
  doctors: <DoctorsScene />,
  labs: <LabsScene />,
  pet: <PetScene />,
  hospitals: <HospitalsScene />
};

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
              const className = `dm2026-discovery-card dm2026-discovery-card--${card.size} dm2026-discovery-card--${card.id} dm2026-card-glass`;
              const content = (
                <>
                  <span className="dm2026-discovery-card__scene" aria-hidden="true">{sceneById[card.id]}</span>
                  <span className="dm2026-discovery-card__copy">
                    <strong>{card.title[locale]}</strong>
                    <span>{card.description[locale]}</span>
                  </span>
                  <span className="dm2026-discovery-card__cta">{copy.cta}</span>
                </>
              );

              if (card.routeSlug) {
                return (
                  <Link key={card.id} className={className} href={publicDiscoveryRoute(locale, country, card.routeSlug)}>
                    {content}
                  </Link>
                );
              }

              return (
                <article key={card.id} className={className}>
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
