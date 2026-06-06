'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SupportedCountry, SupportedLocale } from '@/lib/i18n/config';

type HomeFeaturedBoard2026Props = {
  locale: SupportedLocale;
  country: SupportedCountry;
  dir: 'ltr' | 'rtl';
};

type LocalizedPreview = {
  providerKind: string;
  title: string;
  subtitle: string;
  city: string;
  area: string;
  chips: readonly string[];
  visibilityContext: string;
  offerContext: readonly string[];
};

type VisibilityPreviewItem = {
  id: string;
  en: LocalizedPreview;
  ar: LocalizedPreview;
};

type FeaturedBoardCopy = {
  ariaLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  trustNote: string;
  activeLabel: string;
  profileLabel: string;
  locationLabel: string;
  visibilityLabel: string;
  offerHeading: string;
  offerKicker: string;
  offerNote: string;
  railLabel: string;
  actionsLabel: string;
  actions: readonly {
    label: string;
    symbol: string;
    tone: 'primary' | 'neutral' | 'contact' | 'whatsapp';
    aria: string;
  }[];
};

const previewInventory: readonly VisibilityPreviewItem[] = [
  {
    id: 'premium-clinic-preview',
    en: {
      providerKind: 'Provider visibility board',
      title: 'Premium Clinic Preview',
      subtitle: 'A reviewed public profile surface for an approved clinic or medical center.',
      city: 'Muscat',
      area: 'Area preview',
      chips: ['Profile actions preview', 'Public discovery only', 'Appears after approval'],
      visibilityContext: 'Homepage, area, and category visibility can be presented with sponsored context clearly marked.',
      offerContext: ['Provider-approved offer preview', 'Appears after review', 'Supports profile discovery']
    },
    ar: {
      providerKind: 'لوحة ظهور للمقدّمين',
      title: 'معاينة عيادة مميزة',
      subtitle: 'واجهة ملف عام قيد المراجعة لعيادة أو مركز طبي معتمد.',
      city: 'مسقط',
      area: 'معاينة منطقة',
      chips: ['معاينة إجراءات الملف', 'اكتشاف عام فقط', 'يظهر بعد الاعتماد'],
      visibilityContext: 'يمكن عرض الظهور في الرئيسية والمنطقة والفئة مع توضيح سياق الظهور المدعوم.',
      offerContext: ['معاينة عرض معتمد من المقدّم', 'يظهر بعد المراجعة', 'يدعم اكتشاف الملف']
    }
  },
  {
    id: 'specialist-profile-preview',
    en: {
      providerKind: 'Provider visibility board',
      title: 'Specialist Profile Preview',
      subtitle: 'A calm action-ready profile preview for an approved specialist listing.',
      city: 'Muscat',
      area: 'Specialty preview',
      chips: ['Reviewed public profile', 'Contact actions preview', 'Confirm details with provider'],
      visibilityContext: 'Specialty and area discovery can highlight approved profile actions without implying quality ranking.',
      offerContext: ['Sponsored context clearly marked', 'Profile actions after approval', 'No quality-ranking implication']
    },
    ar: {
      providerKind: 'لوحة ظهور للمقدّمين',
      title: 'معاينة ملف اختصاصي',
      subtitle: 'معاينة هادئة لملف اختصاصي معتمد وجاهز لإجراءات الملف.',
      city: 'مسقط',
      area: 'معاينة تخصص',
      chips: ['ملف عام قيد المراجعة', 'معاينة إجراءات التواصل', 'أكّد التفاصيل مع المقدّم'],
      visibilityContext: 'يمكن لإظهار التخصص والمنطقة إبراز إجراءات الملف المعتمدة بدون الإيحاء بترتيب جودة.',
      offerContext: ['توضيح سياق الظهور المدعوم', 'إجراءات الملف بعد الاعتماد', 'لا يعني ترتيباً للجودة']
    }
  },
  {
    id: 'lab-visibility-preview',
    en: {
      providerKind: 'Provider visibility board',
      title: 'Lab Visibility Preview',
      subtitle: 'A review-first discovery surface for an approved laboratory profile.',
      city: 'Muscat',
      area: 'Testing preview',
      chips: ['Lab discovery surface', 'Review-first offers', 'Public discovery only'],
      visibilityContext: 'Package and test discovery context can appear after review without prices or unsupported claims.',
      offerContext: ['Reviewed package visibility', 'Appears after review', 'Discovery context stays clear']
    },
    ar: {
      providerKind: 'لوحة ظهور للمقدّمين',
      title: 'معاينة ظهور مختبر',
      subtitle: 'واجهة اكتشاف تعتمد المراجعة أولاً لملف مختبر معتمد.',
      city: 'مسقط',
      area: 'معاينة فحوصات',
      chips: ['واجهة اكتشاف مختبر', 'العروض بعد المراجعة', 'اكتشاف عام فقط'],
      visibilityContext: 'يمكن ظهور سياق الباقات والفحوصات بعد المراجعة بدون أسعار أو ادعاءات غير مدعومة.',
      offerContext: ['ظهور باقات بعد المراجعة', 'يظهر بعد المراجعة', 'يبقى سياق الاكتشاف واضحاً']
    }
  },
  {
    id: 'pharmacy-visibility-preview',
    en: {
      providerKind: 'Provider visibility board',
      title: 'Pharmacy Visibility Preview',
      subtitle: 'A local public discovery preview for an approved pharmacy profile.',
      city: 'Muscat',
      area: 'Area preview',
      chips: ['Public pharmacy discovery', 'Actions after approval', 'Confirm details with provider'],
      visibilityContext: 'Area and category placement can support public discovery while keeping provider details review-gated.',
      offerContext: ['Approved visibility context', 'Sponsored context clearly marked', 'Supports public discovery']
    },
    ar: {
      providerKind: 'لوحة ظهور للمقدّمين',
      title: 'معاينة ظهور صيدلية',
      subtitle: 'معاينة اكتشاف عامة محلية لملف صيدلية معتمد.',
      city: 'مسقط',
      area: 'معاينة منطقة',
      chips: ['اكتشاف عام للصيدلية', 'الإجراءات بعد الاعتماد', 'أكّد التفاصيل مع المقدّم'],
      visibilityContext: 'يمكن لمواضع المنطقة والفئة دعم الاكتشاف العام مع بقاء تفاصيل المقدّم مرتبطة بالمراجعة.',
      offerContext: ['سياق ظهور معتمد', 'توضيح سياق الظهور المدعوم', 'يدعم الاكتشاف العام']
    }
  },
  {
    id: 'wellness-profile-preview',
    en: {
      providerKind: 'Provider visibility board',
      title: 'Wellness Profile Preview',
      subtitle: 'A polished profile preview for approved wellness and care services.',
      city: 'Muscat',
      area: 'Wellness preview',
      chips: ['Premium profile surface', 'Approved content only', 'Public discovery only'],
      visibilityContext: 'Wellness discovery can be presented as provider-approved public information without medical claims.',
      offerContext: ['Provider-approved offer preview', 'Appears after review', 'Supports profile discovery']
    },
    ar: {
      providerKind: 'لوحة ظهور للمقدّمين',
      title: 'معاينة ملف رفاهية',
      subtitle: 'معاينة ملف مصقولة لخدمات الرفاهية والرعاية المعتمدة.',
      city: 'مسقط',
      area: 'معاينة رفاهية',
      chips: ['واجهة ملف مميزة', 'محتوى معتمد فقط', 'اكتشاف عام فقط'],
      visibilityContext: 'يمكن عرض اكتشاف الرفاهية كمعلومات عامة معتمدة من المقدّم بدون ادعاءات طبية.',
      offerContext: ['معاينة عرض معتمد من المقدّم', 'يظهر بعد المراجعة', 'يدعم اكتشاف الملف']
    }
  },
  {
    id: 'pet-clinic-preview',
    en: {
      providerKind: 'Provider visibility board',
      title: 'Pet Clinic Preview',
      subtitle: 'A safe public discovery preview for an approved pet care provider.',
      city: 'Muscat',
      area: 'Pet care preview',
      chips: ['Pet care discovery', 'Profile actions preview', 'Confirm details with provider'],
      visibilityContext: 'Pet care providers can use the same premium visibility surface with approved public profile actions.',
      offerContext: ['Approved offer preview', 'Appears after review', 'Sponsored context clearly marked']
    },
    ar: {
      providerKind: 'لوحة ظهور للمقدّمين',
      title: 'معاينة عيادة بيطرية',
      subtitle: 'معاينة اكتشاف عامة وآمنة لمقدّم رعاية حيوانات معتمد.',
      city: 'مسقط',
      area: 'معاينة رعاية حيوانات',
      chips: ['اكتشاف رعاية الحيوانات', 'معاينة إجراءات الملف', 'أكّد التفاصيل مع المقدّم'],
      visibilityContext: 'يمكن لمقدّمي رعاية الحيوانات استخدام نفس واجهة الظهور المميزة مع إجراءات ملف عامة معتمدة.',
      offerContext: ['معاينة عرض معتمد', 'يظهر بعد المراجعة', 'توضيح سياق الظهور المدعوم']
    }
  },
  {
    id: 'dental-center-preview',
    en: {
      providerKind: 'Provider visibility board',
      title: 'Dental Center Preview',
      subtitle: 'A review-first visibility preview for an approved dental center profile.',
      city: 'Muscat',
      area: 'Dental preview',
      chips: ['Dental discovery surface', 'Reviewed profile actions', 'Public discovery only'],
      visibilityContext: 'Dental discovery can connect profile actions, area visibility, and sponsored context after approval.',
      offerContext: ['Provider-approved offer preview', 'Appears after review', 'Supports profile discovery']
    },
    ar: {
      providerKind: 'لوحة ظهور للمقدّمين',
      title: 'معاينة مركز أسنان',
      subtitle: 'معاينة ظهور تعتمد المراجعة أولاً لملف مركز أسنان معتمد.',
      city: 'مسقط',
      area: 'معاينة أسنان',
      chips: ['واجهة اكتشاف أسنان', 'إجراءات ملف قيد المراجعة', 'اكتشاف عام فقط'],
      visibilityContext: 'يمكن لاكتشاف الأسنان ربط إجراءات الملف وظهور المنطقة وسياق الظهور المدعوم بعد الاعتماد.',
      offerContext: ['معاينة عرض معتمد من المقدّم', 'يظهر بعد المراجعة', 'يدعم اكتشاف الملف']
    }
  },
  {
    id: 'medical-service-preview',
    en: {
      providerKind: 'Provider visibility board',
      title: 'Medical Service Preview',
      subtitle: 'A flexible discovery preview for approved public service pages and provider actions.',
      city: 'Muscat',
      area: 'Service preview',
      chips: ['Service discovery surface', 'Approval-gated actions', 'Confirm details with provider'],
      visibilityContext: 'Service discovery can support many future provider entries while keeping sponsored labels clear.',
      offerContext: ['Approved service visibility', 'Appears after review', 'Supports public discovery']
    },
    ar: {
      providerKind: 'لوحة ظهور للمقدّمين',
      title: 'معاينة خدمة طبية',
      subtitle: 'معاينة اكتشاف مرنة لصفحات خدمات عامة وإجراءات مقدّمين معتمدة.',
      city: 'مسقط',
      area: 'معاينة خدمة',
      chips: ['واجهة اكتشاف خدمة', 'الإجراءات بعد الاعتماد', 'أكّد التفاصيل مع المقدّم'],
      visibilityContext: 'يمكن لاكتشاف الخدمات دعم العديد من إدخالات المقدّمين المستقبلية مع وضوح وسم الظهور المدعوم.',
      offerContext: ['ظهور خدمة معتمد', 'يظهر بعد المراجعة', 'يدعم الاكتشاف العام']
    }
  }
] as const;

const featuredBoardCopy: Record<SupportedLocale, FeaturedBoardCopy> = {
  en: {
    ariaLabel: 'Premium provider visibility preview board',
    badge: 'Featured visibility preview',
    title: 'Premium visibility that matches DrMuscat discovery',
    subtitle: 'A compact preview of how approved providers can appear with profile actions, sponsored context and reviewed offer visibility.',
    trustNote: 'Sponsored visibility does not mean quality ranking. Public discovery only — confirm details with provider.',
    activeLabel: 'Active preview',
    profileLabel: 'Reviewed public profile',
    locationLabel: 'Oman visibility preview',
    visibilityLabel: 'Visibility context',
    offerHeading: 'Provider-approved offer preview',
    offerKicker: 'Monetization surface',
    offerNote: 'Offers and profile actions appear only after provider review and approval.',
    railLabel: 'Flexible rotating inventory previews',
    actionsLabel: 'Profile actions preview',
    actions: [
      { label: 'View Profile', symbol: '↗', tone: 'primary', aria: 'Preview action. Provider profile appears after provider approval.' },
      { label: 'Directions', symbol: '⌖', tone: 'neutral', aria: 'Preview action. Directions appear after provider approval.' },
      { label: 'Call', symbol: '◌', tone: 'contact', aria: 'Preview action. Call action appears after provider approval.' },
      { label: 'WhatsApp', symbol: '◍', tone: 'whatsapp', aria: 'Preview action. WhatsApp action appears after provider approval.' }
    ]
  },
  ar: {
    ariaLabel: 'لوحة معاينة الظهور المميز للمقدّمين',
    badge: 'معاينة الظهور المميز',
    title: 'ظهور مميز ينسجم مع اكتشاف DrMuscat',
    subtitle: 'معاينة مدمجة لكيفية ظهور المقدّمين المعتمدين مع إجراءات الملف وسياق الظهور المدعوم والعروض بعد المراجعة.',
    trustNote: 'الظهور المدعوم لا يعني ترتيباً للجودة. اكتشاف عام فقط — أكّد التفاصيل مع مقدّم الخدمة.',
    activeLabel: 'المعاينة النشطة',
    profileLabel: 'ملف عام قيد المراجعة',
    locationLabel: 'معاينة ظهور لعُمان',
    visibilityLabel: 'سياق الظهور',
    offerHeading: 'معاينة عرض معتمد من المقدّم',
    offerKicker: 'واجهة قيمة تجارية',
    offerNote: 'تظهر العروض وإجراءات الملف فقط بعد مراجعة واعتماد مقدّم الخدمة.',
    railLabel: 'معاينات مخزون ظهور مرنة ومتتابعة',
    actionsLabel: 'معاينة إجراءات الملف',
    actions: [
      { label: 'عرض الملف', symbol: '↗', tone: 'primary', aria: 'إجراء معاينة. يظهر ملف مقدّم الخدمة بعد الاعتماد.' },
      { label: 'الاتجاهات', symbol: '⌖', tone: 'neutral', aria: 'إجراء معاينة. تظهر الاتجاهات بعد اعتماد مقدّم الخدمة.' },
      { label: 'اتصال', symbol: '◌', tone: 'contact', aria: 'إجراء معاينة. يظهر إجراء الاتصال بعد اعتماد مقدّم الخدمة.' },
      { label: 'واتساب', symbol: '◍', tone: 'whatsapp', aria: 'إجراء معاينة. يظهر إجراء واتساب بعد اعتماد مقدّم الخدمة.' }
    ]
  }
};

export function HomeFeaturedBoard2026({ locale, country, dir }: HomeFeaturedBoard2026Props) {
  const copy = featuredBoardCopy[locale];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeEntry = previewInventory[activeIndex] ?? previewInventory[0]!;
  const activePreview = activeEntry[locale];

  useEffect(() => {
    if (isPaused) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const rotationTimer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % previewInventory.length);
    }, 5200);

    return () => window.clearInterval(rotationTimer);
  }, [isPaused]);

  const pauseHandlers = useMemo(
    () => ({
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => setIsPaused(false),
      onFocus: () => setIsPaused(true),
      onBlur: () => setIsPaused(false)
    }),
    []
  );

  return (
    <section className="dm2026-featured-board" dir={dir} aria-label={copy.ariaLabel} data-country={country} {...pauseHandlers}>
      <div className="dm2026-container">
        <div className="dm2026-featured-board__module dm2026-glass">
          <span className="dm2026-featured-board__glow dm2026-featured-board__glow--primary" aria-hidden="true" />
          <span className="dm2026-featured-board__glow dm2026-featured-board__glow--accent" aria-hidden="true" />

          <header className="dm2026-featured-board__header">
            <div className="dm2026-featured-board__title-block">
              <span className="dm2026-badge dm2026-featured-board__badge">{copy.badge}</span>
              <div>
                <p className="dm2026-featured-board__kicker">{activePreview.providerKind}</p>
                <h2>{copy.title}</h2>
              </div>
            </div>
            <p className="dm2026-featured-board__subtitle">{copy.subtitle}</p>
            <p className="dm2026-featured-board__trust">{copy.trustNote}</p>
          </header>

          <div className="dm2026-featured-board__grid">
            <article className="dm2026-featured-board__profile dm2026-card-glass" aria-labelledby="dm2026-featured-profile-title">
              <div className="dm2026-featured-board__profile-head">
                <div className="dm2026-featured-board__mark" aria-hidden="true">
                  <span />
                </div>
                <div className="dm2026-featured-board__profile-copy">
                  <p>{copy.profileLabel}</p>
                  <h3 id="dm2026-featured-profile-title">{activePreview.title}</h3>
                  <span>{activePreview.subtitle}</span>
                </div>
                <span className="dm2026-featured-board__active-badge" aria-label={`${copy.activeLabel}: ${activePreview.title}`}>
                  {copy.activeLabel}
                </span>
              </div>

              <div className="dm2026-featured-board__meta" aria-label={copy.locationLabel}>
                <span>{activePreview.city}</span>
                <span>{activePreview.area}</span>
              </div>

              <div className="dm2026-featured-board__chips" aria-label={copy.visibilityLabel}>
                {activePreview.chips.map((chip) => (
                  <span key={chip}>{chip}</span>
                ))}
              </div>

              <p className="dm2026-featured-board__visibility-copy">{activePreview.visibilityContext}</p>

              <div className="dm2026-featured-board__actions" aria-label={copy.actionsLabel}>
                {copy.actions.map((action) => (
                  <button
                    key={action.label}
                    className={`dm2026-button dm2026-featured-board__action dm2026-featured-board__action--${action.tone}`}
                    type="button"
                    aria-label={action.aria}
                    title={action.aria}
                  >
                    <span className="dm2026-featured-board__action-symbol" aria-hidden="true">
                      {action.symbol}
                    </span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </article>

            <aside className="dm2026-featured-board__offer dm2026-card-soft" aria-labelledby="dm2026-featured-offer-title">
              <div className="dm2026-featured-board__offer-head">
                <span className="dm2026-badge">{copy.offerKicker}</span>
                <span aria-hidden="true">✦</span>
              </div>
              <h3 id="dm2026-featured-offer-title">{copy.offerHeading}</h3>
              <ul>
                {activePreview.offerContext.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>{copy.offerNote}</p>
            </aside>

            <div className="dm2026-featured-board__rail" aria-label={copy.railLabel}>
              {previewInventory.map((entry, index) => {
                const preview = entry[locale];
                const isActive = index === activeIndex;

                return (
                  <button
                    key={entry.id}
                    className="dm2026-featured-board__slot"
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className="dm2026-featured-board__slot-dot" aria-hidden="true" />
                    <span>
                      <strong>{preview.title}</strong>
                      <small>{preview.area}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
