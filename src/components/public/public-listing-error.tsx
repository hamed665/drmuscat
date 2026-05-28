import type { PublicCatalogLocale } from '@/lib/catalog/public-types';

type PublicListingErrorProps = {
  locale: PublicCatalogLocale;
};

export function PublicListingError({ locale }: PublicListingErrorProps) {
  return (
    <section className="public-listing-error" role="alert">
      <p>{locale === 'ar' ? 'تعذر تحميل هذه القائمة حالياً.' : 'We could not load this listing right now.'}</p>
    </section>
  );
}
