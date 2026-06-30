import { describe, expect, it } from 'vitest';

import { buildPublicProfileCompletenessSignals } from './public-profile-completeness';
import type {
  PublicCenterDetail,
  PublicDoctorDetail,
  PublicProviderLocationSummary,
} from './public-types';

const alKhuwairLocation: PublicProviderLocationSummary = {
  id: 'loc_1',
  locationNameEn: 'Main branch',
  locationNameAr: 'الفرع الرئيسي',
  areaNameEn: 'Al Khuwair',
  areaNameAr: 'الخوير',
  cityNameEn: 'Muscat',
  cityNameAr: 'مسقط',
  countryNameEn: 'Oman',
  countryNameAr: 'عُمان',
  mapUrl: null,
  isPrimary: true,
  sortOrder: 1,
  contactActions: [],
};

const sampleCenter: PublicCenterDetail = {
  id: 'center_1',
  slug: 'al-khuwair-pharmacy',
  nameEn: 'Al Khuwair Pharmacy',
  nameAr: 'صيدلية الخوير',
  centerType: 'pharmacy',
  descriptionEn: 'Approved directory note for pharmacy discovery.',
  descriptionAr: null,
  shortDescriptionEn: null,
  shortDescriptionAr: null,
  defaultCountry: 'om',
  verificationStatus: 'verified',
  licenseInfo: null,
  location: alKhuwairLocation,
  locations: [alKhuwairLocation],
  services: [],
  doctors: [],
  contactActions: [],
  galleryImages: [],
  logoImage: null,
  coverImage: null,
};

const sampleDoctor: PublicDoctorDetail = {
  id: 'doctor_1',
  slug: 'sara-ahmed',
  fullNameEn: 'Dr. Sara Ahmed',
  fullNameAr: 'د. سارة أحمد',
  titleEn: 'consultant',
  titleAr: 'consultant',
  gender: 'female',
  defaultCountry: 'om',
  displayNameEn: 'Dr. Sara Ahmed',
  displayNameAr: 'د. سارة أحمد',
  licenseInfo: null,
  bioEn: 'Approved public directory note for discovery.',
  bioAr: null,
  profileImageUrl: null,
  profileImage: null,
  yearsExperience: 12,
  verificationStatus: 'verified',
  primarySpecialty: {
    id: 'specialty_1',
    nameEn: 'Dermatology',
    nameAr: 'الأمراض الجلدية',
    descriptionEn: null,
    descriptionAr: null,
  },
  services: [],
  practiceLocations: [
    {
      id: 'practice_1',
      center: {
        id: 'center_2',
        slug: 'muscat-skin-clinic',
        nameEn: 'Muscat Skin Clinic',
        nameAr: 'عيادة مسقط الجلدية',
        centerType: 'clinic',
        shortDescriptionEn: null,
        shortDescriptionAr: null,
        defaultCountry: 'om',
        verificationStatus: 'verified',
      },
      primarySpecialty: null,
      location: alKhuwairLocation,
      contactActions: [],
    },
  ],
};

describe('public profile completeness signals', () => {
  it('scores a center with core facts, a location signal, safety copy, and clean copy', () => {
    const completeness = buildPublicProfileCompletenessSignals(sampleCenter, { kind: 'center' });

    expect(completeness.kind).toBe('center');
    expect(completeness.hasName).toBe(true);
    expect(completeness.hasSlug).toBe(true);
    expect(completeness.hasCountry).toBe(true);
    expect(completeness.hasEntityType).toBe(true);
    expect(completeness.hasSummary).toBe(true);
    expect(completeness.hasLocationSignal).toBe(true);
    expect(completeness.hasRelationSignal).toBe(true);
    expect(completeness.hasApprovedDescription).toBe(true);
    expect(completeness.hasSafetyCopy).toBe(true);
    expect(completeness.hasUnsafeClaimFree).toBe(true);
    expect(completeness.missing).toEqual([]);
  });

  it('scores a doctor with specialty, practice relation, and location signals', () => {
    const completeness = buildPublicProfileCompletenessSignals(sampleDoctor, { kind: 'doctor' });

    expect(completeness.kind).toBe('doctor');
    expect(completeness.hasSpecialtySignal).toBe(true);
    expect(completeness.hasPracticeRelations).toBe(true);
    expect(completeness.hasLocationSignal).toBe(true);
    expect(completeness.hasRelationSignal).toBe(true);
    expect(completeness.hasApprovedDescription).toBe(true);
    expect(completeness.hasUnsafeClaimFree).toBe(true);
    expect(completeness.missing).toEqual([]);
  });

  it('reports missing relation signal for a thin center without useful links', () => {
    const thinCenter: PublicCenterDetail = {
      ...sampleCenter,
      location: null,
      locations: [],
      services: [],
      doctors: [],
    };

    const completeness = buildPublicProfileCompletenessSignals(thinCenter, { kind: 'center' });

    expect(completeness.hasRelationSignal).toBe(false);
    expect(completeness.hasLocationSignal).toBe(false);
    expect(completeness.hasServiceSignal).toBe(false);
    expect(completeness.hasPracticeRelations).toBe(false);
    expect(completeness.missing).toContain('relation_signal');
  });

  it('reports missing core facts instead of hiding the thin profile behind one score', () => {
    const incompleteDoctor: PublicDoctorDetail = {
      ...sampleDoctor,
      slug: ' ',
      displayNameEn: null,
      displayNameAr: null,
      fullNameEn: ' ',
      fullNameAr: null,
      titleEn: '' as PublicDoctorDetail['titleEn'],
      defaultCountry: '' as PublicDoctorDetail['defaultCountry'],
      primarySpecialty: null,
      services: [],
      practiceLocations: [],
    };

    const completeness = buildPublicProfileCompletenessSignals(incompleteDoctor, { kind: 'doctor' });

    expect(completeness.missing).toEqual(
      expect.arrayContaining(['name', 'slug', 'country', 'entity_type', 'relation_signal']),
    );
    expect(completeness.hasSpecialtySignal).toBe(false);
    expect(completeness.hasPracticeRelations).toBe(false);
  });

  it('flags blocked claim wording as an internal signal only', () => {
    const blockedPhrase = ['top', '-rated'].join('');
    const flaggedCenter: PublicCenterDetail = {
      ...sampleCenter,
      descriptionEn: `${blockedPhrase} public copy`,
    };

    const completeness = buildPublicProfileCompletenessSignals(flaggedCenter, { kind: 'center' });

    expect(completeness.hasUnsafeClaimFree).toBe(false);
    expect(completeness.missing).toContain('unsafe_claim_free');
  });
});
