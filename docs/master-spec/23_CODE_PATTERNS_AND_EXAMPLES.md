# 23_CODE_PATTERNS_AND_EXAMPLES.md

## Purpose
This file defines the approved coding patterns Claude Code must follow while implementing DrMuscat.

Specs are not enough. When implementation details are ambiguous, Claude Code must follow these examples instead of inventing new patterns, because apparently software does not build itself out of hope and decorative markdown.

## 1. Global Coding Rules

- Use TypeScript strictly.
- Do not use `any` unless explicitly justified in a comment.
- Use Zod for all public input validation.
- Public SEO pages must be Server Component first.
- Use Client Components only for interactive islands.
- Never import the service-role Supabase client into Client Components.
- Never expose raw database, Supabase, SMS, storage, or payment errors to users.
- Never create duplicate utility patterns if a shared helper exists.
- Every mutation must be server-side validated.
- Every critical mutation must support audit logging.
- Every page must use central i18n helpers and shared UI components.

## 2. Supabase Client Boundaries

### 2.1 Browser client

File:

```text
src/lib/supabase/client.ts
```

Approved pattern:

```ts
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Rules:

- This client uses the anon key only.
- This client is governed by RLS.
- Do not use this client for billing, approvals, role assignment, ledger writes, storage private reads, or admin actions.

### 2.2 Server session client

File:

```text
src/lib/supabase/server.ts
```

Approved pattern:

```ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies.
            // Middleware should refresh sessions where needed.
          }
        },
      },
    }
  );
}
```

Rules:

- Use this for Server Components, Server Actions, and authenticated RLS-bound queries.
- Do not bypass RLS with this client.

### 2.3 Service-role client

File:

```text
src/lib/supabase/service.ts
```

Approved pattern:

```ts
import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase service environment variables.');
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
```

Rules:

- This file must start with `import 'server-only';`.
- This client must never be imported by Client Components.
- This client is allowed only in API route handlers, trusted Server Actions, admin-only actions, and controlled backend workflows.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` through `NEXT_PUBLIC_*`.

## 3. API Response Pattern

File:

```text
src/lib/api-response.ts
```

Approved pattern:

```ts
import { NextResponse } from 'next/server';

export type ApiErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'validation_error'
  | 'rate_limited'
  | 'not_found'
  | 'conflict'
  | 'approval_required'
  | 'server_error';

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiError = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    request_id?: string;
  };
};

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, init);
}

export function fail(code: ApiErrorCode, message: string, status = 400, requestId?: string) {
  return NextResponse.json<ApiError>(
    { ok: false, error: { code, message, request_id: requestId } },
    { status }
  );
}
```

Rules:

- Public clients must receive stable error codes, not raw Supabase errors.
- Server logs may capture raw internal errors.
- User-facing messages must be localizable.

## 4. Server Component Supabase Query Pattern

Approved example for public center profile:

```tsx
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getLocalizedField } from '@/lib/i18n/translate-field';
import type { Locale } from '@/lib/i18n/config';

export default async function CenterProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: center, error } = await supabase
    .from('centers')
    .select(`
      id,
      slug,
      listing_status,
      organization_id,
      description_en,
      description_ar,
      short_description_en,
      short_description_ar,
      organizations:organization_id (
        id,
        name_official,
        name_en,
        name_ar,
        status
      ),
      areas:area_id (slug, name_en, name_ar),
      categories:category_id (slug, name_en, name_ar)
    `)
    .eq('slug', slug)
    .eq('listing_status', 'published')
    .single();

  if (error || !center) notFound();

  const centerName = getLocalizedField(center.organizations, 'name', locale, [
    `${locale}`,
    'en',
    'ar',
    'official',
  ]);

  return <main>{centerName}</main>;
}
```

Rules:

- Do not fetch public SEO page data with `useEffect`.
- Do not make the whole page `use client`.
- Do not fetch unpublished rows for public pages.
- Do not expose private CRM, invoices, payments, or admin notes on public pages.

## 5. RLS Helper Function Pattern

Approved SQL pattern:

```sql
CREATE OR REPLACE FUNCTION public.has_role(role_to_check public.profile_role_type)
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profile_roles pr
    WHERE pr.profile_id = auth.uid()
      AND pr.role_name = role_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

Rules:

- SECURITY DEFINER functions must set `search_path = public`.
- Functions must be null-safe for `auth.uid()`.
- Helper functions must not mutate data.
- Do not create broad helper functions that return data from other tenants.

## 6. Phone Normalization Pattern

File:

```text
src/features/auth/phone.ts
```

Approved pattern:

```ts
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export type SupportedCountryCode = '+968' | '+971' | '+98' | '+91' | string;

export function getDefaultCountryCode(): SupportedCountryCode {
  return '+968';
}

export function normalizePhoneNumber(rawPhone: string, countryCode = '+968') {
  const trimmed = rawPhone.trim().replace(/\s+/g, '');
  const candidate = trimmed.startsWith('+') ? trimmed : `${countryCode}${trimmed.replace(/^0+/, '')}`;
  const parsed = parsePhoneNumberFromString(candidate);

  if (!parsed || !parsed.isValid()) {
    return { ok: false as const, error: 'invalid_phone_number' };
  }

  return { ok: true as const, phone: parsed.number };
}

export function isE164(phone: string) {
  return /^\+[1-9][0-9]{7,14}$/.test(phone);
}
```

Rules:

- Store only E.164 format in `profiles.phone_number`.
- Default UI country code is Oman `+968`.
- Do not require email for normal users.

## 7. Phone OTP Server Action Pattern

File:

```text
src/features/auth/actions.ts
```

Approved pattern:

```ts
'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { normalizePhoneNumber } from './phone';
import { verifyTurnstileIfConfigured } from '@/lib/turnstile';
import { enforceRateLimit } from '@/lib/rate-limit';

const RequestOtpSchema = z.object({
  phone: z.string().min(8).max(20),
  country_code: z.string().default('+968'),
  turnstile_token: z.string().optional(),
});

export async function requestPhoneOtp(payload: unknown) {
  const input = RequestOtpSchema.parse(payload);
  const normalized = normalizePhoneNumber(input.phone, input.country_code);

  if (!normalized.ok) {
    return { ok: false, error: { code: 'validation_error', message: 'Invalid phone number.' } };
  }

  await verifyTurnstileIfConfigured(input.turnstile_token);
  await enforceRateLimit(`otp:phone:${normalized.phone}`, 3, 60 * 60);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({ phone: normalized.phone });

  if (error) {
    console.error('[OTP_REQUEST_ERROR]', error);
    return { ok: false, error: { code: 'server_error', message: 'Could not send verification code.' } };
  }

  return { ok: true, data: { phone: normalized.phone } };
}
```

Rules:

- Verify Turnstile before OTP request when configured.
- Use app-level throttling where infrastructure allows.
- Do not expose raw Supabase Auth errors.
- Do not create custom OTP tables unless explicitly approved.

## 8. returnTo Validation Pattern

File:

```text
src/features/auth/return-to.ts
```

Approved pattern:

```ts
const DEFAULT_RETURN_TO = '/en/dashboard/user';

export function sanitizeReturnTo(returnTo: string | null | undefined) {
  if (!returnTo) return DEFAULT_RETURN_TO;

  try {
    if (returnTo.startsWith('http://') || returnTo.startsWith('https://')) {
      return DEFAULT_RETURN_TO;
    }

    if (!returnTo.startsWith('/')) {
      return DEFAULT_RETURN_TO;
    }

    if (returnTo.startsWith('//')) {
      return DEFAULT_RETURN_TO;
    }

    return returnTo;
  } catch {
    return DEFAULT_RETURN_TO;
  }
}
```

Rules:

- Never redirect to external URLs from `returnTo`.
- Preserve user intent for Patient Offer, Claim Profile, Save Center, and Partner onboarding flows.

## 9. Signed Upload URL Pattern

Route:

```text
src/app/api/storage/signed-upload-url/route.ts
```

Approved pattern:

```ts
import { z } from 'zod';
import { ok, fail } from '@/lib/api-response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/service';

const SignedUploadSchema = z.object({
  bucket: z.enum(['public-media', 'private-documents', 'payment-receipts', 'contracts', 'license-files']), // video-assets is admin-only/future and intentionally rejected in MVP
  owner_type: z.enum(['organization', 'doctor']),
  owner_id: z.string().uuid(),
  media_role: z.string().min(2).max(50),
  file_name: z.string().min(1).max(180),
  mime_type: z.enum(['image/jpeg', 'image/png', 'application/pdf']),
  file_size: z.number().int().positive().max(15 * 1024 * 1024),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = SignedUploadSchema.safeParse(body);
  if (!parsed.success) return fail('validation_error', 'Invalid upload request.', 422);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return fail('unauthorized', 'Login required.', 401);

  const input = parsed.data;

  // Server must verify ownership or admin access using RLS helper RPCs before issuing URL.
  // Do not trust owner_id from client.

  const service = createSupabaseServiceClient();

  const { data: mediaAsset, error: assetError } = await service
    .from('media_assets')
    .insert({
      owner_type: input.owner_type,
      owner_id: input.owner_id,
      media_role: input.media_role,
      file_url: '',
      file_type: input.mime_type.startsWith('image/') ? 'image' : 'document',
      mime_type: input.mime_type,
      file_size: input.file_size,
      storage_bucket: input.bucket,
      status: 'uploaded',
    })
    .select('id')
    .single();

  if (assetError || !mediaAsset) {
    console.error('[MEDIA_ASSET_CREATE_ERROR]', assetError);
    return fail('server_error', 'Could not prepare upload.', 500);
  }

  const extension = input.mime_type === 'application/pdf' ? 'pdf' : input.mime_type === 'image/png' ? 'png' : 'jpg';
  const path = `${input.owner_type}s/${input.owner_id}/${input.media_role}/${mediaAsset.id}.${extension}`;

  const { error: pathError } = await service
    .from('media_assets')
    .update({ storage_path: path })
    .eq('id', mediaAsset.id);

  if (pathError) {
    console.error('[MEDIA_ASSET_PATH_UPDATE_ERROR]', pathError);
    return fail('server_error', 'Could not prepare upload path.', 500);
  }

  const { data, error } = await service.storage
    .from(input.bucket)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error('[SIGNED_UPLOAD_ERROR]', error);
    return fail('server_error', 'Could not create upload URL.', 500);
  }

  return ok({ media_asset_id: mediaAsset.id, path, signed_url: data.signedUrl, token: data.token });
}
```

Rules:

- The server generates the storage path.
- Client never chooses arbitrary paths.
- Private documents are not publicly readable.
- Public assets appear publicly only after approval.

## 10. Audit Log Insert Pattern

File:

```text
src/server/audit/log.ts
```

Approved pattern:

```ts
import { createSupabaseServiceClient } from '@/lib/supabase/service';

export async function writeAuditLog(input: {
  request_id?: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
}) {
  const service = createSupabaseServiceClient();

  const { error } = await service.from('audit_logs').insert({
    request_id: input.request_id ?? null,
    actor_id: input.actor_id,
    action: input.action,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    old_values: input.old_values ?? null,
    new_values: input.new_values ?? null,
  });

  if (error) {
    console.error('[AUDIT_LOG_WRITE_FAILED]', error);
    throw new Error('audit_log_failed');
  }
}
```

Rules:

- Critical admin actions must write audit logs.
- Audit logs are append-only.
- Normal admins must not edit or delete audit logs.

## 11. i18n Config Pattern

File:

```text
src/lib/i18n/config.ts
```

Approved pattern:

```ts
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية'
};
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
## 12. Localized Field Helper Pattern

File:

```text
src/lib/i18n/translate-field.ts
```

Approved pattern:

```ts
import type { Locale } from './config';

type Entity = Record<string, unknown> | null | undefined;

export function getLocalizedField(
  entity: Entity,
  fieldBaseName: string,
  locale: Locale,
  fallbackOrder?: string[]
) {
  if (!entity) return '';

  const defaults: Record<Locale, string[]> = {
    en: ['en', 'ar'],
    ar: ['ar', 'en', 'ar'],
    fa: ['ar', 'en', 'ar'],
  };

  const order = fallbackOrder ?? defaults[locale];

  for (const suffix of order) {
    const key = suffix === 'official' ? `${fieldBaseName}_official` : `${fieldBaseName}_${suffix}`;
    const value = entity[key];
    if (typeof value === 'string' && value.trim().length > 0) return value;
  }

  const direct = entity[fieldBaseName];
  return typeof direct === 'string' ? direct : '';
}
```

Rules:

- Do not write custom fallback logic inside each component.
- Do not generate fake translations at runtime.
- Medical content must not be auto-translated and published without approval.

## 13. LanguageSwitcher Pattern

File:

```text
src/components/common/LanguageSwitcher.tsx
```

Rules:

- Must preserve current route.
- Must preserve subdomain when on a microsite.
- Must switch `/en/...` to `/ar/...` without sending the user to homepage.
- Must not create external redirects.

Approved helper idea:

```ts
export function switchLocaleInPath(pathname: string, nextLocale: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return `/${nextLocale}`;

  if (['en', 'ar'].includes(segments[0])) {
    segments[0] = nextLocale;
    return `/${segments.join('/')}`;
  }

  return `/${nextLocale}/${segments.join('/')}`;
}
```

## 14. Route Handler Validation Pattern

Approved structure:

```ts
export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const body = await request.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return fail('validation_error', 'Invalid request.', 422, requestId);

    // auth guard
    // permission guard
    // business logic
    // audit log if critical

    return ok({ request_id: requestId });
  } catch (error) {
    console.error('[ROUTE_ERROR]', { requestId, error });
    return fail('server_error', 'Something went wrong.', 500, requestId);
  }
}
```

Rules:

- Every critical route should generate a request ID.
- Validate before mutation.
- Permission-check before mutation.
- Audit after critical mutation.

## 15. Admin Approval Pattern

Approved workflow:

1. Admin fetches pending approval request.
2. Server verifies admin role.
3. Server reads target entity.
4. Server validates target status transition.
5. Server updates target entity.
6. Server updates approval request.
7. Server writes audit log.
8. Server returns stable response.

Never allow client to directly set:

- `approval_requests.status = 'approved'`
- `organizations.status = 'verified'`
- `centers.listing_status = 'published'`
- `payments.status = 'paid'`
- `subscriptions.status = 'active'`

## 16. Event Tracking Pattern

Route:

```text
src/app/api/events/route.ts
```

Rules:

- Public clients call `/api/events`.
- Public clients never insert into `public.events` directly.
- Store hashed IP and hashed user agent only.
- Do not store raw IP or raw user agent.
- Use rate limiting.
- Do not use `public.events` for paid ad billing clicks. Paid ad telemetry belongs in `public.ad_events`.

Approved event body:

```ts
const PublicEventSchema = z.object({
  owner_type: z.enum(['organization', 'center', 'doctor', 'article', 'microsite']),
  owner_id: z.string().uuid().optional(),
  event_type: z.enum([
    'page_view',
    'profile_view',
    'doctor_view',
    'article_view',
    'whatsapp_click',
    'call_click',
    'direction_click',
    'offer_click',
    'video_play',
    'gallery_open',
    'microsite_view',
    'search_performed',
    'partner_form_start',
    'partner_form_submit',
    'claim_profile_click',
  ]),
  locale: z.enum(['en', 'ar']).default('en'),
  page_url: z.string().url().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
```

## 17. Medical Claim Normalization Pattern

File:

```text
src/features/content/medical-claims.ts
```

Approved pattern:

```ts
export function normalizeMedicalClaimText(input: string) {
  return input
    .normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[۰٠]/g, '0')
    .replace(/[۱١]/g, '1')
    .replace(/[۲٢]/g, '2')
    .replace(/[۳٣]/g, '3')
    .replace(/[۴٤]/g, '4')
    .replace(/[۵٥]/g, '5')
    .replace(/[۶٦]/g, '6')
    .replace(/[۷٧]/g, '7')
    .replace(/[۸٨]/g, '8')
    .replace(/[۹٩]/g, '9')
    .replace(/٪/g, '%')
    .replace(/[\u200c\u200f\u202a-\u202e]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
```

Rules:

- Normalize before banned claim detection.
- Regex alone is not enough for Arabic/Arabic.
- Banned claim detection is first-line protection, not a replacement for admin review.

## 18. Responsive Component Pattern

Rules:

- Use mobile-first Tailwind classes.
- Do not create desktop-only layouts.
- No page may have unintended horizontal overflow.
- Tables must use responsive cards, horizontal scroll with clear affordance, or priority columns.
- Mobile sticky CTAs must account for safe-area insets.

Example:

```tsx
<section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
  <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
    <div className="min-w-0">Main content</div>
    <aside className="min-w-0">Sidebar</aside>
  </div>
</section>
```

Rules:

- Use `min-w-0` in grid/flex children to prevent overflow.
- Long names, URLs, badges, and translated text must wrap safely.

## 19. Task Completion Pattern

After each implementation task, Claude Code must report:

```text
Completed Task: [task name]
Changed Files:
- ...
Database Mutations:
- ...
Security/RLS Impact:
- ...
Performance Impact:
- ...
Responsive/RTL Impact:
- ...
Build Result:
- ...
Risks / Blockers:
- ...
Next Recommended Task:
- ...
```

Do not continue to the next task until approved.


## 15. V10 Image Optimization Processing Pattern

Files:

```text
src/server/media/optimize-image.ts
src/server/media/generate-derivatives.ts
src/server/media/media-policy.ts
```

Approved behavior:

- Upload original once.
- Validate MIME type and size server-side.
- Generate derivatives from original, not from a derivative.
- Prefer AVIF/WebP for public images where supported.
- Keep JPEG fallback if needed.
- Do not upscale small images.
- Strip unsafe metadata from public derivatives.
- Keep image dimensions, derivative paths, byte sizes, and status in metadata.
- Public UI must use `next/image` with correct `sizes`.
- Above-the-fold hero image may be priority only when it is the LCP image.
- Gallery/card images must lazy load.

Pseudo-flow:

```ts
export async function processUploadedImage(mediaAssetId: string) {
  // 1. Load media asset with storage_bucket/storage_path.
  // 2. Verify the asset belongs to an approved owner or pending review flow.
  // 3. Download original from storage using server-only service client.
  // 4. Generate thumbnail/card/profile/admin derivatives.
  // 5. Upload derivatives to deterministic paths.
  // 6. Update media_assets with derivative metadata and keep original path.
  // 7. Set status to pending_review or approved depending on route and admin rules.
}
```

Claude Code must not implement lossy browser-only compression as the only optimization layer. Browser compression may be a convenience, but server-side validation and derivative generation are canonical.

# V10 Review Submission Pattern

Reviews must be created as pending. Public insert must never publish directly.

```ts
// src/features/reviews/actions.ts
import { z } from 'zod';

export const reviewInputSchema = z.object({
  centerId: z.string().uuid(),
  serviceId: z.string().uuid().optional(),
  ratingOverall: z.number().int().min(1).max(5),
  ratingCleanliness: z.number().int().min(1).max(5).optional(),
  ratingStaffBehavior: z.number().int().min(1).max(5).optional(),
  ratingWaitingTime: z.number().int().min(1).max(5).optional(),
  ratingDoctorCommunication: z.number().int().min(1).max(5).optional(),
  ratingPriceClarity: z.number().int().min(1).max(5).optional(),
  ratingBookingExperience: z.number().int().min(1).max(5).optional(),
  ratingLocationParking: z.number().int().min(1).max(5).optional(),
  ratingServiceSatisfaction: z.number().int().min(1).max(5).optional(),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().min(10).max(2000),
  language: z.enum(['en', 'ar']).default('en'),
  confirmPolicy: z.literal(true),
});

export async function createPendingReview(input: z.infer<typeof reviewInputSchema>) {
  const parsed = reviewInputSchema.parse(input);
  // 1. require authenticated user for MVP public review
  // 2. run moderation pre-scan for insults, personal data, medical data, accusation keywords
  // 3. enforce one-review-per-center-per-user-per-90-days server-side
  // 4. insert status='pending'
  // 5. audit log critical action
  // 6. return stable success message: review submitted for moderation
}
```

# V10 AI Chat Safety Pattern

AI chat must be retrieval-bound and safety-scoped.

```ts
// src/features/ai-chat/safety.ts
export function classifyAiChatIntent(message: string) {
  // allowed: find clinic, find pharmacy, compare filters, claim profile, explain DrMuscat policy
  // blocked/escalated: diagnosis, prescription, emergency symptoms, lab/image interpretation
}

export function buildAiSafetyDisclaimer(locale: 'en' | 'ar') {
  return 'DrMuscat AI helps you find healthcare providers and information. It does not diagnose, prescribe, or replace a licensed medical professional. For emergencies, contact local emergency services immediately.';
}
```

# V10 Analytics Event Pattern

All major conversion actions must log canonical events before redirect.

```ts
// src/features/analytics/events.ts
export const analyticsEventNames = [
  'page_view',
  'profile_view',
  'search_performed',
  'whatsapp_click',
  'call_click',
  'direction_click',
  'offer_claim',
  'offer_redeem',
  'review_submit',
  'review_helpful_vote',
  'claim_profile_click',
  'claim_profile_submit',
  'start_chat',
  'ai_lead_generated',
  'center_signup_start',
  'center_signup_submit',
  'proposal_view',
  'payment_receipt_upload',
] as const;

export type AnalyticsEventName = typeof analyticsEventNames[number];
```

# V10 WhatsApp Redirect Pattern

```ts
export function buildTrackedWhatsAppUrl(args: {
  phoneE164: string;
  centerName: string;
  serviceName?: string;
  areaName?: string;
  offerCode?: string;
  locale: 'en' | 'ar';
}) {
  const message = args.locale === 'ar'
    ? `مرحبا، حصلت عيادتكم في DrMuscat. أريد أستفسر${args.serviceName ? ` عن ${args.serviceName}` : ''}.${args.areaName ? ` المنطقة: ${args.areaName}.` : ''}${args.offerCode ? ` كود العرض: ${args.offerCode}.` : ''}`
    : `Hi, I found your clinic on DrMuscat. I want to ask${args.serviceName ? ` about ${args.serviceName}` : ''}.${args.areaName ? ` Area: ${args.areaName}.` : ''}${args.offerCode ? ` Offer code: ${args.offerCode}.` : ''}`;

  return `https://wa.me/${args.phoneE164.replace('+', '')}?text=${encodeURIComponent(message)}`;
}
```

# V10 Noindex Guard Pattern

```ts
export function shouldIndexProgrammaticPage(args: {
  relevantListingCount: number;
  hasUniqueEditorialContent: boolean;
  manuallyApproved: boolean;
}) {
  return args.relevantListingCount >= 3 || args.hasUniqueEditorialContent || args.manuallyApproved;
}
```
