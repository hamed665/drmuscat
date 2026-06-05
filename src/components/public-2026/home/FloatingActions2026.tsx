'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import type { Home2026Copy } from '@/components/public-2026/home/HomeCopy2026';
import type { SupportedCountry, SupportedLocale } from '@/lib/i18n/config';
import { localeDirection } from '@/lib/i18n/config';
import {
  publicArticlesRoute,
  publicDiscoveryRoute,
  publicListYourCenterRoute,
} from '@/lib/routes/public';

type FloatingActions2026Props = {
  locale: SupportedLocale;
  country?: SupportedCountry;
  copy: Home2026Copy['floating'];
};

type OpenPanel = 'ai' | 'whatsapp' | null;

const dockCopy = {
  en: {
    whatsappShort: 'Support',
    whatsapp: 'WhatsApp support',
    ai: 'Ask DrMuscat',
    aiTitle: 'AI assistant preview',
    aiIntro:
      'This is a frontend-only concierge shell for healthcare discovery. It does not provide medical advice, diagnosis, emergency guidance, or AI-generated answers.',
    searchLabel: 'What would you like to explore?',
    searchPlaceholder: 'Doctors, clinics, areas, guides…',
    soon: 'DrMuscat support WhatsApp will be connected soon.',
    close: 'Close support preview',
    openMenu: 'Open DrMuscat support actions',
    actions: [
      { label: 'Find a doctor', route: 'doctors' as const },
      { label: 'Search clinics', route: 'centers' as const },
      { label: 'Explore pharmacies', route: 'pharmacies' as const },
      { label: 'Read health guides', route: 'articles' as const },
      { label: 'List my center', route: 'list-your-center' as const },
    ],
    disclaimer: 'General discovery support only — not medical advice. Confirm details directly with providers.',
  },
  ar: {
    whatsappShort: 'الدعم',
    whatsapp: 'دعم واتساب',
    ai: 'اسأل دكتور مسقط',
    aiTitle: 'معاينة مساعد الذكاء',
    aiIntro:
      'هذه واجهة أمامية فقط لمساعد الاكتشاف الصحي. لا تقدم نصيحة طبية أو تشخيصاً أو إرشاداً للطوارئ أو إجابات ذكاء اصطناعي فعلية.',
    searchLabel: 'ماذا تريد أن تستكشف؟',
    searchPlaceholder: 'أطباء، عيادات، مناطق، أدلة…',
    soon: 'سيتم ربط دعم واتساب الخاص بدكتور مسقط قريباً.',
    close: 'إغلاق معاينة الدعم',
    openMenu: 'فتح خيارات دعم دكتور مسقط',
    actions: [
      { label: 'ابحث عن طبيب', route: 'doctors' as const },
      { label: 'ابحث عن عيادات', route: 'centers' as const },
      { label: 'استكشف الصيدليات', route: 'pharmacies' as const },
      { label: 'اقرأ الأدلة الصحية', route: 'articles' as const },
      { label: 'أدرج مركزي', route: 'list-your-center' as const },
    ],
    disclaimer: 'مساعدة عامة للاكتشاف فقط — ليست نصيحة طبية. يرجى تأكيد التفاصيل مباشرة مع مقدمي الخدمة.',
  },
} as const;

function supportActionHref(
  locale: SupportedLocale,
  country: SupportedCountry,
  route: (typeof dockCopy.en.actions)[number]['route'],
) {
  if (route === 'articles') return publicArticlesRoute(locale, country);
  if (route === 'list-your-center') return publicListYourCenterRoute(locale, country);
  return publicDiscoveryRoute(locale, country, route);
}

export function FloatingActions2026({
  locale,
  country = 'om',
  copy,
}: FloatingActions2026Props) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [feedback, setFeedback] = useState('');
  const dir = localeDirection(locale);
  const text = dockCopy[locale];
  const sideClass = dir === 'rtl' ? 'left-3 sm:left-5' : 'right-3 sm:right-5';
  const labelledBy = openPanel === 'ai' ? 'dm2026-support-ai-title' : 'dm2026-support-whatsapp-title';

  const safeActions = useMemo(
    () => text.actions.map((action) => ({ ...action, href: supportActionHref(locale, country, action.route) })),
    [country, locale, text.actions],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenPanel(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function openWhatsAppPreview() {
    setFeedback(text.soon);
    setOpenPanel('whatsapp');
  }

  return (
    <div className={`dm2026-floating fixed z-40 ${sideClass}`} dir={dir} data-state={openPanel ? 'open' : 'closed'}>
      {openPanel ? (
        <section
          className="dm2026-floating-panel dm2026-glass-panel"
          aria-modal="false"
          role="dialog"
          aria-labelledby={labelledBy}
        >
          <button
            type="button"
            className="dm2026-floating-close"
            onClick={() => setOpenPanel(null)}
            aria-label={text.close}
          >
            ×
          </button>

          {openPanel === 'ai' ? (
            <div className="dm2026-floating-panel__content">
              <p className="dm2026-floating-kicker">{copy.ai}</p>
              <h2 id="dm2026-support-ai-title">{text.aiTitle}</h2>
              <p>{text.aiIntro}</p>
              <label className="dm2026-floating-search">
                <span>{text.searchLabel}</span>
                <input type="search" placeholder={text.searchPlaceholder} aria-label={text.searchLabel} />
              </label>
              <div className="dm2026-floating-actions" aria-label={copy.aiTitle}>
                {safeActions.map((action) => (
                  <Link key={action.route} href={action.href} className="dm2026-floating-link" onClick={() => setOpenPanel(null)}>
                    {action.label}
                  </Link>
                ))}
              </div>
              <p className="dm2026-floating-disclaimer">{text.disclaimer}</p>
            </div>
          ) : (
            <div className="dm2026-floating-panel__content">
              <p className="dm2026-floating-kicker">{copy.whatsappTitle}</p>
              <h2 id="dm2026-support-whatsapp-title">{text.whatsapp}</h2>
              <p>{feedback || text.soon}</p>
              <p className="dm2026-floating-disclaimer">{text.disclaimer}</p>
            </div>
          )}
        </section>
      ) : null}

      <div className="dm2026-floating-dock dm2026-glass-panel" aria-label={text.openMenu}>
        <button
          type="button"
          className="dm2026-floating-button dm2026-floating-button--whatsapp"
          onClick={openWhatsAppPreview}
          aria-label={text.whatsapp}
        >
          <span aria-hidden="true">☏</span>
          <span className="dm2026-floating-label">{text.whatsapp}</span>
          <span className="dm2026-floating-label-short">{text.whatsappShort}</span>
        </button>
        <button
          type="button"
          className="dm2026-floating-button dm2026-floating-button--ai"
          onClick={() => setOpenPanel(openPanel === 'ai' ? null : 'ai')}
          aria-expanded={openPanel === 'ai'}
          aria-label={text.ai}
        >
          <span aria-hidden="true">✦</span>
          <span className="dm2026-floating-label">{text.ai}</span>
        </button>
      </div>
    </div>
  );
}
