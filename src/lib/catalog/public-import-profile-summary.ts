export type PublicImportProfileSummaryInput = {
  entityType: string;
  name: string;
  nameAr: string | null;
  area: string | null;
  wilayat: string | null;
  governorate: string | null;
  primarySpecialty?: string | null;
  services: string[];
  departments: string[];
  languages: string[];
  lastCheckedAt: string | null;
};

type PublicImportProfileLocale = 'en' | 'ar';

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function preferredName(locale: PublicImportProfileLocale, profile: PublicImportProfileSummaryInput): string {
  return locale === 'ar' && profile.nameAr ? profile.nameAr : profile.name;
}

function entityLabel(locale: PublicImportProfileLocale, entityType: string): string {
  if (locale === 'ar') {
    if (entityType === 'doctor') return 'طبيب';
    if (entityType === 'pharmacy') return 'صيدلية';
    if (entityType === 'hospital') return 'مستشفى';
    return 'ملف صحي عام';
  }

  if (entityType === 'doctor') return 'doctor';
  if (entityType === 'pharmacy') return 'pharmacy';
  if (entityType === 'hospital') return 'hospital';
  return 'public healthcare profile';
}

function locationLine(locale: PublicImportProfileLocale, profile: PublicImportProfileSummaryInput): string {
  return [profile.area, profile.wilayat, profile.governorate].filter(Boolean).join(', ') || (locale === 'ar' ? 'عُمان' : 'Oman');
}

function uniqueNonEmpty(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => (typeof value === 'string' ? normalizeText(value) : ''))
        .filter((value) => value.length > 0),
    ),
  );
}

function listPreview(locale: PublicImportProfileLocale, values: string[], max = 3): string | null {
  const names = values.slice(0, max);
  if (names.length === 0) return null;
  if (names.length === 1) return names[0] ?? null;
  const lastName = names[names.length - 1];
  if (!lastName) return null;
  if (locale === 'ar') return names.join(' و ');
  return `${names.slice(0, -1).join(', ')} and ${lastName}`;
}

export function buildPublicImportProfileMetaDescription(summary: string): string {
  const normalizedSummary = normalizeText(summary);
  if (normalizedSummary.length <= 155) return normalizedSummary;
  return `${normalizedSummary.slice(0, 152).trim()}...`;
}

export function buildPublicImportProfileSummary(
  locale: PublicImportProfileLocale,
  profile: PublicImportProfileSummaryInput,
): string {
  const name = preferredName(locale, profile);
  const label = entityLabel(locale, profile.entityType);
  const location = locationLine(locale, profile);
  const signals = uniqueNonEmpty([profile.primarySpecialty, ...profile.services, ...profile.departments]);
  const signalPreview = listPreview(locale, signals);
  const languagePreview = listPreview(locale, uniqueNonEmpty(profile.languages), 2);

  const sentences =
    locale === 'ar'
      ? [
          `${name} مدرج كملف ${label} عام في ${location}.`,
          signalPreview ? `تشمل إشارات الدليل العامة المرتبطة ${signalPreview} عند توفرها في بيانات DrKhaleej المعتمدة.` : null,
          languagePreview ? `تتضمن اللغات المدرجة ${languagePreview} عند توفرها.` : null,
          'تستخدم هذه الصفحة بيانات استيراد عامة تمت مراجعتها للاكتشاف، وينبغي تأكيد التفاصيل الحالية مباشرة مع مقدم الخدمة.',
        ]
      : [
          `${name} is listed as a public ${label} profile in ${location}.`,
          signalPreview ? `Reviewed public directory signals include ${signalPreview} when available in approved DrKhaleej import data.` : null,
          languagePreview ? `Listed languages include ${languagePreview} when available.` : null,
          'This page uses reviewed public import data for discovery, and current details should be confirmed directly with the provider.',
        ];

  return sentences.filter((sentence): sentence is string => Boolean(sentence)).join(' ');
}
