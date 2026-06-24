import type { Metadata } from 'next';

import type { OmanGeoMetadataEntity, OmanGeoMetadataItem } from '@/lib/seo/geo-route-metadata';
import { buildOmanGeoNoindexMetadata } from '@/lib/seo/geo-route-metadata';
import { getOmanGeoPublicationGates } from '@/lib/geo/oman-publication-gates';
import { getOmanGeoReadiness } from '@/lib/geo/oman-readiness';
import type { SupportedCountry, SupportedLocale } from '@/lib/i18n/config';

export type BuildOmanGeoGatedMetadataInput = {
  locale: SupportedLocale;
  country: SupportedCountry;
  entity: OmanGeoMetadataEntity;
  item: OmanGeoMetadataItem;
  pathname: string;
  parentLabel?: string;
};

export function buildOmanGeoGatedMetadata(input: BuildOmanGeoGatedMetadataInput): Metadata {
  const readiness = getOmanGeoReadiness({
    entity: input.entity,
    slug: input.item.slug,
    locale: input.locale,
  });
  const publicationGates = getOmanGeoPublicationGates({
    entity: input.entity,
    slug: input.item.slug,
    locale: input.locale,
    readiness,
  });

  if (
    publicationGates.noindexRemovalAllowed ||
    publicationGates.sitemapPromotionAllowed ||
    publicationGates.jsonLdAllowed ||
    publicationGates.indexPromotionAllowed
  ) {
    return buildOmanGeoNoindexMetadata(input);
  }

  return buildOmanGeoNoindexMetadata(input);
}
