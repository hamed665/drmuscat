# 19_ENVIRONMENT_VARIABLES_AND_DEPLOYMENT.md

# Environment Variables and Deployment

Public:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_ROOT_DOMAIN
- NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
- NEXT_PUBLIC_DEFAULT_LOCALE=en
- NEXT_PUBLIC_SUPPORTED_LOCALES=en,ar
- NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=+968

Server-only:
- SUPABASE_SERVICE_ROLE_KEY
- CLOUDFLARE_TURNSTILE_SECRET_KEY
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN
- INTERNAL_ADMIN_BOOTSTRAP_SECRET
- HASH_SALT
- YOUTUBE_API_KEY
- EMAIL_FROM
- SMS_PROVIDER_NAME

Future payment env reserved but not Phase 1 unless approved: THAWANI, TAP, PAYTABS keys.

No real `.env` committed. service_role only in server-only files with `import 'server-only'`.

# V10 CANONICAL ADDITION — Canonical Environment Variables

Claude Code must use these exact environment variable names. Do not invent new names.

## Public Client Variables

```env
NEXT_PUBLIC_APP_NAME=DrMuscat
NEXT_PUBLIC_ROOT_DOMAIN=drmuscat.com
NEXT_PUBLIC_SITE_URL=https://drmuscat.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=replace_with_anon_key
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=replace_with_turnstile_site_key
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,ar
NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=+968
NEXT_PUBLIC_SUPPORT_WHATSAPP=+96800000000
```

## Server-only Variables

```env
SUPABASE_SERVICE_ROLE_KEY=replace_with_service_role_key
CLOUDFLARE_TURNSTILE_SECRET_KEY=replace_with_turnstile_secret_key
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=replace_with_upstash_token
```

## Auth / SMS Variables

Use Supabase Auth as OTP source of truth.

If external provider variables are needed for documentation or provider integration, use:

```env
SMS_PROVIDER_NAME=twilio
TWILIO_ACCOUNT_SID=replace_if_used
TWILIO_AUTH_TOKEN=replace_if_used
TWILIO_VERIFY_SERVICE_SID=replace_if_used
VONAGE_API_KEY=replace_if_used
VONAGE_API_SECRET=replace_if_used
```

Important:

- Do not use Twilio/Vonage directly for OTP unless explicitly approved.
- Supabase Auth SMS provider configuration is the default production path.

## Email Variables

```env
EMAIL_FROM=noreply@drmuscat.com
EMAIL_REPLY_TO=support@drmuscat.com
RESEND_API_KEY=replace_if_used
```

## Admin Bootstrap Variables

```env
DRMUSCAT_BOOTSTRAP_ADMIN_EMAIL=admin@drmuscat.com
DRMUSCAT_BOOTSTRAP_ADMIN_PHONE=+96800000000
```

Rules:

- Bootstrap admin variables are for controlled setup only.
- Do not create public admin signup.
- Remove or disable bootstrap flow after production setup.

## Analytics / Privacy Variables

```env
ANALYTICS_SALT=replace_with_random_secret_salt
EVENT_HASH_SALT=replace_with_random_secret_salt
```

Rules:

- Use salts to hash IP/user-agent/session identifiers.
- Never store raw IP addresses in `public.events`.

## Deployment Variables

```env
VERCEL_ENV=production
NODE_ENV=production
```

## ENV Safety Rules

- No private variable may start with `NEXT_PUBLIC_`.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser.
- `CLOUDFLARE_TURNSTILE_SECRET_KEY` must never be exposed to the browser.
- Claude Code must create `.env.example`, not `.env` with real secrets.
- Do not commit real secrets.
