# 71_ENVIRONMENT_AND_DEPLOYMENT_CONTRACT.md — Environment and Deployment Contract

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
This file defines environment variables, deployment assumptions, and deploy safety.

## 2. Environments
Required environments:
- `local`
- `preview`
- `production`

Production must not be used for first migrations until preview passes.

## 3. Required Environment Variables
```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,ar
NEXT_PUBLIC_DEFAULT_COUNTRY=om
NEXT_PUBLIC_SUPPORTED_COUNTRIES=om
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

Future variables must be added only when the feature phase needs them:
```env
THAWANI_SECRET_KEY=
TAP_SECRET_KEY=
MYFATOORAH_SECRET_KEY=
TURNSTILE_SECRET_KEY=
SENTRY_DSN=
```
Do not require future variables for MVP boot.

## 4. Deployment Target
Default: Vercel + Supabase.
The agent must not assume a custom VPS unless explicitly approved.

## 5. Preview Deploy Gate
Before production:
- Build passes.
- Public routes work in preview.
- Sitemap/robots are correct.
- No preview-only URL is canonical.
- Environment validation passes.
- Admin routes are protected.

## 6. Production Deploy Gate
Before production deployment:
- Database backup strategy documented.
- Migration applied to staging/preview first.
- RLS reviewed.
- SEO noindex/index rules reviewed.
- Error monitoring configured or explicitly deferred.
- Secrets set in provider dashboard, not repo.

## 7. Health Endpoint
By production hardening, expose:
```txt
/api/health
```
It must not leak secrets. It may report:
- app version
- database connectivity status
- timestamp
- environment name

## 8. Rollback Principle
Every deploy must be small enough to revert. No huge multi-feature deploys.
