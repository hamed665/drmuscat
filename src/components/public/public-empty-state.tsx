import type { PublicCatalogLocale } from '@/lib/catalog/public-types';

type PublicEmptyStateProps = {
  locale: PublicCatalogLocale;
};

export function PublicEmptyState({ locale }: PublicEmptyStateProps) {
  return (
    <section className="public-empty-state" role="status" aria-live="polite">
      <p>{locale === 'ar' ? 'لا توجد قوائم عامة متاحة بعد.' : 'No public listings are available yet.'}</p>
    </section>
  );
}
