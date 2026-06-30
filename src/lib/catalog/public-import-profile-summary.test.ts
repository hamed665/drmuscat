import { describe, expect, it } from 'vitest';

import {
  buildPublicImportProfileMetaDescription,
  buildPublicImportProfileSummary,
  type PublicImportProfileSummaryInput,
} from './public-import-profile-summary';

const blockedClaims = [
  'top-rated',
  'guaranteed',
  'trusted by thousands',
  'insurance accepted',
  'MOH approved',
  '24/7',
];

function expectNoBlockedClaims(value: string) {
  for (const claim of blockedClaims) {
    expect(value.toLowerCase()).not.toContain(claim.toLowerCase());
  }
}

const importedDoctor: PublicImportProfileSummaryInput = {
  entityType: 'doctor',
  name: 'Dr. Noura Al Balushi',
  nameAr: 'د. نورة البلوشية',
  area: 'Al Khuwair',
  wilayat: 'Bawshar',
  governorate: 'Muscat',
  primarySpecialty: 'Dermatology',
  services: ['Skin consultation'],
  departments: [],
  languages: ['Arabic', 'English'],
  lastCheckedAt: '2026-06-30T10:00:00.000Z',
};

const importedPharmacy: PublicImportProfileSummaryInput = {
  entityType: 'pharmacy',
  name: 'Al Khuwair Pharmacy',
  nameAr: 'صيدلية الخوير',
  area: 'Al Khuwair',
  wilayat: 'Bawshar',
  governorate: 'Muscat',
  services: ['Prescription support', 'Over-the-counter medicine'],
  departments: ['Pharmacy'],
  languages: ['Arabic', 'English'],
  lastCheckedAt: '2026-06-30T10:00:00.000Z',
};

const importedHospital: PublicImportProfileSummaryInput = {
  entityType: 'hospital',
  name: 'Muscat General Hospital',
  nameAr: 'مستشفى مسقط العام',
  area: 'Al Ghubrah',
  wilayat: 'Bawshar',
  governorate: 'Muscat',
  services: ['Outpatient care'],
  departments: ['Emergency department', 'Internal medicine'],
  languages: ['Arabic', 'English'],
  lastCheckedAt: '2026-06-30T10:00:00.000Z',
};

describe('public import profile summaries', () => {
  it('builds a reviewed imported doctor summary from approved source signals', () => {
    const summary = buildPublicImportProfileSummary('en', importedDoctor);

    expect(summary).toContain('Dr. Noura Al Balushi');
    expect(summary).toContain('public doctor profile');
    expect(summary).toContain('Al Khuwair');
    expect(summary).toContain('Dermatology');
    expect(summary).toContain('Listed languages include Arabic and English');
    expect(summary).toContain('reviewed public import data for discovery');
    expectNoBlockedClaims(summary);
  });

  it('builds a reviewed imported pharmacy summary with service and department signals', () => {
    const summary = buildPublicImportProfileSummary('en', importedPharmacy);

    expect(summary).toContain('Al Khuwair Pharmacy');
    expect(summary).toContain('public pharmacy profile');
    expect(summary).toContain('Prescription support');
    expect(summary).toContain('Pharmacy');
    expect(summary).toContain('confirmed directly with the provider');
    expectNoBlockedClaims(summary);
  });

  it('builds a reviewed imported hospital summary with department signals', () => {
    const summary = buildPublicImportProfileSummary('en', importedHospital);

    expect(summary).toContain('Muscat General Hospital');
    expect(summary).toContain('public hospital profile');
    expect(summary).toContain('Emergency department');
    expect(summary).toContain('Internal medicine');
    expectNoBlockedClaims(summary);
  });

  it('builds localized Arabic summaries from the same reviewed import data', () => {
    const summary = buildPublicImportProfileSummary('ar', importedPharmacy);

    expect(summary).toContain('صيدلية الخوير');
    expect(summary).toContain('صيدلية');
    expect(summary).toContain('الخوير');
    expect(summary).toContain('اللغات المدرجة');
    expectNoBlockedClaims(summary);
  });

  it('builds metadata descriptions within snippet length', () => {
    const summary = buildPublicImportProfileSummary('en', importedHospital);
    const description = buildPublicImportProfileMetaDescription(summary);

    expect(description.length).toBeLessThanOrEqual(155);
    expect(description).toContain('Muscat General Hospital');
    expectNoBlockedClaims(description);
  });
});
