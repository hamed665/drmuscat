import type { PublicCatalogLocale, PublicMediaImage, PublicMediaUsageKind } from './public-types';

const ALLOWED_PUBLIC_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;

const CENTER_GALLERY_ALT_TEXT: Record<PublicCatalogLocale, string> = {
  en: 'Center gallery image',
  ar: 'صورة من معرض المركز'
};

const DOCTOR_PROFILE_ALT_TEXT: Record<PublicCatalogLocale, string> = {
  en: 'Doctor profile image',
  ar: 'صورة الطبيب'
};

const HTML_LIKE_TAG_PATTERN = /<[^>]+>/;
const UNSAFE_CAPTION_PATTERN = /\b(before\s*\/?\s*after|before\s+and\s+after|guaranteed|cure|cured|miracle|best\s+result|perfect\s+result)\b/i;
const PUBLIC_MEDIA_USAGE_KINDS: PublicMediaUsageKind[] = ['logo', 'cover', 'profile', 'gallery', 'thumbnail'];

type PublicMediaEntityKind = 'center' | 'doctor';

type PublicMediaAssetInput = {
  id: string;
  public_url: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
};

export type PublicMediaInput = {
  id: string;
  usage_kind: string;
  alt_text_en: string | null;
  alt_text_ar: string | null;
  caption_en: string | null;
  caption_ar: string | null;
  is_primary: boolean;
  is_featured: boolean;
  sort_order: number;
  media_assets: PublicMediaAssetInput | PublicMediaAssetInput[] | null;
};

export function isPublicMediaUsageKind(value: string): value is PublicMediaUsageKind {
  return PUBLIC_MEDIA_USAGE_KINDS.includes(value as PublicMediaUsageKind);
}

export function isAllowedPublicImageMimeType(value: string | null): boolean {
  return typeof value === 'string' && ALLOWED_PUBLIC_IMAGE_MIME_TYPES.includes(value as (typeof ALLOWED_PUBLIC_IMAGE_MIME_TYPES)[number]);
}

export function getAllowedPublicImageMimeTypes(): readonly string[] {
  return ALLOWED_PUBLIC_IMAGE_MIME_TYPES;
}

export function getLocalizedMediaAltText(
  media: Pick<PublicMediaInput, 'alt_text_en' | 'alt_text_ar'>,
  locale: PublicCatalogLocale,
  entityKind: PublicMediaEntityKind
): string {
  const localizedAltText = locale === 'ar' ? media.alt_text_ar : media.alt_text_en;
  const fallbackAltText = locale === 'ar' ? media.alt_text_en : media.alt_text_ar;
  const altText = normalizePlainText(localizedAltText) ?? normalizePlainText(fallbackAltText);

  if (altText) return altText;
  return entityKind === 'doctor' ? DOCTOR_PROFILE_ALT_TEXT[locale] : CENTER_GALLERY_ALT_TEXT[locale];
}

export function getLocalizedMediaCaption(
  media: Pick<PublicMediaInput, 'caption_en' | 'caption_ar'>,
  locale: PublicCatalogLocale
): string | null {
  const localizedCaption = locale === 'ar' ? media.caption_ar : media.caption_en;
  const fallbackCaption = locale === 'ar' ? media.caption_en : media.caption_ar;
  const caption = normalizePlainText(localizedCaption) ?? normalizePlainText(fallbackCaption);

  if (!caption) return null;
  if (UNSAFE_CAPTION_PATTERN.test(caption)) return null;

  return caption;
}

export function buildPublicMediaImage(
  media: PublicMediaInput,
  locale: PublicCatalogLocale,
  entityKind: PublicMediaEntityKind
): PublicMediaImage | null {
  const asset = Array.isArray(media.media_assets) ? media.media_assets[0] ?? null : media.media_assets;

  if (!asset) return null;
  if (!isPublicMediaUsageKind(media.usage_kind)) return null;
  if (!asset.public_url) return null;
  if (!isAllowedPublicImageMimeType(asset.mime_type)) return null;

  return {
    id: media.id,
    url: asset.public_url,
    altText: getLocalizedMediaAltText(media, locale, entityKind),
    caption: getLocalizedMediaCaption(media, locale),
    width: asset.width,
    height: asset.height,
    usageKind: media.usage_kind,
    isPrimary: media.is_primary,
    isFeatured: media.is_featured,
    sortOrder: media.sort_order
  };
}

function normalizePlainText(value: string | null): string | null {
  if (typeof value !== 'string') return null;

  const normalized = value
    .normalize('NFKC')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.length === 0) return null;
  if (HTML_LIKE_TAG_PATTERN.test(normalized)) return null;

  return normalized.slice(0, 180);
}
