import { describe, expect, it } from 'vitest';
import type { Metadata } from 'next';

import {
  applyProfileMetadataIndexGate,
  buildProfileNoindexMetadata,
} from './profile-metadata-index-gate';

describe('profile metadata index gate', () => {
  it('keeps metadata indexable when the profile is eligible', () => {
    const metadata = {
      title: 'Eligible Profile | DrKhaleej',
      description: 'A complete public profile summary.',
    } satisfies Metadata;

    const gatedMetadata = applyProfileMetadataIndexGate(metadata, {
      eligible: true,
      reasons: [],
    });

    expect(gatedMetadata).toEqual(metadata);
  });

  it('adds noindex/follow robots metadata when the profile is not eligible', () => {
    const metadata = {
      title: 'Thin Profile | DrKhaleej',
      description: 'A thin public profile summary.',
    } satisfies Metadata;

    const gatedMetadata = applyProfileMetadataIndexGate(metadata, {
      eligible: false,
      reasons: ['missing_relation_signal'],
    });

    expect(gatedMetadata).toEqual({
      ...metadata,
      robots: { index: false, follow: true },
    });
  });

  it('builds noindex metadata without dropping existing title and description', () => {
    const metadata = {
      title: 'Fallback Profile | DrKhaleej',
      description: 'Fallback profile metadata.',
    } satisfies Metadata;

    expect(buildProfileNoindexMetadata(metadata)).toEqual({
      ...metadata,
      robots: { index: false, follow: true },
    });
  });
});
