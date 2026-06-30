import { describe, expect, it } from 'vitest';

import { isPublicProfileIndexEligible } from './public-profile-index-eligibility';
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
  descriptionEn: null,
  descriptionAr: null,
  shortDescriptionEn: null,
  shortDescriptionAr: null,
  defaultCountry: 'om',
  verificationStatus: 'verified',
  licenseInfo: null,
  location: alKhuwairLocation,
  locations: [alKhuwairLocation],
  services: [
    {
      id: 'service_1',
      slug: 'prescription-refills',
      nameEn: 'Prescription refills',
      nameAr: 'إعادة صرف الوصفات',
      descriptionEn: null,
      descriptionAr: null,
      requiresMedicalDisclaimer: true,
    },
  ],
  doctors: [
    {
      id: 'doctor_1',
      slug: 'sara-ahmed',
      fullNameEn: 'Dr. Sara Ahmed',
      fullNameAr: 'د. سارة أحمد',
      titleEn: 'specialist',
      titleAr: 'specialist',
      gender: 'female',
      defaultCountry: 'om',
    },
  ],
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
  bioEn: null,
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
  services: [
    {
      id: 'service_2',
      slug: 'skin-consultation',
      nameEn: 'Skin consultation',
      nameAr: 'استشارة جلدية',
      descriptionEn: null,
      descriptionAr: null,
      requiresMedicalDisclaimer: true,
    },
  ],
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

describe('public profile index eligibility', () => {
  it('marks a fact-complete center from the public eligible query chain as indexable', () => {
    const result = isPublicProfileIndexEligible(sampleCenter, {
      kind: 'center',
      fromPublicEligibleQuery: true,
    });

    expect(result).toEqual({ eligible: true, reasons: [] });
  });

  it('marks a fact-complete doctor from the public eligible query chain as indexable', () => {
    const result = isPublicProfileIndexEligible(sampleDoctor, {
      kind: 'doctor',
      fromPublicEligibleQuery: true,
    });

    expect(result).toEqual({ eligible: true, reasons: [] });
  });

  it('explains why a thin center profile is not indexable', () => {
    const thinCenter: PublicCenterDetail = {
      ...sampleCenter,
      location: null,
      locations: [],
      services: [],
      doctors: [],
    };

    const result = isPublicProfileIndexEligible(thinCenter, {
      kind: 'center',
      fromPublicEligibleQuery: true,
    });

    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain('missing_relation_signal');
  });

  it('requires public eligible query provenance before indexing', () => {
    const result = isPublicProfileIndexEligible(sampleDoctor, { kind: 'doctor' });

    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain('not_from_public_eligible_query');
  });

  it('flags unsafe public claim copy before indexing', () => {
    const unsafeDoctor: PublicDoctorDetail = {
      ...sampleDoctor,
      bioEn: 'Guaranteed treatment 24/7 with booking availability now.',
    };

    const result = isPublicProfileIndexEligible(unsafeDoctor, {
      kind: 'doctor',
      fromPublicEligibleQuery: true,
    });

    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain('unsafe_claim');
  });

  it('returns reasons for missing core facts instead of a silent boolean', () => {
    const incompleteCenter: PublicCenterDetail = {
      ...sampleCenter,
      slug: ' ',
      nameEn: ' ',
      nameAr: null,
      centerType: '' as PublicCenterDetail['centerType'],
      defaultCountry: '' as PublicCenterDetail['defaultCountry'],
      location: null,
      locations: [],
      services: [],
      doctors: [],
    };

    const result = isPublicProfileIndexEligible(incompleteCenter, {
      kind: 'center',
      fromPublicEligibleQuery: true,
    });

    expect(result.eligible).toBe(false);
    expect(result.reasons).toEqual(
      expect.arrayContaining([
        'missing_name',
        'missing_slug',
        'missing_country',
        'missing_entity_type',
        'missing_relation_signal',
      ]),
    );
  });
});
