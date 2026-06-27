import { normalizePublicBrandCopy } from '@/lib/brand/public-brand-copy';

export type JsonLdContext = 'https://schema.org';

type JsonLdPrimitive = string | number | boolean | null;

type JsonLdValue =
  | JsonLdPrimitive
  | JsonLdValue[]
  | {
      [key: string]: JsonLdValue;
    };

export type JsonLdBase<TType extends string> = {
  '@context': JsonLdContext;
  '@type': TType;
};

type OptionalStandardFields = {
  url?: string;
  description?: string;
};

export type PostalAddressJsonLd = {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
};

export type OrganizationJsonLd = JsonLdBase<'Organization'> &
  OptionalStandardFields & {
    name: string;
    logo?: string;
    sameAs?: string[];
    address?: PostalAddressJsonLd;
  };

export type WebSiteJsonLd = JsonLdBase<'WebSite'> &
  OptionalStandardFields & {
    name: string;
  };

type BreadcrumbListItemJsonLd = {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
};

export type BreadcrumbListJsonLd = JsonLdBase<'BreadcrumbList'> & {
  itemListElement: BreadcrumbListItemJsonLd[];
};

type FaqQuestionJsonLd = {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
};

export type FaqPageJsonLd = JsonLdBase<'FAQPage'> & {
  mainEntity: FaqQuestionJsonLd[];
};

export type PhysicianJsonLd = JsonLdBase<'Physician'> &
  OptionalStandardFields & {
    name: string;
    medicalSpecialty?: string | string[];
    address?: PostalAddressJsonLd;
  };

export type MedicalClinicJsonLd = JsonLdBase<'MedicalClinic'> &
  OptionalStandardFields & {
    name: string;
    medicalSpecialty?: string | string[];
    address?: PostalAddressJsonLd;
  };

export type MedicalOrganizationJsonLd = JsonLdBase<'MedicalOrganization'> &
  OptionalStandardFields & {
    name: string;
    address?: PostalAddressJsonLd;
  };

export type PharmacyJsonLd = JsonLdBase<'Pharmacy'> &
  OptionalStandardFields & {
    name: string;
    address?: PostalAddressJsonLd;
  };

export type DiagnosticLabJsonLd = JsonLdBase<'DiagnosticLab'> &
  OptionalStandardFields & {
    name: string;
    address?: PostalAddressJsonLd;
  };

export type MedicalTestJsonLd = JsonLdBase<'MedicalTest'> &
  OptionalStandardFields & {
    name: string;
  };

export type SupportedJsonLd =
  | OrganizationJsonLd
  | WebSiteJsonLd
  | BreadcrumbListJsonLd
  | FaqPageJsonLd
  | PhysicianJsonLd
  | MedicalClinicJsonLd
  | MedicalOrganizationJsonLd
  | PharmacyJsonLd
  | DiagnosticLabJsonLd
  | MedicalTestJsonLd;

function normalizeJsonLdValue(value: JsonLdValue): JsonLdValue {
  if (typeof value === 'string') {
    return normalizePublicBrandCopy(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeJsonLdValue(entry));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeJsonLdValue(entry)])
    ) as JsonLdValue;
  }

  return value;
}

export function createJsonLd<T extends SupportedJsonLd>(schema: T): T {
  return normalizeJsonLdValue(schema as unknown as JsonLdValue) as unknown as T;
}

function sanitizeJsonLdForScript(value: string): string {
  return value
    .replace(/<\//g, '<\\/')
    .replace(/<!--/g, '<\\!--')
    .replace(/-->/g, '--\\>');
}

export function serializeJsonLd(schema: SupportedJsonLd): string {
  const raw = JSON.stringify(schema as unknown as JsonLdValue);
  return sanitizeJsonLdForScript(raw);
}

export function createBreadcrumbListJsonLd(
  items: Array<{ name: string; item: string }>
): BreadcrumbListJsonLd {
  return createJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item
    }))
  });
}

export function createFaqPageJsonLd(
  items: Array<{ question: string; answer: string }>
): FaqPageJsonLd {
  return createJsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer
      }
    }))
  });
}
