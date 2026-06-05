'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { SupportedCountry, SupportedLocale } from '@/lib/i18n/config';
import { localeDirection } from '@/lib/i18n/config';
import {
  publicArticlesRoute,
  publicDiscoveryRoute,
  publicListYourCenterRoute,
} from '@/lib/routes/public';

type DrMuscatStoriesRail2026Props = {
  locale: SupportedLocale;
  country: SupportedCountry;
};

type StoryKey = 'dental' | 'beauty' | 'kids' | 'pet' | 'labs' | 'offers' | 'providers';

const storiesCopy = {
  en: {
    eyebrow: 'DrMuscat stories preview',
    title: 'Explore care journeys safely',
    description:
      'A lightweight preview shell for future DrMuscat Stories. No medical advice, analytics, persistence, or provider claims are included.',
    close: 'Close story preview',
    next: 'Next',
    previous: 'Previous',
    open: 'Open story preview',
    disclaimer: 'Discovery guidance only. Confirm details directly with providers.',
    rails: [
      { key: 'dental' as StoryKey, label: 'Dental', icon: '🦷', route: 'doctors' as const },
      { key: 'beauty' as StoryKey, label: 'Beauty', icon: '✦', route: 'centers' as const },
      { key: 'kids' as StoryKey, label: 'Kids', icon: '☼', route: 'doctors' as const },
      { key: 'pet' as StoryKey, label: 'Pet Clinic', icon: '🐾', route: 'centers' as const },
      { key: 'labs' as StoryKey, label: 'Labs', icon: '⌁', route: 'labs' as const },
      { key: 'offers' as StoryKey, label: 'Offers', icon: '◌', route: 'articles' as const },
      { key: 'providers' as StoryKey, label: 'For Providers', icon: '＋', route: 'list-your-center' as const },
    ],
    slides: [
      'Search by care need, category, city, or area.',
      'Compare approved profile information without fake ratings.',
      'Confirm services, prices, hours, and requirements directly.',
      'Continue to related guides or request listing review.',
    ],
    cta: 'Continue discovery',
  },
  ar: {
    eyebrow: 'معاينة قصص دكتور مسقط',
    title: 'استكشف مسارات الرعاية بأمان',
    description:
      'واجهة خفيفة لمعاينة قصص دكتور مسقط المستقبلية. لا تتضمن نصائح طبية أو تحليلات أو حفظ بيانات أو ادعاءات عن مقدمي الخدمة.',
    close: 'إغلاق معاينة القصة',
    next: 'التالي',
    previous: 'السابق',
    open: 'فتح معاينة القصة',
    disclaimer: 'إرشاد للاكتشاف فقط. يرجى تأكيد التفاصيل مباشرة مع مقدمي الخدمة.',
    rails: [
      { key: 'dental' as StoryKey, label: 'الأسنان', icon: '🦷', route: 'doctors' as const },
      { key: 'beauty' as StoryKey, label: 'التجميل', icon: '✦', route: 'centers' as const },
      { key: 'kids' as StoryKey, label: 'الأطفال', icon: '☼', route: 'doctors' as const },
      { key: 'pet' as StoryKey, label: 'عيادة بيطرية', icon: '🐾', route: 'centers' as const },
      { key: 'labs' as StoryKey, label: 'المختبرات', icon: '⌁', route: 'labs' as const },
      { key: 'offers' as StoryKey, label: 'العروض', icon: '◌', route: 'articles' as const },
      { key: 'providers' as StoryKey, label: 'لمقدمي الرعاية', icon: '＋', route: 'list-your-center' as const },
    ],
    slides: [
      'ابحث حسب الحاجة أو الفئة أو المدينة أو المنطقة.',
      'قارن معلومات الملفات المعتمدة دون تقييمات وهمية.',
      'أكد الخدمات والأسعار والساعات والمتطلبات مباشرة.',
      'انتقل إلى الأدلة المرتبطة أو اطلب مراجعة الإدراج.',
    ],
    cta: 'متابعة الاكتشاف',
  },
} as const;

function routeForStory(
  locale: SupportedLocale,
  country: SupportedCountry,
  route: (typeof storiesCopy.en.rails)[number]['route'],
) {
  if (route === 'articles') return publicArticlesRoute(locale, country);
  if (route === 'list-your-center') return publicListYourCenterRoute(locale, country);
  return publicDiscoveryRoute(locale, country, route);
}

export function DrMuscatStoriesRail2026({ locale, country }: DrMuscatStoriesRail2026Props) {
  const text = storiesCopy[locale];
  const [activeKey, setActiveKey] = useState<StoryKey | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeStory = text.rails.find((story) => story.key === activeKey) ?? text.rails[0];
  const dir = localeDirection(locale);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveKey(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function openStory(key: StoryKey) {
    setActiveKey(key);
    setActiveSlide(0);
  }

  function moveSlide(delta: number) {
    setActiveSlide((current) => (current + delta + text.slides.length) % text.slides.length);
  }

  return (
    <section className="dm2026-stories my-8" dir={dir} aria-labelledby="dm2026-stories-title">
      <div className="dm2026-stories__header dm2026-glass-panel">
        <div>
          <p>{text.eyebrow}</p>
          <h2 id="dm2026-stories-title">{text.title}</h2>
        </div>
        <span>{text.disclaimer}</span>
      </div>
      <div className="dm2026-stories__rail" aria-label={text.open}>
        {text.rails.map((story) => (
          <button
            key={story.key}
            type="button"
            className="dm2026-story-pill dm2026-glass-panel"
            onClick={() => openStory(story.key)}
            aria-label={`${text.open}: ${story.label}`}
          >
            <span aria-hidden="true">{story.icon}</span>
            {story.label}
          </button>
        ))}
      </div>

      {activeKey ? (
        <div className="dm2026-story-sheet" role="dialog" aria-modal="false" aria-labelledby="dm2026-story-sheet-title">
          <div className="dm2026-story-sheet__card dm2026-glass-panel">
            <button type="button" className="dm2026-story-sheet__close" onClick={() => setActiveKey(null)} aria-label={text.close}>
              ×
            </button>
            <div className="dm2026-story-sheet__progress" aria-hidden="true">
              {text.slides.map((slide, index) => (
                <span key={slide} className={index <= activeSlide ? 'is-active' : ''} />
              ))}
            </div>
            <p className="dm2026-story-sheet__eyebrow">{activeStory.label}</p>
            <h3 id="dm2026-story-sheet-title">{text.title}</h3>
            <p>{text.slides[activeSlide]}</p>
            <div className="dm2026-story-sheet__actions">
              <button type="button" onClick={() => moveSlide(-1)}>{text.previous}</button>
              <button type="button" onClick={() => moveSlide(1)}>{text.next}</button>
              <Link href={routeForStory(locale, country, activeStory.route)} onClick={() => setActiveKey(null)}>
                {text.cta}
              </Link>
            </div>
            <p className="dm2026-story-sheet__disclaimer">{text.description}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
