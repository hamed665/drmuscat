import Link from 'next/link';
import type { SupportedCountry, SupportedLocale } from '@/lib/i18n/config';
import { publicDiscoveryRoute } from '@/lib/routes/public';

type HomeCategories2026Props = {
  locale: SupportedLocale;
  country: SupportedCountry;
  dir: 'ltr' | 'rtl';
};

type CategoryKey = 'doctors' | 'centers' | 'hospitals' | 'pharmacies' | 'labs' | 'services' | 'beauty' | 'pets';

const copy: Record<SupportedLocale, {
  eyebrow: string;
  title: string;
  subtitle: string;
  comingSoon: string;
  cards: readonly { key: CategoryKey; label: string; description: string }[];
}> = {
  en: {
    eyebrow: 'Discovery categories',
    title: 'Browse premium public discovery paths',
    subtitle: 'Approved route families are linked. Future category ideas are shown as planned previews only.',
    comingSoon: 'Planned preview',
    cards: [
      { key: 'doctors', label: 'Doctors', description: 'Explore doctor discovery pages by public route.' },
      { key: 'centers', label: 'Clinics / Centers', description: 'Browse clinic and center discovery paths.' },
      { key: 'hospitals', label: 'Hospitals', description: 'Hospital discovery is planned for a later approved route phase.' },
      { key: 'pharmacies', label: 'Pharmacies', description: 'Open the approved pharmacy discovery path.' },
      { key: 'labs', label: 'Labs', description: 'Explore laboratory discovery without availability claims.' },
      { key: 'services', label: 'Services', description: 'Browse service-first public discovery.' },
      { key: 'beauty', label: 'Beauty / Wellness', description: 'Planned category preview for future approved discovery.' },
      { key: 'pets', label: 'Pet Clinics', description: 'Planned category preview for future approved discovery.' }
    ]
  },
  ar: {
    eyebrow: 'فئات الاكتشاف',
    title: 'تصفح مسارات اكتشاف عامة بتصميم مميز',
    subtitle: 'المسارات المعتمدة فقط تحتوي روابط. تظهر أفكار الفئات المستقبلية كمعاينات مخططة فقط.',
    comingSoon: 'معاينة مخططة',
    cards: [
      { key: 'doctors', label: 'الأطباء', description: 'استكشف صفحات اكتشاف الأطباء عبر المسار العام المعتمد.' },
      { key: 'centers', label: 'العيادات / المراكز', description: 'تصفح مسارات اكتشاف العيادات والمراكز.' },
      { key: 'hospitals', label: 'المستشفيات', description: 'اكتشاف المستشفيات مخطط لمرحلة مسارات معتمدة لاحقة.' },
      { key: 'pharmacies', label: 'الصيدليات', description: 'افتح مسار اكتشاف الصيدليات المعتمد.' },
      { key: 'labs', label: 'المختبرات', description: 'استكشف اكتشاف المختبرات دون ادعاءات توفر.' },
      { key: 'services', label: 'الخدمات', description: 'تصفح الاكتشاف العام حسب الخدمة.' },
      { key: 'beauty', label: 'الجمال / الرفاهية', description: 'معاينة فئة مخططة لاكتشاف مستقبلي معتمد.' },
      { key: 'pets', label: 'عيادات بيطرية', description: 'معاينة فئة مخططة لاكتشاف مستقبلي معتمد.' }
    ]
  }
};

const routeKeyByCategory: Partial<Record<CategoryKey, 'doctors' | 'centers' | 'pharmacies' | 'labs' | 'services'>> = {
  doctors: 'doctors',
  centers: 'centers',
  pharmacies: 'pharmacies',
  labs: 'labs',
  services: 'services'
};

export function HomeCategories2026({ locale, country, dir }: HomeCategories2026Props) {
  const sectionCopy = copy[locale];

  return (
    <section className="dm2026-home-section" dir={dir} aria-labelledby="dm2026-home-categories-title">
      <div className="dm2026-home-section__head">
        <span className="dm2026-badge">{sectionCopy.eyebrow}</span>
        <h2 id="dm2026-home-categories-title">{sectionCopy.title}</h2>
        <p>{sectionCopy.subtitle}</p>
      </div>
      <div className="dm2026-home-card-grid dm2026-home-card-grid--categories">
        {sectionCopy.cards.map((card) => {
          const routeKey = routeKeyByCategory[card.key];
          const content = (
            <>
              <span className="dm2026-home-card__icon" aria-hidden="true" />
              <span className="dm2026-home-card__topline">
                <h3>{card.label}</h3>
                {!routeKey ? <span className="dm2026-home-preview-label">{sectionCopy.comingSoon}</span> : null}
              </span>
              <p>{card.description}</p>
            </>
          );

          if (!routeKey) {
            return (
              <article key={card.key} className="dm2026-home-card dm2026-card-soft" aria-label={`${card.label} ${sectionCopy.comingSoon}`}>
                {content}
              </article>
            );
          }

          return (
            <Link key={card.key} href={publicDiscoveryRoute(locale, country, routeKey)} className="dm2026-home-card dm2026-card-soft">
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
