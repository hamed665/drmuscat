'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { SupportedCountry, SupportedLocale } from '@/lib/i18n/config';
import { localeDirection } from '@/lib/i18n/config';
import { publicDiscoveryRoute } from '@/lib/routes/public';
import type { Home2026Copy } from '@/components/public-2026/home/HomeCopy2026';
import { SectionHeader2026 } from '@/components/public-2026/ui/SectionHeader2026';

type FeaturedCentersCarousel2026Props = {
  locale: SupportedLocale;
  country: SupportedCountry;
  copy: Home2026Copy['carousel'];
  actions: Home2026Copy['actions'];
};

export function FeaturedCentersCarousel2026({ locale, country, copy, actions }: FeaturedCentersCarousel2026Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const dir = localeDirection(locale);
  const providers = copy.providers;
  const activeProvider = providers[activeIndex] ?? providers[0]!;
  const previewProviders = useMemo(
    () => [1, 2, 3].map((offset) => providers[(activeIndex + offset) % providers.length]!),
    [activeIndex, providers]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isPaused || reducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % providers.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [isPaused, providers.length, reducedMotion]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + providers.length) % providers.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % providers.length);
  };

  return (
    <section
      className="dm2026-carousel py-9 sm:py-11"
      aria-labelledby="dm2026-carousel-title"
      aria-roledescription="carousel"
      aria-label={copy.pauseLabel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      dir={dir}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <SectionHeader2026 id="dm2026-carousel-title" eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
        <div className="flex gap-2 lg:justify-end">
          <button type="button" onClick={goToPrevious} className="dm2026-carousel-control" aria-label={copy.previous}>
            {dir === 'rtl' ? '›' : '‹'}
          </button>
          <button type="button" onClick={goToNext} className="dm2026-carousel-control" aria-label={copy.next}>
            {dir === 'rtl' ? '‹' : '›'}
          </button>
        </div>
      </div>

      <div className="dm2026-carousel-stage mt-7">
        <article className="dm2026-carousel-card dm2026-carousel-card--active" aria-live="polite">
          <div className="dm2026-carousel-card__cover dm2026-carousel-card__cover--active">
            <span>{copy.sampleLabel}</span>
          </div>
          <div className="dm2026-carousel-card__body">
            <div>
              <p className="dm2026-carousel-category">{activeProvider.category}</p>
              <h3>{activeProvider.name}</h3>
              <p className="dm2026-carousel-location">{activeProvider.location}</p>
              <p className="dm2026-carousel-hours">{activeProvider.hours}</p>
              <p className="dm2026-carousel-description">{activeProvider.description}</p>
            </div>
            <div className="dm2026-carousel-actions" aria-label={activeProvider.name}>
              <Link href={publicDiscoveryRoute(locale, country, activeProvider.route)} className="dm2026-carousel-action dm2026-carousel-action--profile">
                {actions.viewProfile}
              </Link>
              <button type="button" className="dm2026-carousel-action dm2026-carousel-action--whatsapp" aria-label={`${actions.whatsapp} — ${activeProvider.name}`}>
                {actions.whatsapp}
              </button>
              <button type="button" className="dm2026-carousel-action" aria-label={`${actions.call} — ${activeProvider.name}`}>
                {actions.call}
              </button>
              <button type="button" className="dm2026-carousel-action" aria-label={`${actions.directions} — ${activeProvider.name}`}>
                {actions.directions}
              </button>
            </div>
          </div>
        </article>

        <div className="dm2026-carousel-preview-list" aria-label={copy.pauseLabel}>
          {previewProviders.map((provider, index) => {
            const providerIndex = (activeIndex + index + 1) % providers.length;
            return (
              <button key={`${provider.name}-${providerIndex}`} type="button" className="dm2026-carousel-preview" onClick={() => setActiveIndex(providerIndex)}>
                <span>{provider.category}</span>
                <strong>{provider.name}</strong>
                <small>{provider.location}</small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label={copy.pauseLabel}>
        {providers.map((provider, index) => (
          <button
            key={provider.name}
            type="button"
            className={`dm2026-carousel-dot${index === activeIndex ? ' dm2026-carousel-dot--active' : ''}`}
            aria-label={`${copy.sampleLabel}: ${provider.name}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
