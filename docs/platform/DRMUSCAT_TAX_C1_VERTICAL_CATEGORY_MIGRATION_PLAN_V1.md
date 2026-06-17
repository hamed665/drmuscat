# DrMuscat TAX-C1 Vertical and Center Category Migration Plan V1

## 1. Purpose

This document is a documentation-only implementation plan for the future TAX-C1 database migration.

TAX-C1 will add the first dedicated public taxonomy classification layer for centers:

- `healthcare_verticals`
- `center_categories`
- `center_category_assignments`

This plan does not implement the migration. It defines the exact boundaries for the next database PR so the implementation does not accidentally add seed data, RLS, UI, public routes, public activation, ads, offers, billing, provider dashboard, media upload, reviews, or AI behavior.

## 2. Current foundation

The current database already includes:

- `taxonomy_groups`
- `service_categories`
- `services`
- `specialties`
- `centers`
- `center_locations`
- `center_services`
- `doctors`
- `doctor_practice_locations`
- `doctor_services`
- `doctor_schedules`

TAX-C1 must extend the existing model and must not replace current taxonomy or center tables.

## 3. Why TAX-C1 is needed

The existing `center_type` enum is too broad to model all public categories.

Examples that should not be solved only by enum expansion:

- pet clinic / veterinary
- gym / fitness center
- healthy restaurant / healthy cafe
- nutrition center
- wellness center
- lab / laboratory
- imaging center
- dental clinic
- dermatology/aesthetic clinic

TAX-C1 adds a proper classification layer while keeping `center_type` broad and stable.

## 4. TAX-C1 scope

Allowed in the future TAX-C1 database PR:

- create `healthcare_verticals`
- create `center_categories`
- create `center_category_assignments`
- add indexes and constraints for those tables
- add updated_at triggers for those tables
- add no seed data
- add no public routes
- add no admin UI
- add no public UI
- add no public activation
- add no provider dashboard
- add no offers, ads, billing, reviews, media, or AI

Forbidden in TAX-C1:

- editing existing migrations
- inserting real rows
- adding RLS policies in the same PR unless an explicit TAX-RLS phase approves it
- changing generated Supabase types unless the project convention requires generated type updates in the same DB PR
- changing public queries
- changing center publish workflow
- changing admin center edit forms
- exposing new public category pages
- changing sitemap/SEO routes

## 5. RLS boundary decision

Decision: TAX-C1 database migration should create tables only. RLS policies should be a separate follow-up PR.

Rationale:

- taxonomy table structure should be validated first
- public read policy design needs its own review
- provider write/edit access should not be introduced yet
- admin write actions do not exist yet

Recommended follow-up:

- `TAX-RLS-A`: public read policies for active/deleted-safe taxonomy rows and admin/service-role assumptions

## 6. Seed boundary decision

Decision: TAX-C1 must not seed real taxonomy rows.

Rationale:

- vertical/category labels must be reviewed in English and Arabic
- healthy food and veterinary launch status must be decided before public catalog rows exist
- insurance/license authority names must never be seeded from memory
- seed validation currently forbids casual seed expansion

Recommended follow-up:

- `TAX-SEED-A`: controlled seed plan for verticals/categories only after human approval
- `TAX-SEED-B`: seed implementation only after seed plan approval

## 7. Healthy food and veterinary decision

Decision: TAX-C1 schema should support healthy food and veterinary verticals structurally, but no public activation or seed rows should be added in TAX-C1.

Rationale:

- product may later include healthy restaurants/cafes and veterinary/pet health
- these categories must not be mixed with human medical schema
- schema support does not mean public launch

Future seed rows may include disabled or active verticals only after approval.

## 8. Table design: healthcare_verticals

Recommended future SQL table: `public.healthcare_verticals`

Purpose: top-level product/public verticals for health-related discovery.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `slug text not null unique`
- `name_en text not null`
- `name_ar text not null`
- `description_en text null`
- `description_ar text null`
- `is_medical boolean not null default true`
- `requires_medical_disclaimer boolean not null default false`
- `is_human_health boolean not null default true`
- `is_veterinary boolean not null default false`
- `is_food_related boolean not null default false`
- `schema_org_hint text null`
- `public_directory_enabled boolean not null default false`
- `public_profile_enabled boolean not null default true`
- `is_active boolean not null default true`
- `sort_order integer not null default 0`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz null`

Required checks:

- slug non-empty after trim
- name_en non-empty after trim
- name_ar non-empty after trim
- if `is_veterinary = true`, `is_human_health` should be false or explicitly reviewed later
- if `is_food_related = true`, schema.org medical hints must not imply human medical provider

Required indexes:

- slug unique
- is_active
- deleted_at partial index
- public_directory_enabled where true and active if useful

## 9. Table design: center_categories

Recommended future SQL table: `public.center_categories`

Purpose: public category layer for centers under healthcare verticals.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `vertical_id uuid not null references public.healthcare_verticals(id)`
- `parent_category_id uuid null references public.center_categories(id)`
- `slug text not null`
- `name_en text not null`
- `name_ar text not null`
- `description_en text null`
- `description_ar text null`
- `default_center_type center_type null`
- `is_medical boolean not null default true`
- `requires_medical_disclaimer boolean not null default false`
- `schema_org_hint text null`
- `public_directory_enabled boolean not null default false`
- `public_profile_enabled boolean not null default true`
- `is_active boolean not null default true`
- `sort_order integer not null default 0`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz null`

Required constraints:

- unique `(vertical_id, slug)` for non-deleted rows
- parent_category_id cannot equal id
- slug non-empty
- name_en non-empty
- name_ar non-empty

Required indexes:

- vertical_id
- parent_category_id where not null
- default_center_type where not null
- is_active
- deleted_at partial index

## 10. Table design: center_category_assignments

Recommended future SQL table: `public.center_category_assignments`

Purpose: attach centers to one or more center categories.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `center_id uuid not null references public.centers(id)`
- `vertical_id uuid not null references public.healthcare_verticals(id)`
- `category_id uuid not null references public.center_categories(id)`
- `is_primary boolean not null default false`
- `is_public boolean not null default false`
- `review_status text not null default 'draft'`
- `reviewed_by_profile_id uuid null references public.profiles(id)`
- `reviewed_at timestamptz null`
- `sort_order integer not null default 0`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz null`

Required constraints:

- review_status must be one of `draft`, `pending_review`, `approved`, `rejected`, `archived` unless a future enum is approved
- reviewed_at/reviewed_by consistency should be considered but not overcomplicated in TAX-C1
- category belongs to vertical must be enforced by server validation first; DB trigger not required in TAX-C1

Recommended indexes:

- center_id
- vertical_id
- category_id
- review_status
- is_primary where true
- is_public where true
- deleted_at partial index

Recommended uniqueness:

- unique active `(center_id, category_id)` where deleted_at is null
- one active primary category per center may be enforced by partial unique index later or server validation first

TAX-C1 should avoid overbuilding advanced uniqueness if it risks migration complexity.

## 11. Why no enum for review_status yet

Recommendation: use text check for assignment review_status in TAX-C1.

Rationale:

- existing content review enum may not be finalized
- enum expansion is harder to change later
- this is a new internal relation, not public display yet

A future enum can be introduced only if consistency becomes necessary.

## 12. Interaction with center_type

TAX-C1 does not remove or replace `centers.center_type`.

Future usage:

- `center_type` remains broad system grouping
- `center_categories` becomes public browsing classification
- `center_category_assignments.is_primary` determines preferred public grouping later
- public routes must not rely only on center_type once category assignments exist

## 13. Interaction with services and specialties

TAX-C1 does not change `services`, `service_categories`, or `specialties`.

Future TAX-C2/TAX-C3 work may add vertical bridging for service and specialty records.

Until then:

- center categories classify centers
- center_services continues to describe offered services
- doctors continue to use specialties

## 14. Interaction with public activation

TAX-C1 does not activate public center profiles.

Public activation remains blocked until minimum profile gates exist, including:

- approved primary category
- approved public contact
- location/address readiness
- bilingual name/copy readiness or approved fallback policy
- verification/compliance review

## 15. Migration file naming

Recommended future migration filename:

`0054_healthcare_verticals_center_categories.sql`

Only use this number if no other migration has landed first. If another migration lands, use the next available number and update validators accordingly.

## 16. Validator updates

The future TAX-C1 DB PR must update migration validators if the project requires an exact migration list.

Expected validator changes:

- add the new migration filename to required migration list
- ensure forbidden seed/insert rules are respected
- ensure no existing migration is edited
- ensure no RLS policy is introduced in TAX-C1 if RLS is deferred

## 17. Acceptance criteria for future TAX-C1 DB PR

The future DB implementation is acceptable only if:

- it adds only the three approved tables
- it adds reasonable indexes and checks
- it adds updated_at triggers
- it does not seed rows
- it does not add RLS policies unless explicitly approved
- it does not modify existing migrations
- it updates validators if required
- migration validation passes
- typecheck/build/lint pass
- static RLS and seed tests pass

## 18. Stop conditions

Stop future implementation if:

- a new category is hardcoded in UI instead of modeled
- existing migrations would need editing
- seeds are requested without a seed plan
- RLS is requested without a dedicated RLS phase or explicit approval
- public activation is requested before profile gates exist
- healthy food or veterinary is requested as public without schema.org and product-scope review
- insurance or license authority seed data is requested from memory

## 19. Next step after this plan

Recommended next implementation sequence:

1. `TAX-C1-DB`: add migration only, no seed, no RLS, no UI.
2. `TAX-RLS-A`: add public read/admin-safe RLS policies for taxonomy tables.
3. `TAX-SEED-A`: approve initial bilingual vertical/category seed list.
4. `TAX-SEED-B`: implement approved seed data only.
5. `CENTER-TAX-A`: add admin category assignment UI for centers.

Do not skip directly to public category pages.
