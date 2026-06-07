import Link from 'next/link';

import { SupportedCountry, SupportedLocale } from '@/lib/i18n/config';
import { publicProviderRoute } from '@/lib/routes/public';

type HomeProviderCTA2026Props = {
  locale: SupportedLocale;
  country: SupportedCountry;
  dir: 'ltr' | 'rtl';
};

type ProviderCTACopy = {
  eyebrow: string;
  heading: string;
  subtitle: string;
  valueLine: string;
  primaryCta: string;
  secondaryCta: string;
  routeNote: string;
  planNote: string;
  valuePoints: readonly string[];
  previewBadge: string;
  mediaLabel: string;
  offerStamp: string;
  centerName: string;
  centerSubtitle: string;
  chips: readonly string[];
  rating: string;
  reviewsNote: string;
  previewActions: readonly string[];
};

const providerCTACopy: Record<SupportedLocale, ProviderCTACopy> = {
  en: {
    eyebrow: 'For healthcare providers in Oman',
    heading: 'Grow your healthcare presence in Oman',
    subtitle: 'Create a reviewed DrMuscat profile with photos, services, special offers and direct contact actions.',
    valueLine: 'A premium public profile built for discovery, trust and direct enquiries.',
    primaryCta: 'List your center',
    secondaryCta: 'Explore provider options',
    routeNote: 'Provider options available after review: Basic, Growth, Premium and Enterprise.',
    planNote: 'Preview only — no prices, checkout or registration in this homepage section.',
    valuePoints: [
      'Premium profile',
      'Photos & gallery',
      'Special Offers',
      'WhatsApp, Call & Directions',
      'Arabic + English content',
      'Featured visibility preview'
    ],
    previewBadge: 'Reviewed profile preview',
    mediaLabel: 'Gallery preview',
    offerStamp: 'Special Offer',
    centerName: 'Al Khuwair Medical Center Preview',
    centerSubtitle: 'A reviewed public profile with photos, services and contact actions.',
    chips: ['Photos', 'Services', 'Special Offer', 'WhatsApp-ready'],
    rating: '4.8 sample rating',
    reviewsNote: 'Verified reviews appear after approval',
    previewActions: ['WhatsApp', 'Call', 'Directions', 'View Profile']
  },
  ar: {
    eyebrow: 'للمقدّمين الصحيين في عُمان',
    heading: 'نمِّ حضور مركزك الصحي في عُمان',
    subtitle: 'أنشئ ملفاً مراجعاً في DrMuscat مع الصور والخدمات والعروض الخاصة وإجراءات التواصل المباشر.',
    valueLine: 'ملف عام مميز يساعد على الاكتشاف والثقة والتواصل المباشر.',
    primaryCta: 'أدرج مركزك',
    secondaryCta: 'استكشف خيارات المقدّمين',
    routeNote: 'تتوفر خيارات للمقدّمين بعد المراجعة: Basic و Growth و Premium و Enterprise.',
    planNote: 'معاينة فقط — لا توجد أسعار أو دفع أو تسجيل في قسم الصفحة الرئيسية هذا.',
    valuePoints: [
      'ملف مميز',
      'الصور والمعرض',
      'العروض الخاصة',
      'واتساب واتصال واتجاهات',
      'محتوى عربي وإنجليزي',
      'معاينة الظهور المميز'
    ],
    previewBadge: 'معاينة ملف مراجع',
    mediaLabel: 'معاينة المعرض',
    offerStamp: 'عرض خاص',
    centerName: 'معاينة مركز طبي في الخوير',
    centerSubtitle: 'ملف عام مراجع مع الصور والخدمات وإجراءات التواصل.',
    chips: ['الصور', 'الخدمات', 'عرض خاص', 'جاهز للواتساب'],
    rating: 'تقييم تجريبي 4.8',
    reviewsNote: 'تظهر المراجعات الموثقة بعد الاعتماد',
    previewActions: ['واتساب', 'اتصال', 'اتجاهات', 'عرض الملف']
  }
};

export function HomeProviderCTA2026({ locale, country, dir }: HomeProviderCTA2026Props) {
  const copy = providerCTACopy[locale];
  const providerHref = publicProviderRoute(locale, country);

  return (
    <section className="dm2026-provider-cta" dir={dir} aria-labelledby="dm2026-provider-cta-title">
      <div className="dm2026-container dm2026-provider-cta__container">
        <div className="dm2026-provider-cta__surface">
          <span className="dm2026-provider-cta__glow dm2026-provider-cta__glow--teal" aria-hidden="true" />
          <span className="dm2026-provider-cta__glow dm2026-provider-cta__glow--pearl" aria-hidden="true" />

          <div className="dm2026-provider-cta__content">
            <span className="dm2026-provider-cta__eyebrow">{copy.eyebrow}</span>
            <h2 id="dm2026-provider-cta-title">{copy.heading}</h2>
            <p className="dm2026-provider-cta__subtitle">{copy.subtitle}</p>
            <p className="dm2026-provider-cta__value-line">{copy.valueLine}</p>

            <ul className="dm2026-provider-cta__value-list" aria-label={copy.valueLine}>
              {copy.valuePoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <div className="dm2026-provider-cta__actions" aria-label={copy.eyebrow}>
              <Link className="dm2026-provider-cta__button dm2026-provider-cta__button--primary" href={providerHref}>
                {copy.primaryCta}
              </Link>
              <Link className="dm2026-provider-cta__button dm2026-provider-cta__button--secondary" href={providerHref}>
                {copy.secondaryCta}
              </Link>
            </div>

            <p className="dm2026-provider-cta__route-note">{copy.routeNote}</p>
          </div>

          <aside className="dm2026-provider-cta__preview" aria-label={copy.previewBadge}>
            <div className="dm2026-provider-preview-card">
              <div className="dm2026-provider-preview-card__badge">{copy.previewBadge}</div>

              <div className="dm2026-provider-preview-card__media" aria-label={copy.mediaLabel}>
                <span className="dm2026-provider-preview-card__media-label">{copy.mediaLabel}</span>
                <span className="dm2026-provider-preview-card__media-mark" aria-hidden="true" />
                <span className="dm2026-provider-preview-card__media-line dm2026-provider-preview-card__media-line--one" aria-hidden="true" />
                <span className="dm2026-provider-preview-card__media-line dm2026-provider-preview-card__media-line--two" aria-hidden="true" />
              </div>

              <div className="dm2026-provider-preview-card__body">
                <div className="dm2026-provider-preview-card__heading-row">
                  <div>
                    <h3>{copy.centerName}</h3>
                    <p>{copy.centerSubtitle}</p>
                  </div>
                  <span className="dm2026-provider-preview-card__offer">{copy.offerStamp}</span>
                </div>

                <ul className="dm2026-provider-preview-card__chips" aria-label={copy.centerSubtitle}>
                  {copy.chips.map((chip) => (
                    <li key={chip}>{chip}</li>
                  ))}
                </ul>

                <div className="dm2026-provider-preview-card__rating">
                  <strong>{copy.rating}</strong>
                  <span>{copy.reviewsNote}</span>
                </div>

                <div className="dm2026-provider-preview-card__actions" aria-label={copy.planNote}>
                  {copy.previewActions.map((action) => (
                    <button key={action} type="button" disabled>
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
