import type {
  PublicCatalogLocale,
  PublicCenterSummary,
  PublicDoctorSummary,
  PublicServiceSummary
} from '@/lib/catalog/public-types';
import { PublicListingCard } from '@/components/public/public-listing-card';

type PublicListingGridProps =
  | {
      locale: PublicCatalogLocale;
      variant: 'center';
      items: PublicCenterSummary[];
    }
  | {
      locale: PublicCatalogLocale;
      variant: 'doctor';
      items: PublicDoctorSummary[];
    }
  | {
      locale: PublicCatalogLocale;
      variant: 'service';
      items: PublicServiceSummary[];
    };

export function PublicListingGrid(props: PublicListingGridProps) {
  return (
    <section className="public-listing-grid-section" aria-label="Public listings">
      <ul className="public-listing-grid" role="list">
        {props.variant === 'center'
          ? props.items.map((item) => (
              <li key={item.id} className="public-listing-grid__item">
                <PublicListingCard locale={props.locale} variant="center" item={item} />
              </li>
            ))
          : null}
        {props.variant === 'doctor'
          ? props.items.map((item) => (
              <li key={item.id} className="public-listing-grid__item">
                <PublicListingCard locale={props.locale} variant="doctor" item={item} />
              </li>
            ))
          : null}
        {props.variant === 'service'
          ? props.items.map((item) => (
              <li key={item.id} className="public-listing-grid__item">
                <PublicListingCard locale={props.locale} variant="service" item={item} />
              </li>
            ))
          : null}
      </ul>
    </section>
  );
}
