export type PublicContactActionKind = 'call' | 'whatsapp' | 'email' | 'website';

export type PublicContactAction = {
  kind: PublicContactActionKind;
  href: string;
  labelEn: string;
  labelAr: string;
  ariaLabelEn: string;
  ariaLabelAr: string;
};

type PublicContactCountry = 'om' | (string & {});

type PublicContactActionLabels = {
  callEn?: string | undefined;
  callAr?: string | undefined;
  whatsappEn?: string | undefined;
  whatsappAr?: string | undefined;
  emailEn?: string | undefined;
  emailAr?: string | undefined;
  websiteEn?: string | undefined;
  websiteAr?: string | undefined;
};

type PublicContactSource = PublicContactActionLabels & {
  contactReviewStatus?: string | null;
  country?: PublicContactCountry | null;
  primaryPhone?: string | null;
  secondaryPhone?: string | null;
  whatsappPhone?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  publicPrimaryPhoneVisible?: boolean | null;
  publicSecondaryPhoneVisible?: boolean | null;
  publicWhatsappPhoneVisible?: boolean | null;
  publicEmailVisible?: boolean | null;
  allowPublicDirectoryFallback?: boolean | null;
};

export type PublicContactVisibilityInput = {
  contactReviewStatus?: string | null | undefined;
  isVisible?: boolean | null | undefined;
  locationActive?: boolean | null | undefined;
  providerPublicEligible?: boolean | null | undefined;
  value?: string | null | undefined;
  allowPublicDirectoryFallback?: boolean | null | undefined;
};

const DEFAULT_CALL_LABEL_EN = 'Call center';
const DEFAULT_CALL_LABEL_AR = 'الاتصال بالمركز';
const DEFAULT_WHATSAPP_LABEL_EN = 'WhatsApp center';
const DEFAULT_WHATSAPP_LABEL_AR = 'واتساب المركز';
const DEFAULT_EMAIL_LABEL_EN = 'Email center';
const DEFAULT_EMAIL_LABEL_AR = 'البريد الإلكتروني للمركز';
const DEFAULT_WEBSITE_LABEL_EN = 'Visit website';
const DEFAULT_WEBSITE_LABEL_AR = 'زيارة موقع المركز';
const VISUAL_PHONE_SEPARATORS = /[\s+\-().\u00a0\u2000-\u200d\u202f\u2060]/g;
const SAFE_EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const MAX_PUBLIC_EMAIL_LENGTH = 254;
const MAX_PUBLIC_WEBSITE_LENGTH = 2048;

function stripPublicPhoneSeparators(value: string): string {
  return value.normalize('NFKC').trim().replace(VISUAL_PHONE_SEPARATORS, '');
}

type ResolvedPublicContactActionLabels = {
  callEn: string;
  callAr: string;
  whatsappEn: string;
  whatsappAr: string;
  emailEn: string;
  emailAr: string;
  websiteEn: string;
  websiteAr: string;
};

type PublicCallCandidate = {
  value: string | null | undefined;
  isVisible: boolean | null | undefined;
};

type BuiltPublicCallCandidate = {
  action: PublicContactAction;
  isPreferredLandline: boolean;
};

function createPublicContactAction(
  kind: PublicContactActionKind,
  href: string,
  labels: ResolvedPublicContactActionLabels
): PublicContactAction {
  const labelByKind: Record<PublicContactActionKind, { en: string; ar: string }> = {
    call: { en: labels.callEn, ar: labels.callAr },
    whatsapp: { en: labels.whatsappEn, ar: labels.whatsappAr },
    email: { en: labels.emailEn, ar: labels.emailAr },
    website: { en: labels.websiteEn, ar: labels.websiteAr }
  };
  const label = labelByKind[kind];

  return {
    kind,
    href,
    labelEn: label.en,
    labelAr: label.ar,
    ariaLabelEn: label.en,
    ariaLabelAr: label.ar
  };
}

function resolvePublicContactLabels(labels: PublicContactActionLabels = {}): ResolvedPublicContactActionLabels {
  return {
    callEn: labels.callEn ?? DEFAULT_CALL_LABEL_EN,
    callAr: labels.callAr ?? DEFAULT_CALL_LABEL_AR,
    whatsappEn: labels.whatsappEn ?? DEFAULT_WHATSAPP_LABEL_EN,
    whatsappAr: labels.whatsappAr ?? DEFAULT_WHATSAPP_LABEL_AR,
    emailEn: labels.emailEn ?? DEFAULT_EMAIL_LABEL_EN,
    emailAr: labels.emailAr ?? DEFAULT_EMAIL_LABEL_AR,
    websiteEn: labels.websiteEn ?? DEFAULT_WEBSITE_LABEL_EN,
    websiteAr: labels.websiteAr ?? DEFAULT_WEBSITE_LABEL_AR
  };
}

function hasPublicContactValue(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function isBlockedPublicContactReviewStatus(contactReviewStatus: string | null | undefined): boolean {
  return contactReviewStatus === 'rejected' || contactReviewStatus === 'suspended';
}

function publicTelDigits(value: string | null | undefined): string | null {
  const href = normalizePublicTelHref(value);
  if (!href) return null;
  return href.replace(/^tel:\+?/, '');
}

function isPreferredOmanLandline(value: string | null | undefined, country: PublicContactCountry | null | undefined): boolean {
  if (country !== 'om') return false;
  const digits = publicTelDigits(value);
  if (!digits) return false;

  const localDigits = digits.startsWith('968') ? digits.slice(3) : digits;
  return /^2\d{7}$/.test(localDigits);
}

export function isApprovedPublicContact(contactReviewStatus: string | null | undefined): boolean {
  return contactReviewStatus === 'approved';
}

export function isPublicContactVisible(input: PublicContactVisibilityInput): boolean {
  if (input.providerPublicEligible === false) return false;
  if (input.locationActive === false) return false;
  if (!hasPublicContactValue(input.value)) return false;

  if (input.allowPublicDirectoryFallback === true) {
    return !isBlockedPublicContactReviewStatus(input.contactReviewStatus);
  }

  if (input.isVisible !== true) return false;

  return isApprovedPublicContact(input.contactReviewStatus);
}

export function normalizePublicTelHref(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmedValue = value.normalize('NFKC').trim();
  if (!trimmedValue) return null;

  const hasLeadingPlus = trimmedValue.startsWith('+');
  const strippedValue = stripPublicPhoneSeparators(trimmedValue);
  const normalizedValue = hasLeadingPlus ? `+${strippedValue.replace(/^\+/, '')}` : strippedValue;

  if (!/^\+?\d{6,15}$/.test(normalizedValue)) return null;

  return `tel:${normalizedValue}`;
}

export function normalizePublicWhatsAppDigits(
  value: string | null | undefined,
  country: PublicContactCountry | null | undefined
): string | null {
  if (!value) return null;

  const digits = stripPublicPhoneSeparators(value);
  if (!/^\d{8,15}$/.test(digits)) return null;

  if (country === 'om' && /^[79]\d{7}$/.test(digits)) {
    return `968${digits}`;
  }

  return digits;
}

export function normalizePublicEmailHref(value: string | null | undefined): string | null {
  if (!value) return null;

  const normalizedEmail = value.normalize('NFKC').trim().toLowerCase();
  if (!normalizedEmail || normalizedEmail.length > MAX_PUBLIC_EMAIL_LENGTH) return null;
  if (!SAFE_EMAIL_PATTERN.test(normalizedEmail)) return null;

  return `mailto:${normalizedEmail}`;
}

export function normalizePublicWebsiteHref(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmedValue = value.normalize('NFKC').trim();
  if (!trimmedValue || trimmedValue.length > MAX_PUBLIC_WEBSITE_LENGTH) return null;
  if (/\s/.test(trimmedValue)) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;

  try {
    const parsedUrl = new URL(candidate);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') return null;
    if (!parsedUrl.hostname || parsedUrl.username || parsedUrl.password) return null;

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

export function buildPublicCallAction(
  value: string | null | undefined,
  isVisible: boolean | null | undefined,
  contactReviewStatus: string | null | undefined,
  labels?: PublicContactActionLabels,
  allowPublicDirectoryFallback?: boolean | null
): PublicContactAction | null {
  if (!isPublicContactVisible({ contactReviewStatus, isVisible, value, allowPublicDirectoryFallback })) return null;

  const href = normalizePublicTelHref(value);
  if (!href) return null;

  return createPublicContactAction('call', href, resolvePublicContactLabels(labels));
}

function buildPublicCallActions(
  candidates: PublicCallCandidate[],
  country: PublicContactCountry | null | undefined,
  contactReviewStatus: string | null | undefined,
  labels: ResolvedPublicContactActionLabels,
  allowPublicDirectoryFallback: boolean
): PublicContactAction[] {
  const builtCandidates: BuiltPublicCallCandidate[] = [];

  for (const candidate of candidates) {
    const action = buildPublicCallAction(
      candidate.value,
      candidate.isVisible,
      contactReviewStatus,
      labels,
      allowPublicDirectoryFallback
    );
    if (!action) continue;

    builtCandidates.push({
      action,
      isPreferredLandline: isPreferredOmanLandline(candidate.value, country)
    });
  }

  const preferredLandlines = builtCandidates.filter((candidate) => candidate.isPreferredLandline);
  return (preferredLandlines.length > 0 ? preferredLandlines : builtCandidates).map((candidate) => candidate.action);
}

export function buildPublicWhatsAppAction(
  value: string | null | undefined,
  isVisible: boolean | null | undefined,
  contactReviewStatus: string | null | undefined,
  country: PublicContactCountry | null | undefined,
  labels?: PublicContactActionLabels,
  allowPublicDirectoryFallback?: boolean | null
): PublicContactAction | null {
  if (!isPublicContactVisible({ contactReviewStatus, isVisible, value, allowPublicDirectoryFallback })) return null;

  const digits = normalizePublicWhatsAppDigits(value, country);
  if (!digits) return null;

  return createPublicContactAction('whatsapp', `https://wa.me/${digits}`, resolvePublicContactLabels(labels));
}

export function buildPublicEmailAction(
  value: string | null | undefined,
  isVisible: boolean | null | undefined,
  contactReviewStatus: string | null | undefined,
  labels?: PublicContactActionLabels,
  allowPublicDirectoryFallback?: boolean | null
): PublicContactAction | null {
  if (!isPublicContactVisible({ contactReviewStatus, isVisible, value, allowPublicDirectoryFallback })) return null;

  const href = normalizePublicEmailHref(value);
  if (!href) return null;

  return createPublicContactAction('email', href, resolvePublicContactLabels(labels));
}

export function buildPublicWebsiteAction(
  value: string | null | undefined,
  contactReviewStatus: string | null | undefined,
  labels?: PublicContactActionLabels,
  allowPublicDirectoryFallback?: boolean | null
): PublicContactAction | null {
  if (!isPublicContactVisible({ contactReviewStatus, isVisible: true, value, allowPublicDirectoryFallback })) return null;

  const href = normalizePublicWebsiteHref(value);
  if (!href) return null;

  return createPublicContactAction('website', href, resolvePublicContactLabels(labels));
}

export function buildPublicContactActions(source: PublicContactSource): PublicContactAction[] {
  const allowPublicDirectoryFallback = source.allowPublicDirectoryFallback === true;
  if (!allowPublicDirectoryFallback && !isApprovedPublicContact(source.contactReviewStatus)) return [];

  const labels = resolvePublicContactLabels({
    callEn: source.callEn,
    callAr: source.callAr,
    whatsappEn: source.whatsappEn,
    whatsappAr: source.whatsappAr,
    emailEn: source.emailEn,
    emailAr: source.emailAr,
    websiteEn: source.websiteEn,
    websiteAr: source.websiteAr
  });

  const candidates = [
    ...buildPublicCallActions(
      [
        { value: source.primaryPhone, isVisible: source.publicPrimaryPhoneVisible },
        { value: source.secondaryPhone, isVisible: source.publicSecondaryPhoneVisible }
      ],
      source.country,
      source.contactReviewStatus,
      labels,
      allowPublicDirectoryFallback
    ),
    buildPublicWhatsAppAction(source.whatsappPhone, source.publicWhatsappPhoneVisible, source.contactReviewStatus, source.country, labels, allowPublicDirectoryFallback),
    buildPublicEmailAction(source.email, source.publicEmailVisible, source.contactReviewStatus, labels, allowPublicDirectoryFallback),
    buildPublicWebsiteAction(source.websiteUrl, source.contactReviewStatus, labels, allowPublicDirectoryFallback)
  ];

  const seenActions = new Set<string>();
  const actions: PublicContactAction[] = [];

  for (const action of candidates) {
    if (!action) continue;
    const actionKey = `${action.kind}:${action.href}`;
    if (seenActions.has(actionKey)) continue;
    seenActions.add(actionKey);
    actions.push(action);
  }

  return actions;
}
