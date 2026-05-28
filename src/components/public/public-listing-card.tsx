import type {
  PublicCatalogLocale,
  PublicCenterSummary,
  PublicDoctorSummary,
  PublicServiceSummary
} from '@/lib/catalog/public-types';

type PublicListingCardProps =
  | {
      locale: PublicCatalogLocale;
      variant: 'center';
      item: PublicCenterSummary;
    }
  | {
      locale: PublicCatalogLocale;
      variant: 'doctor';
      item: PublicDoctorSummary;
    }
  | {
      locale: PublicCatalogLocale;
      variant: 'service';
      item: PublicServiceSummary;
    };

function byLocale(locale: PublicCatalogLocale, en: string, ar: string): string {
  return locale === 'ar' ? ar : en;
}

function preferredText(locale: PublicCatalogLocale, en: string | null, ar: string | null): string | null {
  if (locale === 'ar') return ar ?? en;
  return en ?? ar;
}

function formatCenterType(value: string): string {
  return value
    .split('_')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
}

export function PublicListingCard(props: PublicListingCardProps) {
  if (props.variant === 'center') {
    const name = preferredText(props.locale, props.item.nameEn, props.item.nameAr) ?? props.item.nameEn;
    const description =
      preferredText(props.locale, props.item.shortDescriptionEn, props.item.shortDescriptionAr) ??
      preferredText(props.locale, props.item.descriptionEn, props.item.descriptionAr);

    return (
      <article className="public-listing-card">
        <h3 className="public-listing-card__title">{name}</h3>
        <p className="public-listing-card__tag">{formatCenterType(props.item.centerType)}</p>
        {description ? <p className="public-listing-card__description">{description}</p> : null}
        <p className="public-listing-card__coming-soon">{byLocale(props.locale, 'Profile coming soon', 'الملف قريباً')}</p>
      </article>
    );
  }

  if (props.variant === 'doctor') {
    const name = preferredText(props.locale, props.item.fullNameEn, props.item.fullNameAr) ?? props.item.fullNameEn;

    return (
      <article className="public-listing-card">
        <h3 className="public-listing-card__title">{name}</h3>
        <p className="public-listing-card__tag">{formatCenterType(props.item.titleEn)}</p>
        <p className="public-listing-card__coming-soon">{byLocale(props.locale, 'Profile coming soon', 'الملف قريباً')}</p>
      </article>
    );
  }

  const serviceName = preferredText(props.locale, props.item.nameEn, props.item.nameAr) ?? props.item.nameEn;
  const serviceDescription = preferredText(props.locale, props.item.descriptionEn, props.item.descriptionAr);

  return (
    <article className="public-listing-card">
      <h3 className="public-listing-card__title">{serviceName}</h3>
      {serviceDescription ? <p className="public-listing-card__description">{serviceDescription}</p> : null}
      <p className="public-listing-card__coming-soon">{byLocale(props.locale, 'Profile coming soon', 'الملف قريباً')}</p>
    </article>
  );
}
