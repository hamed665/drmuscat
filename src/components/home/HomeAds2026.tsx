import type { SupportedLocale } from '@/lib/i18n/config';

type HomeAds2026Props = {
  locale: SupportedLocale;
  dir: 'ltr' | 'rtl';
};

const copy = {
  en: {
    eyebrow: 'DrMuscat Spotlight',
    title: 'Premium sponsored visibility preview for reviewed providers',
    subtitle: 'Sponsored visibility is paid placement, not quality ranking.',
    note: 'Premium UI shell only — no prices, billing, wallet, checkout or ad backend is implemented.',
    railLabel: 'Featured placement carousel',
    placements: [
      {
        title: 'Homepage Featured Placement',
        description: 'Premium visibility for reviewed providers on the DrMuscat homepage.'
      },
      {
        title: 'Category Featured',
        description: 'Appear inside relevant discovery categories after approval.'
      },
      {
        title: 'Area Featured',
        description: 'Promote reviewed providers around Muscat area discovery.'
      },
      {
        title: 'Offers Spotlight',
        description: 'Show approved offers and packages clearly after review.'
      },
      {
        title: 'Article Sponsored Placement',
        description: 'Connect educational guides with reviewed provider visibility.'
      }
    ]
  },
  ar: {
    eyebrow: 'DrMuscat Spotlight',
    title: 'معاينة ظهور مموّل مميز للمقدّمين بعد المراجعة',
    subtitle: 'الظهور المموّل مساحة مدفوعة وليس ترتيباً لجودة الخدمة.',
    note: 'غلاف واجهة مميز فقط — لا توجد أسعار أو فوترة أو محفظة أو دفع أو نظام إعلانات خلفي.',
    railLabel: 'دوّار مواضع الظهور المميزة',
    placements: [
      {
        title: 'ظهور مميز في الصفحة الرئيسية',
        description: 'مساحة ظهور مميزة للمقدّمين بعد المراجعة.'
      },
      {
        title: 'تمييز داخل الفئات',
        description: 'ظهور داخل فئات الاكتشاف المناسبة بعد الاعتماد.'
      },
      {
        title: 'تمييز حسب المنطقة',
        description: 'إبراز مقدّمين معتمدين ضمن مناطق مسقط.'
      },
      {
        title: 'إبراز العروض',
        description: 'عرض العروض والباقات المعتمدة بوضوح بعد المراجعة.'
      },
      {
        title: 'ظهور داخل المقالات',
        description: 'ربط الأدلة التعليمية بمساحات ظهور للمقدّمين بعد المراجعة.'
      }
    ]
  }
} as const;

export function HomeAds2026({ locale, dir }: HomeAds2026Props) {
  const sectionCopy = copy[locale];

  return (
    <section className="dm2026-home-section dm2026-home-spotlight" dir={dir} aria-labelledby="dm2026-home-ads-title">
      <div className="dm2026-home-spotlight__shell dm2026-card-glass">
        <div className="dm2026-home-spotlight__copy">
          <span className="dm2026-badge">{sectionCopy.eyebrow}</span>
          <h2 id="dm2026-home-ads-title">{sectionCopy.title}</h2>
          <p>{sectionCopy.subtitle}</p>
          <small>{sectionCopy.note}</small>
        </div>
        <div className="dm2026-home-spotlight__stage" aria-label={sectionCopy.railLabel}>
          <div className="dm2026-home-spotlight__orb" aria-hidden="true" />
          <div className="dm2026-home-spotlight__track">
            {sectionCopy.placements.map((placement, index) => (
              <article key={placement.title} className="dm2026-home-spotlight-card" style={{ '--dm2026-spotlight-index': index } as React.CSSProperties}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{placement.title}</h3>
                <p>{placement.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
