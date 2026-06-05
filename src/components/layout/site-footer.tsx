import Link from 'next/link';
import { headers } from 'next/headers';
import { Container } from '@/components/ui/container';
import { isSupportedLocale, localeDirection, SupportedLocale } from '@/lib/i18n/config';
import { homeRoute, publicDiscoveryRoute, publicProviderRoute } from '@/lib/routes/public';

type FooterItem = {
  label: string;
  href?: string;
};

const footerCopy: Record<
  SupportedLocale,
  {
    tagline: string;
    navLabel: string;
    platformLabel: string;
    plannedLabel: string;
    utility: string;
    switchLabel: string;
    available: {
      forProviders: string;
      doctors: string;
      centers: string;
      pharmacies: string;
      labs: string;
      services: string;
    };
    planned: {
      about: string;
      offers: string;
      articles: string;
      ads: string;
      privacy: string;
      terms: string;
      contact: string;
    };
  }
> = {
  en: {
    tagline: 'Premium public healthcare discovery for Oman — built in English and Arabic.',
    navLabel: 'Footer public navigation',
    platformLabel: 'Explore',
    plannedLabel: 'Planned pages',
    utility: 'Public discovery only. Confirm details directly with providers. Not medical advice.',
    switchLabel: 'Switch language to Arabic',
    available: {
      forProviders: 'For Providers',
      doctors: 'Doctors',
      centers: 'Centers',
      pharmacies: 'Pharmacies',
      labs: 'Labs',
      services: 'Services'
    },
    planned: {
      about: 'About',
      offers: 'Offers',
      articles: 'Articles',
      ads: 'Ads',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact'
    }
  },
  ar: {
    tagline: 'اكتشاف عام مميز للرعاية الصحية في عُمان — بالعربية والإنجليزية.',
    navLabel: 'تنقل التذييل العام',
    platformLabel: 'استكشف',
    plannedLabel: 'صفحات مخططة',
    utility: 'اكتشاف عام فقط. يرجى تأكيد التفاصيل مباشرة مع مقدّمي الخدمة. ليست نصيحة طبية.',
    switchLabel: 'تبديل اللغة إلى الإنجليزية',
    available: {
      forProviders: 'للمقدّمين',
      doctors: 'الأطباء',
      centers: 'المراكز',
      pharmacies: 'الصيدليات',
      labs: 'المختبرات',
      services: 'الخدمات'
    },
    planned: {
      about: 'عن DrMuscat',
      offers: 'العروض',
      articles: 'المقالات',
      ads: 'الإعلانات',
      privacy: 'الخصوصية',
      terms: 'الشروط',
      contact: 'التواصل'
    }
  }
};

export async function SiteFooter() {
  const localeHeader = (await headers()).get('x-drmuscat-locale');
  const safeLocale: SupportedLocale = localeHeader && isSupportedLocale(localeHeader) ? localeHeader : 'en';
  const copy = footerCopy[safeLocale];
  const dir = localeDirection(safeLocale);
  const homeHref = homeRoute(safeLocale, 'om');
  const switchHref = homeRoute(safeLocale === 'en' ? 'ar' : 'en', 'om');
  const availableItems: FooterItem[] = [
    { href: publicProviderRoute(safeLocale, 'om'), label: copy.available.forProviders },
    { href: publicDiscoveryRoute(safeLocale, 'om', 'doctors'), label: copy.available.doctors },
    { href: publicDiscoveryRoute(safeLocale, 'om', 'centers'), label: copy.available.centers },
    { href: publicDiscoveryRoute(safeLocale, 'om', 'pharmacies'), label: copy.available.pharmacies },
    { href: publicDiscoveryRoute(safeLocale, 'om', 'labs'), label: copy.available.labs },
    { href: publicDiscoveryRoute(safeLocale, 'om', 'services'), label: copy.available.services }
  ];
  const plannedItems = [
    copy.planned.about,
    copy.planned.offers,
    copy.planned.articles,
    copy.planned.ads,
    copy.planned.privacy,
    copy.planned.terms,
    copy.planned.contact
  ];

  return (
    <footer className="site-footer site-footer--premium dm2026-site-footer" role="contentinfo" dir={dir}>
      <Container className="site-footer__inner dm2026-site-footer__inner">
        <div className="site-footer__brand dm2026-site-footer__brand">
          <strong>DrMuscat</strong>
          <p>{copy.tagline}</p>
        </div>
        <nav className="site-footer__links dm2026-site-footer__links" aria-label={copy.navLabel}>
          <h2>{copy.platformLabel}</h2>
          <ul>
            {availableItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href ?? homeHref}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="dm2026-site-footer__planned" aria-label={copy.plannedLabel}>
          <h2>{copy.plannedLabel}</h2>
          <ul>
            {plannedItems.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-footer__utility dm2026-site-footer__utility">
          <p>{copy.utility}</p>
          <Link href={switchHref} className="site-footer__locale-switch" hrefLang={safeLocale === 'en' ? 'ar' : 'en'}>
            {safeLocale === 'en' ? 'العربية' : 'English'}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
