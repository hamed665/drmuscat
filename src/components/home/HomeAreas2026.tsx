import Link from 'next/link';
import type { SupportedCountry, SupportedLocale } from '@/lib/i18n/config';
import { publicDiscoveryRoute } from '@/lib/routes/public';

type HomeAreas2026Props = {
  locale: SupportedLocale;
  country: SupportedCountry;
  dir: 'ltr' | 'rtl';
};

const copy = {
  en: {
    eyebrow: 'Muscat areas',
    title: 'Explore familiar Muscat and Oman area prompts',
    subtitle: 'Area prompts are public discovery examples only and do not imply provider counts or coverage.',
    cta: 'Open search',
    areas: ['Al Khuwair', 'Qurum', 'Azaiba', 'Al Ghubra', 'Ruwi', 'Seeb', 'Bawshar', 'Madinat Sultan Qaboos', 'Al Hail', 'Al Mawaleh']
  },
  ar: {
    eyebrow: 'مناطق مسقط',
    title: 'استكشف إشارات مناطق مألوفة في مسقط وعُمان',
    subtitle: 'إشارات المناطق أمثلة اكتشاف عامة فقط ولا تعني أعداد مقدّمين أو تغطية مباشرة.',
    cta: 'افتح البحث',
    areas: ['الخوير', 'القرم', 'العذيبة', 'الغبرة', 'روي', 'السيب', 'بوشر', 'مدينة السلطان قابوس', 'الحيل', 'الموالح']
  }
} as const;

export function HomeAreas2026({ locale, country, dir }: HomeAreas2026Props) {
  const sectionCopy = copy[locale];
  const searchHref = publicDiscoveryRoute(locale, country, 'search');

  return (
    <section className="dm2026-home-section dm2026-home-areas-2026" dir={dir} aria-labelledby="dm2026-home-areas-title">
      <div className="dm2026-home-section__head dm2026-home-section__head--split">
        <div>
          <span className="dm2026-badge">{sectionCopy.eyebrow}</span>
          <h2 id="dm2026-home-areas-title">{sectionCopy.title}</h2>
          <p>{sectionCopy.subtitle}</p>
        </div>
        <Link href={searchHref} className="dm2026-button dm2026-button-secondary">{sectionCopy.cta}</Link>
      </div>
      <div className="dm2026-home-area-cloud">
        {sectionCopy.areas.map((area) => (
          <Link key={area} href={searchHref} className="dm2026-home-area-chip">
            {area}
          </Link>
        ))}
      </div>
    </section>
  );
}
