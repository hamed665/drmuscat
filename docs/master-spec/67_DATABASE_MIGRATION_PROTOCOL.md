# 67_DATABASE_MIGRATION_PROTOCOL.md — Database Migration Protocol

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
Database failures are the fastest path to a beautiful disaster. This file defines the required migration discipline.

## 2. Canonical Database Decisions
- Use `public.` schema qualification for tables, functions, indexes, and foreign keys unless a different schema is explicitly required.
- `geo_areas` is canonical. Do not create new writable logic against legacy `areas`.
- `doctor_practice_locations` is canonical. Do not create new writable logic against legacy `doctor_centers`.
- `provider_plans` is canonical for dynamic provider plans.
- `platform_settings` is canonical for settings engine.
- For MVP, `behavior_events` should be a normal indexed table, not a fragile partitioned table, unless partitions are explicitly implemented and tested.

## 3. Migration Naming
Use sequential migrations:
```txt
0001_extensions.sql
0002_enums.sql
0003_profiles_auth.sql
0004_geo.sql
0005_taxonomy.sql
0006_centers.sql
0007_doctors.sql
0008_services.sql
0009_media.sql
0010_claims.sql
0011_plans_settings.sql
0012_offers.sql
0013_sponsored_ads.sql
0014_behavior_events.sql
0015_legal_consent.sql
0016_admin_ops.sql
0017_indexes.sql
0018_rls.sql
```

## 4. Required Migration Order
1. Extensions: `pg_trgm`, `unaccent`, `uuid-ossp` if needed.
2. Types/enums.
3. Core user/profile structures.
4. Geo tables.
5. Taxonomy tables.
6. Centers.
7. Doctors.
8. Doctor practice locations.
9. Services/offers/media.
10. Claims/ownership.
11. Plans/settings.
12. Events/analytics.
13. Legal/consent.
14. Indexes.
15. RLS policies.
16. Seeds.

## 5. Destructive Changes
Forbidden without explicit approval:
- `DROP TABLE`
- `DROP COLUMN`
- destructive `ALTER TYPE`
- deleting seed production data
- changing primary keys after dependent tables exist

Allowed only with documented reason and rollback plan.

## 6. Enum Rules
- Do not create overlapping enums for the same concept.
- Do not add enum values casually for future providers.
- Payment enum must match actual MVP behavior.
- Future gateway options may live in config tables but should not be live enum values unless implementation exists.

## 7. FK and Unique Rules
- Centers must support country-aware uniqueness: `UNIQUE(country_id, slug)` or documented equivalent.
- Doctor slugs must be collision-safe. If global unique, slug generator must include collision suffix strategy.
- No orphan doctor location rows.
- No orphan center taxonomy rows.

## 8. RLS Timing
RLS must be enabled in the same phase that creates protected tables or in the immediate Phase 3 security pass. No protected table may reach production without RLS.

## 9. Seed Protocol
Seeds live outside migrations:
```txt
supabase/seed/0001_oman_geo.sql
supabase/seed/0002_specialties.sql
supabase/seed/0003_demo_centers.sql
supabase/seed/0004_demo_doctors.sql
supabase/seed/0005_demo_relationships.sql
```
Seeds must be idempotent where possible.

## 10. Validation Commands
The agent must run available equivalents:
```bash
supabase db reset
supabase migration list
pnpm db:types
pnpm db:lint
```
If Supabase CLI is unavailable, stop and report the missing dependency rather than pretending the migration passed.

## 11. Migration Report
Every database phase must include:
```md
## Migration report
- migrations added
- tables created
- tables altered
- indexes added
- RLS enabled
- policies added
- seed files added
- validation command output
- known risks
```
