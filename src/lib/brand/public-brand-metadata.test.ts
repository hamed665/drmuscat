import type { Metadata } from 'next';
import { describe, expect, it } from 'vitest';

import { normalizePublicBrandMetadata } from './public-brand-metadata';

describe('normalizePublicBrandMetadata', () => {
  it('keeps DrKhaleej copy unchanged across public metadata fields', () => {
    const metadata: Metadata = {
      title: 'DrKhaleej provider onboarding',
      description: 'DrKhaleej discovery copy.',
      openGraph: {
        title: 'DrKhaleej public profile',
        description: 'DrKhaleej public discovery',
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title: 'DrKhaleej profile card',
        description: 'DrKhaleej social preview'
      }
    };

    const normalized = normalizePublicBrandMetadata(metadata);

    expect(normalized.title).toBe('DrKhaleej provider onboarding');
    expect(normalized.description).toBe('DrKhaleej discovery copy.');
    expect(normalized.openGraph?.title).toBe('DrKhaleej public profile');
    expect(normalized.openGraph?.description).toBe('DrKhaleej public discovery');
    expect(normalized.twitter?.title).toBe('DrKhaleej profile card');
    expect(normalized.twitter?.description).toBe('DrKhaleej social preview');
  });

  it('keeps DrKhaleej title template metadata fields unchanged', () => {
    const metadata: Metadata = {
      title: {
        default: 'DrKhaleej default title',
        template: '%s | DrKhaleej',
        absolute: 'DrKhaleej absolute title'
      }
    };

    const normalized = normalizePublicBrandMetadata(metadata);

    expect(normalized.title).toEqual({
      default: 'DrKhaleej default title',
      template: '%s | DrKhaleej',
      absolute: 'DrKhaleej absolute title'
    });
  });
});
