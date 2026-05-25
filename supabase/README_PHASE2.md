# Phase 2.4A — Supabase Centers Core Foundation

This file defines the approved Phase 2.4A migration scope.

## Approved files for Phase 2.4A

- `supabase/migrations/0001_extensions.sql`
- `supabase/migrations/0002_enums.sql`
- `supabase/migrations/0003_profiles_auth.sql`
- `supabase/migrations/0004_geo.sql`
- `supabase/migrations/0005_taxonomy.sql`
- `supabase/migrations/0006_centers.sql`

No other SQL migration files are allowed in this phase.

## Already approved before Phase 2.4A

- Phase 2.1: core extensions and enums
- Phase 2.2A: profiles/auth foundation
- Phase 2.2B: geo hierarchy foundation
- Phase 2.3: taxonomy/services foundation
- Phase 2.3B: `center_type` enum patch only

## Allowed in Phase 2.4A

- Centers core foundation only.
- Canonical center business entity table only:
  - `public.centers`
- Essential constraints and indexes only.
- Idempotent `updated_at` trigger for `public.centers` using existing `public.set_updated_at()`.

## Explicitly not allowed in Phase 2.4A

- No seed rows yet.
- No seed SQL files in `supabase/seed`.
- No PostGIS yet.
- No geometry/geography columns.
- No `public.center_locations` yet.
- No `public.center_services` yet.
- No provider ownership tables yet.
- No provider tables yet.
- No doctor tables yet.
- No appointment tables.
- No legal/consent tables.
- No behavior events tables.
- No sponsored slots tables.
- No audit log tables.
- No RLS policies yet.
- No search ranking/indexing yet.
- No frontend/backend app features yet.

## Strict exclusions

- no location mapping tables
- no service mapping tables
- no provider ownership tables
- no provider tables
- no doctor tables
- no appointment tables
- no legal/consent tables
- no behavior events tables
- no sponsored slots tables
- no audit log tables
- no RLS policies
- no seed rows
- no frontend pages
- no admin UI
- no provider dashboard
- no payment code
- no appointment engine
- no AI chat
- no Persian/Hindi routes
- no country expansion beyond Oman
- no unrelated refactor

## Required validation commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm routes:check`
- `pnpm env:check`
- `pnpm db:validate:migrations`
- `pnpm db:validate:seeds`
- `pnpm test:db:rls`
- `pnpm test:db:seed`

Phase 2.4A does not require Supabase login, linking to a remote project, or a live Supabase instance.