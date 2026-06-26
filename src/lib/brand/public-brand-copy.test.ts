import { describe, expect, it } from 'vitest';

import { normalizePublicBrandCopy } from './public-brand-copy';

describe('normalizePublicBrandCopy', () => {
  it('normalizes legacy English brand variants', () => {
    expect(normalizePublicBrandCopy('DrMuscat provider onboarding')).toBe('DrKhaleej provider onboarding');
    expect(normalizePublicBrandCopy('Dr Muscat public discovery')).toBe('DrKhaleej public discovery');
    expect(normalizePublicBrandCopy('Doctor Muscat reviewed profiles')).toBe('DrKhaleej reviewed profiles');
  });

  it('normalizes legacy Arabic and Persian brand variants', () => {
    expect(normalizePublicBrandCopy('دکتر مسقط برای پزشکان')).toBe('DrKhaleej برای پزشکان');
    expect(normalizePublicBrandCopy('دكتور مسقط للعيادات')).toBe('DrKhaleej للعيادات');
    expect(normalizePublicBrandCopy('د. مسقط للبحث العام')).toBe('DrKhaleej للبحث العام');
  });

  it('leaves current brand copy unchanged', () => {
    expect(normalizePublicBrandCopy('DrKhaleej public profile')).toBe('DrKhaleej public profile');
  });
});
