import type { SupportedLocale } from '@/lib/i18n/config';

type HomeFeaturedProviders2026Props = {
  locale: SupportedLocale;
  dir: 'ltr' | 'rtl';
};

const copy = {
  en: {
    eyebrow: 'Profile previews',
    title: 'Featured provider spaces prepared for reviewed public profiles',
    subtitle: 'Placeholder cards only. No provider names, ratings, review counts or availability claims are shown here.',
    sponsor: 'Sponsored placement preview',
    cards: [
      { title: 'Provider profile preview', description: 'A reviewed public profile card can appear here in a future approved content phase.' },
      { title: 'Clinic profile preview', description: 'Clinic visibility can be prepared after public profile review and approval.' },
      { title: 'Lab profile preview', description: 'Laboratory profile previews stay generic until approved public data exists.' },
      { title: 'Pharmacy profile preview', description: 'Pharmacy visibility remains a placeholder without live availability claims.' }
    ]
  },
  ar: {
    eyebrow: 'معاينات الملفات',
    title: 'مساحات مميزة جاهزة لملفات عامة بعد المراجعة',
    subtitle: 'بطاقات معاينة فقط. لا توجد أسماء مقدّمين أو تقييمات أو أعداد مراجعات أو ادعاءات توفر.',
    sponsor: 'معاينة موضع إعلاني مدفوع',
    cards: [
      { title: 'معاينة ملف مقدّم خدمة', description: 'يمكن أن تظهر بطاقة ملف عام بعد مراجعة المحتوى واعتماده في مرحلة لاحقة.' },
      { title: 'معاينة ملف عيادة', description: 'يمكن تجهيز ظهور العيادة بعد مراجعة الملف العام واعتماده.' },
      { title: 'معاينة ملف مختبر', description: 'تبقى معاينات المختبرات عامة حتى تتوفر بيانات عامة معتمدة.' },
      { title: 'معاينة ملف صيدلية', description: 'يبقى ظهور الصيدلية معاينة دون ادعاءات توفر مباشرة.' }
    ]
  }
} as const;

export function HomeFeaturedProviders2026({ locale, dir }: HomeFeaturedProviders2026Props) {
  const sectionCopy = copy[locale];

  return (
    <section className="dm2026-home-section" dir={dir} aria-labelledby="dm2026-home-featured-title">
      <div className="dm2026-home-section__head dm2026-home-section__head--split">
        <div>
          <span className="dm2026-badge">{sectionCopy.eyebrow}</span>
          <h2 id="dm2026-home-featured-title">{sectionCopy.title}</h2>
          <p>{sectionCopy.subtitle}</p>
        </div>
        <span className="dm2026-home-sponsored-note">{sectionCopy.sponsor}</span>
      </div>
      <div className="dm2026-home-rail dm2026-home-rail--wide">
        {sectionCopy.cards.map((card) => (
          <article key={card.title} className="dm2026-home-provider-preview dm2026-card-glass">
            <span className="dm2026-home-provider-preview__media" aria-hidden="true" />
            <div>
              <span className="dm2026-home-preview-label">{sectionCopy.sponsor}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
