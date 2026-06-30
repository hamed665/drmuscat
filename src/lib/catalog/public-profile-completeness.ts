import {
  buildPublicCenterProfileSummary,
  buildPublicDoctorProfileSummary,
} from './public-profile-summary';
import type {
  PublicCatalogLocale,
  PublicCenterDetail,
  PublicDoctorDetail,
} from './public-types';

export type PublicProfileCompletenessKind = 'center' | 'doctor';

export type PublicProfileCompletenessMissingSignal =
  | 'name'
  | 'slug'
  | 'country'
  | 'entity_type'
  | 'summary'
  | 'relation_signal'
  | 'safety_copy'
  | 'unsafe_claim_free';

export type PublicProfileCompletenessSignals = {
  kind: PublicProfileCompletenessKind;
  hasName: boolean;
  hasSlug: boolean;
  hasCountry: boolean;
  hasEntityType: boolean;
  hasSummary: boolean;
  hasLocationSignal: boolean;
  hasServiceSignal: boolean;
  hasPracticeRelations: boolean;
  hasSpecialtySignal: boolean;
  hasApprovedDescription: boolean;
  hasRelationSignal: boolean;
  hasSafetyCopy: boolean;
  hasUnsafeClaimFree: boolean;
  score: number;
  maxScore: number;
  percentage: number;
  missing: PublicProfileCompletenessMissingSignal[];
};

export type PublicProfileCompletenessContext = {
  kind: PublicProfileCompletenessKind;
  locale?: PublicCatalogLocale;
};

type PublicProfileCompletenessProfile = PublicCenterDetail | PublicDoctorDetail;

const completenessWeights = {
  hasName: 10,
  hasSlug: 10,
  hasCountry: 10,
  hasEntityType: 10,
  hasSummary: 15,
  hasRelationSignal: 15,
  hasSafetyCopy: 15,
  hasUnsafeClaimFree: 15,
  hasApprovedDescription: 5,
  hasLocationSignal: 5,
  hasServiceSignal: 5,
  hasPracticeRelations: 5,
  hasSpecialtySignal: 5,
} as const satisfies Record<keyof Omit<PublicProfileCompletenessSignals, 'kind' | 'score' | 'maxScore' | 'percentage' | 'missing'>, number>;

const unsafeClaimPhrases = [
  'top-rated',
  'guaranteed',
  'trusted by thousands',
  'insurance accepted',
  'moh approved',
  'verified by moh',
  '24/7',
  'emergency availability',
  'booking guarantee',
  'available now',
  'open now',
  'book now',
] as const;

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeText(value: string): string {
  return value.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

function firstNonEmptyText(values: Array<string | null | undefined>): string | null {
  return values.find(hasText) ?? null;
}

function hasSafetyCopy(summary: string): boolean {
  const normalizedSummary = normalizeText(summary);
  return (
    normalizedSummary.includes('confirmed directly with the provider') ||
    normalizedSummary.includes('current details should be confirmed directly with the provider') ||
    normalizedSummary.includes('تأكيد التفاصيل الحالية مباشرة مع مقدم الخدمة')
  );
}

function containsUnsafeClaim(values: Array<string | null | undefined>): boolean {
  const searchableText = values.filter(hasText).map(normalizeText).join(' ');
  if (!searchableText) return false;

  return unsafeClaimPhrases.some((claim) => searchableText.includes(claim));
}

function centerClaimTexts(center: PublicCenterDetail, summary: string): Array<string | null | undefined> {
  return [
    summary,
    center.descriptionEn,
    center.descriptionAr,
    center.shortDescriptionEn,
    center.shortDescriptionAr,
    ...center.services.flatMap((service) => [service.nameEn, service.nameAr, service.descriptionEn, service.descriptionAr]),
  ];
}

function doctorClaimTexts(doctor: PublicDoctorDetail, summary: string): Array<string | null | undefined> {
  return [
    summary,
    doctor.bioEn,
    doctor.bioAr,
    doctor.primarySpecialty?.descriptionEn,
    doctor.primarySpecialty?.descriptionAr,
    ...doctor.services.flatMap((service) => [service.nameEn, service.nameAr, service.descriptionEn, service.descriptionAr]),
    ...doctor.practiceLocations.flatMap((practiceLocation) => [
      practiceLocation.center.shortDescriptionEn,
      practiceLocation.center.shortDescriptionAr,
    ]),
  ];
}

function scoreSignals(signals: Omit<PublicProfileCompletenessSignals, 'score' | 'maxScore' | 'percentage' | 'missing'>): Pick<PublicProfileCompletenessSignals, 'score' | 'maxScore' | 'percentage'> {
  const weightedKeys = Object.keys(completenessWeights) as Array<keyof typeof completenessWeights>;
  const maxScore = weightedKeys.reduce((total, key) => total + completenessWeights[key], 0);
  const score = weightedKeys.reduce((total, key) => total + (signals[key] ? completenessWeights[key] : 0), 0);

  return {
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
  };
}

function missingSignals(signals: Omit<PublicProfileCompletenessSignals, 'score' | 'maxScore' | 'percentage' | 'missing'>): PublicProfileCompletenessMissingSignal[] {
  const missing: PublicProfileCompletenessMissingSignal[] = [];
  if (!signals.hasName) missing.push('name');
  if (!signals.hasSlug) missing.push('slug');
  if (!signals.hasCountry) missing.push('country');
  if (!signals.hasEntityType) missing.push('entity_type');
  if (!signals.hasSummary) missing.push('summary');
  if (!signals.hasRelationSignal) missing.push('relation_signal');
  if (!signals.hasSafetyCopy) missing.push('safety_copy');
  if (!signals.hasUnsafeClaimFree) missing.push('unsafe_claim_free');
  return missing;
}

function buildCenterSignals(center: PublicCenterDetail, locale: PublicCatalogLocale): PublicProfileCompletenessSignals {
  const summary = buildPublicCenterProfileSummary(locale, center);
  const baseSignals = {
    kind: 'center' as const,
    hasName: firstNonEmptyText([center.nameEn, center.nameAr]) !== null,
    hasSlug: hasText(center.slug),
    hasCountry: hasText(center.defaultCountry),
    hasEntityType: hasText(center.centerType),
    hasSummary: hasText(summary),
    hasLocationSignal: center.location !== null || center.locations.length > 0,
    hasServiceSignal: center.services.length > 0,
    hasPracticeRelations: center.doctors.length > 0,
    hasSpecialtySignal: false,
    hasApprovedDescription: firstNonEmptyText([center.shortDescriptionEn, center.shortDescriptionAr, center.descriptionEn, center.descriptionAr]) !== null,
    hasRelationSignal: center.location !== null || center.locations.length > 0 || center.services.length > 0 || center.doctors.length > 0,
    hasSafetyCopy: hasSafetyCopy(summary),
    hasUnsafeClaimFree: !containsUnsafeClaim(centerClaimTexts(center, summary)),
  };
  const score = scoreSignals(baseSignals);

  return {
    ...baseSignals,
    ...score,
    missing: missingSignals(baseSignals),
  };
}

function buildDoctorSignals(doctor: PublicDoctorDetail, locale: PublicCatalogLocale): PublicProfileCompletenessSignals {
  const summary = buildPublicDoctorProfileSummary(locale, doctor);
  const baseSignals = {
    kind: 'doctor' as const,
    hasName: firstNonEmptyText([doctor.displayNameEn, doctor.displayNameAr, doctor.fullNameEn, doctor.fullNameAr]) !== null,
    hasSlug: hasText(doctor.slug),
    hasCountry: hasText(doctor.defaultCountry),
    hasEntityType: hasText(doctor.titleEn),
    hasSummary: hasText(summary),
    hasLocationSignal: doctor.practiceLocations.some((practiceLocation) => practiceLocation.location !== null),
    hasServiceSignal: doctor.services.length > 0,
    hasPracticeRelations: doctor.practiceLocations.length > 0,
    hasSpecialtySignal: doctor.primarySpecialty !== null,
    hasApprovedDescription: firstNonEmptyText([doctor.bioEn, doctor.bioAr]) !== null,
    hasRelationSignal: doctor.primarySpecialty !== null || doctor.services.length > 0 || doctor.practiceLocations.length > 0,
    hasSafetyCopy: hasSafetyCopy(summary),
    hasUnsafeClaimFree: !containsUnsafeClaim(doctorClaimTexts(doctor, summary)),
  };
  const score = scoreSignals(baseSignals);

  return {
    ...baseSignals,
    ...score,
    missing: missingSignals(baseSignals),
  };
}

export function buildPublicProfileCompletenessSignals(
  profile: PublicProfileCompletenessProfile,
  context: PublicProfileCompletenessContext,
): PublicProfileCompletenessSignals {
  const locale = context.locale ?? 'en';
  if (context.kind === 'center') return buildCenterSignals(profile as PublicCenterDetail, locale);
  return buildDoctorSignals(profile as PublicDoctorDetail, locale);
}
