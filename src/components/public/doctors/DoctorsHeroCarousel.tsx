'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { SupportedLocale } from '@/lib/i18n/config';

type DoctorsHeroCarouselProps = {
  locale: SupportedLocale;
  dir: 'ltr' | 'rtl';
};

const carouselCopy = {
  en: {
    label: 'Doctor discovery image gallery',
    previous: 'Previous image',
    next: 'Next image',
    slideLabel: 'Show image',
    slides: [
      {
        src: '/images/home/provider-cta-healthcare-platform-preview.jpg',
        alt: 'Healthcare environment with clinical equipment and care pathways',
        caption: 'Doctor discovery across clinics and care paths'
      },
      {
        src: '/images/home/provider-cta-healthcare-platform-preview.webp',
        alt: 'Premium healthcare platform visual for provider discovery',
        caption: 'Search specialties, clinics and areas in Oman'
      },
      {
        src: '/images/home/provider-cta-healthcare-platform-preview-mobile.webp',
        alt: 'Mobile-ready healthcare discovery visual',
        caption: 'Public discovery only, not medical advice'
      }
    ]
  },
  ar: {
    label: 'معرض صور اكتشاف الأطباء',
    previous: 'الصورة السابقة',
    next: 'الصورة التالية',
    slideLabel: 'عرض الصورة',
    slides: [
      {
        src: '/images/home/provider-cta-healthcare-platform-preview.jpg',
        alt: 'بيئة رعاية صحية مع معدات سريرية ومسارات رعاية',
        caption: 'اكتشاف الأطباء عبر العيادات ومسارات الرعاية'
      },
      {
        src: '/images/home/provider-cta-healthcare-platform-preview.webp',
        alt: 'واجهة رعاية صحية مميزة لاكتشاف مقدمي الخدمة',
        caption: 'ابحث عن التخصصات والعيادات والمناطق في عُمان'
      },
      {
        src: '/images/home/provider-cta-healthcare-platform-preview-mobile.webp',
        alt: 'صورة اكتشاف صحي مناسبة للجوال',
        caption: 'اكتشاف عام فقط وليس نصيحة طبية'
      }
    ]
  }
} as const;

export function DoctorsHeroCarousel({ locale, dir }: DoctorsHeroCarouselProps) {
  const copy = carouselCopy[locale];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = copy.slides[activeIndex] ?? copy.slides[0];

  const goToPrevious = () => setActiveIndex((current) => (current === 0 ? copy.slides.length - 1 : current - 1));
  const goToNext = () => setActiveIndex((current) => (current + 1) % copy.slides.length);

  return (
    <aside className="dm2026-doctors-carousel" dir={dir} aria-label={copy.label}>
      <div className="dm2026-doctors-carousel__media">
        <Image
          key={activeSlide.src}
          src={activeSlide.src}
          alt={activeSlide.alt}
          width={1180}
          height={856}
          sizes="(max-width: 900px) 100vw, 38vw"
          priority
        />
        <div className="dm2026-doctors-carousel__caption">
          <span>{activeSlide.caption}</span>
        </div>
      </div>

      <div className="dm2026-doctors-carousel__controls">
        <button type="button" className="dm2026-doctors-carousel__arrow" onClick={goToPrevious} aria-label={copy.previous}>‹</button>
        <div className="dm2026-doctors-carousel__dots" aria-label={copy.label}>
          {copy.slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className="dm2026-doctors-carousel__dot"
              aria-label={`${copy.slideLabel} ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button type="button" className="dm2026-doctors-carousel__arrow" onClick={goToNext} aria-label={copy.next}>›</button>
      </div>
    </aside>
  );
}
