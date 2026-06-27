import type { Metadata } from 'next';

import { normalizePublicBrandCopy } from './public-brand-copy';

function normalizeMetadataField<T>(value: T): T {
  return typeof value === 'string' ? (normalizePublicBrandCopy(value) as T) : value;
}

export function normalizePublicBrandMetadata(metadata: Metadata): Metadata {
  return {
    ...metadata,
    title: normalizeMetadataField(metadata.title),
    description: normalizeMetadataField(metadata.description),
    openGraph: metadata.openGraph
      ? {
          ...metadata.openGraph,
          title: normalizeMetadataField(metadata.openGraph.title),
          description: normalizeMetadataField(metadata.openGraph.description)
        }
      : metadata.openGraph,
    twitter: metadata.twitter
      ? {
          ...metadata.twitter,
          title: normalizeMetadataField(metadata.twitter.title),
          description: normalizeMetadataField(metadata.twitter.description)
        }
      : metadata.twitter
  };
}
