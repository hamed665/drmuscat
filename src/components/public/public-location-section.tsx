import type { ReactNode } from 'react';

import {
  formatPublicLocationGeoLine,
  formatPublicLocationName,
  getPublicDirectionsUrl
} from '@/lib/catalog/public-location';
import type { PublicCatalogLocale, PublicProviderLocationSummary } from '@/lib/catalog/public-types';

import { PublicCenterDetailSection } from './public-center-detail-section';

type PublicLocationSectionProps = {
  locale: PublicCatalogLocale;
  title: string;
  description: string;
  locations: PublicProviderLocationSummary[];
  emptyLabel: string;
  directionsLabel?: string;
  directionsAriaLabel?: (locationLabel: string) => string;
  renderLocationMeta?: (location: PublicProviderLocationSummary) => ReactNode;
  renderLocationActions?: (location: PublicProviderLocationSummary) => ReactNode;
};

export function PublicLocationSection({
  locale,
  title,
  description,
  locations,
  emptyLabel,
  directionsLabel,
  directionsAriaLabel,
  renderLocationMeta,
  renderLocationActions
}: PublicLocationSectionProps) {
  return (
    <PublicCenterDetailSection title={title} description={description}>
      {locations.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2" role="list">
          {locations.map((location) => {
            const locationName = formatPublicLocationName(locale, location);
            const geoLine = formatPublicLocationGeoLine(locale, location);
            const locationLabel = locationName ?? geoLine ?? emptyLabel;
            const directionsUrl = getPublicDirectionsUrl(location);

            return (
              <li key={location.id} className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
                {locationName ? <h3 className="text-sm font-semibold leading-6 text-slate-950">{locationName}</h3> : null}
                <p className={locationName ? 'mt-2 text-sm leading-6 text-slate-600' : 'text-sm leading-6 text-slate-600'}>
                  {geoLine ?? emptyLabel}
                </p>
                {renderLocationActions ? <div className="mt-4">{renderLocationActions(location)}</div> : null}
                {directionsLabel && directionsUrl ? (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={directionsAriaLabel ? directionsAriaLabel(locationLabel) : directionsLabel}
                    className={(renderLocationActions ? 'mt-3' : 'mt-4') + ' inline-flex w-fit rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'}
                  >
                    {directionsLabel}
                  </a>
                ) : null}
                {renderLocationMeta ? <div className="mt-3">{renderLocationMeta(location)}</div> : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm leading-6 text-slate-600">{emptyLabel}</p>
      )}
    </PublicCenterDetailSection>
  );
}
