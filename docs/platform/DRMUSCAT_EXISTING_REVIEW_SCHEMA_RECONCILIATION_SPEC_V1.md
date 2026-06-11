# DrMuscat Existing Review Schema Reconciliation Spec V1

## Status and Authority

- Status: Documentation-only.
- Authority: Existing review schema reconciliation and future migration decision support only.
- This document does not authorize implementation.
- This document does not authorize SQL migration creation.
- This document does not authorize altering existing review tables.
- This document does not authorize dropping existing review policies.
- This document does not authorize generated type updates.
- This document does not authorize source code changes.
- This document does not authorize UI/API/routes/server actions.
- Future implementation requires separate `PHASED_BUILD_ONLY` approval.

## Four-Axis Mapping

- Execution Phase: Phase 1 — Review Schema Reconciliation / documentation alignment only
- Lock Scope: Review schema reconciliation only
- Product Module: Reviews & Ratings
- Subphase ID: `RECONCILE-EXISTING-REVIEW-SCHEMA-V1`

## 1. Purpose

This spec reconciles the existing implemented review schema with the newer review planning specs before any further review database migration is attempted.

It identifies:

- existing review tables
- existing review enums/types
- existing review relationships
- existing indexes
- existing triggers
- existing RLS enablement
- existing policies
- existing grants
- conflicts with the new fail-closed review foundation plan
- gaps between the existing schema and the target conceptual review model
- safe future paths

This document is based on direct inspection of existing migrations and review planning documents. It must not be treated as approval to create or alter database objects.

## 2. Existing Review Schema Inventory

### 2.1 `public.reviews`

Source migration: `supabase/migrations/0020_reviews.sql`.

#### Table existence

- `public.reviews` already exists via `CREATE TABLE IF NOT EXISTS public.reviews`.

#### Enum dependencies

- `review_target_type` is created as an enum with values:
  - `center`
  - `doctor`
  - `service`
- `review_status` is created as an enum with values:
  - `pending`
  - `approved`
  - `rejected`
  - `hidden`
  - `flagged`
- `source_locale` uses the existing `app_locale` type.

#### Fields

- `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `target_type review_target_type NOT NULL`
- `center_id uuid NULL REFERENCES public.centers(id)`
- `doctor_id uuid NULL REFERENCES public.doctors(id)`
- `center_service_id uuid NULL REFERENCES public.center_services(id)`
- `doctor_service_id uuid NULL REFERENCES public.doctor_services(id)`
- `appointment_id uuid NULL REFERENCES public.appointments(id)`
- `patient_contact_id uuid NULL REFERENCES public.patient_contacts(id)`
- `rating smallint NOT NULL`
- `title text NULL`
- `body text NULL`
- `status review_status NOT NULL DEFAULT 'pending'`
- `source_locale app_locale NOT NULL DEFAULT 'en'`
- `is_verified boolean NOT NULL DEFAULT false`
- `is_featured boolean NOT NULL DEFAULT false`
- `submitted_at timestamptz NOT NULL DEFAULT now()`
- `approved_at timestamptz NULL`
- `rejected_at timestamptz NULL`
- `metadata jsonb NOT NULL DEFAULT '{}'::jsonb`
- `created_at timestamptz NOT NULL DEFAULT now()`
- `updated_at timestamptz NOT NULL DEFAULT now()`
- `deleted_at timestamptz NULL`

#### Foreign keys

- `center_id` references `public.centers(id)`.
- `doctor_id` references `public.doctors(id)`.
- `center_service_id` references `public.center_services(id)`.
- `doctor_service_id` references `public.doctor_services(id)`.
- `appointment_id` references `public.appointments(id)`.
- `patient_contact_id` references `public.patient_contacts(id)`.

#### Constraints

- `reviews_rating_check`: `rating >= 1 AND rating <= 5`.
- `reviews_target_presence_check`: at least one of `center_id`, `doctor_id`, `center_service_id`, or `doctor_service_id` must be present.

#### Indexes

- `reviews_target_type_idx` on `(target_type)`.
- `reviews_center_id_idx` on `(center_id)` where `center_id IS NOT NULL`.
- `reviews_doctor_id_idx` on `(doctor_id)` where `doctor_id IS NOT NULL`.
- `reviews_center_service_id_idx` on `(center_service_id)` where `center_service_id IS NOT NULL`.
- `reviews_doctor_service_id_idx` on `(doctor_service_id)` where `doctor_service_id IS NOT NULL`.
- `reviews_appointment_id_idx` on `(appointment_id)` where `appointment_id IS NOT NULL`.
- `reviews_patient_contact_id_idx` on `(patient_contact_id)` where `patient_contact_id IS NOT NULL`.
- `reviews_status_idx` on `(status)`.
- `reviews_rating_idx` on `(rating)`.
- `reviews_is_verified_idx` on `(is_verified)`.
- `reviews_submitted_at_idx` on `(submitted_at)`.
- `reviews_deleted_at_idx` on `(deleted_at)` where `deleted_at IS NOT NULL`.

#### Triggers

- `trg_reviews_set_updated_at` is created if absent.
- It runs `BEFORE UPDATE ON public.reviews`.
- It executes `public.set_updated_at()`.

#### Rating/status model

- Rating is stored directly on `public.reviews.rating` as a required `smallint` with a 1–5 check.
- Status is stored as `review_status`, defaulting to `pending`.
- There is no separate rating-dimension table in this migration.

#### Verification flags

- Verification is represented by `is_verified boolean NOT NULL DEFAULT false`.
- No separate verification evidence table is created by this migration.

#### Locale/source fields

- `source_locale app_locale NOT NULL DEFAULT 'en'` records the source locale.
- No separate `language`, `locale`, or `country` columns are present in this migration.

#### `deleted_at` behavior

- `deleted_at timestamptz NULL` exists.
- A partial index exists for non-null `deleted_at` values.
- Existing policies reference `deleted_at IS NULL` for select access.

### 2.2 `public.review_reports`

Source migration: `supabase/migrations/0021_review_reports.sql`.

#### Table existence

- `public.review_reports` already exists via `CREATE TABLE IF NOT EXISTS public.review_reports`.

#### Enum dependencies

- `review_report_reason` is created as an enum with values:
  - `spam`
  - `offensive`
  - `fake`
  - `irrelevant`
  - `privacy`
  - `medical_claim`
  - `other`
- `review_report_status` is created as an enum with values:
  - `open`
  - `under_review`
  - `resolved`
  - `dismissed`

#### Fields

- `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `review_id uuid NOT NULL REFERENCES public.reviews(id)`
- `reported_by_profile_id uuid NULL REFERENCES public.profiles(id)`
- `reported_by_patient_contact_id uuid NULL REFERENCES public.patient_contacts(id)`
- `reason review_report_reason NOT NULL DEFAULT 'other'`
- `status review_report_status NOT NULL DEFAULT 'open'`
- `note text NULL`
- `reviewed_by_profile_id uuid NULL REFERENCES public.profiles(id)`
- `reviewed_at timestamptz NULL`
- `resolved_at timestamptz NULL`
- `metadata jsonb NOT NULL DEFAULT '{}'::jsonb`
- `created_at timestamptz NOT NULL DEFAULT now()`
- `updated_at timestamptz NOT NULL DEFAULT now()`
- `deleted_at timestamptz NULL`

#### Foreign keys

- `review_id` references `public.reviews(id)`.
- `reported_by_profile_id` references `public.profiles(id)`.
- `reported_by_patient_contact_id` references `public.patient_contacts(id)`.
- `reviewed_by_profile_id` references `public.profiles(id)`.

#### Indexes

- `review_reports_review_id_idx` on `(review_id)`.
- `review_reports_reported_by_profile_id_idx` on `(reported_by_profile_id)` where `reported_by_profile_id IS NOT NULL`.
- `review_reports_reported_by_patient_contact_id_idx` on `(reported_by_patient_contact_id)` where `reported_by_patient_contact_id IS NOT NULL`.
- `review_reports_reason_idx` on `(reason)`.
- `review_reports_status_idx` on `(status)`.
- `review_reports_reviewed_by_profile_id_idx` on `(reviewed_by_profile_id)` where `reviewed_by_profile_id IS NOT NULL`.
- `review_reports_created_at_idx` on `(created_at)`.
- `review_reports_deleted_at_idx` on `(deleted_at)` where `deleted_at IS NOT NULL`.

#### Triggers

- `trg_review_reports_set_updated_at` is created if absent.
- It runs `BEFORE UPDATE ON public.review_reports`.
- It executes `public.set_updated_at()`.

#### Report reason/status model

- Report reason is stored as the `review_report_reason` enum, defaulting to `other`.
- Report status is stored as the `review_report_status` enum, defaulting to `open`.

#### `deleted_at` behavior

- `deleted_at timestamptz NULL` exists.
- A partial index exists for non-null `deleted_at` values.
- Existing policies reference `deleted_at IS NULL` for select access.

## 3. Existing Review RLS and Policy Inventory

Migration inspection found RLS enablement and select policies for existing review tables. No direct `GRANT` statement to `anon` or `authenticated` involving `reviews` or `review_reports` was found in the inspected migrations. No generated public view/projection involving reviews was found in the inspected migrations.

### 3.1 RLS enablement

| Migration | Table | Statement | Notes |
| --- | --- | --- | --- |
| `0032_rls_public_catalog_read_policies.sql` | `public.reviews` | `ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;` | Enables RLS before public catalog read policies. |
| `0040_reviews_reports_media_private_rls.sql` | `public.reviews` | `ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;` | Re-enables/ensures RLS before private select policy creation. |
| `0040_reviews_reports_media_private_rls.sql` | `public.review_reports` | `ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;` | Enables/ensures RLS before private select policy creation. |

### 3.2 Existing policies

| Policy name | Table | Command | Roles | USING condition | WITH CHECK condition | Public read? | Authenticated private access? | Conflict level with fail-closed future model |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `reviews_public_select` | `public.reviews` | `FOR SELECT` | `anon`, `authenticated` | `deleted_at IS NULL AND status = 'approved'` | None found | Yes | Also applies to authenticated as public-style read | Blocker for any future claim that existing `public.reviews` is fail-closed. |
| `reviews_select_private_allowed` | `public.reviews` | `FOR SELECT` | `authenticated` | `public.can_view_review_private(id) = true AND deleted_at IS NULL` | None found | No anon public read; authenticated scoped private read | Yes | High conflict with a no-policy foundation posture, but it may be intentional legacy/current private behavior. |
| `review_reports_select_allowed` | `public.review_reports` | `FOR SELECT` | `authenticated` | `public.can_view_review_report(id) = true AND deleted_at IS NULL` | None found | No | Yes | High conflict with a no-policy foundation posture, but it may be intentional legacy/current private behavior. |

### 3.3 Helper functions used by policies

Migration `0039_review_media_access_helpers.sql` defines review/report/media private read helper functions used by later policies:

- `public.can_view_review_private(target_review_id uuid)`.
- `public.can_view_review_report(target_review_report_id uuid)`.

These helpers are not policies, but they are part of the current access-control behavior for existing review tables.

### 3.4 Grants and views/projections

- No direct `GRANT` statement involving `public.reviews` or `public.review_reports` to `anon` or `authenticated` was found in inspected migrations.
- No `CREATE VIEW`, `CREATE OR REPLACE VIEW`, or materialized view/projection involving review data was found in inspected migrations.
- The policy `reviews_public_select` itself explicitly targets `anon` and `authenticated`, so public read behavior exists through policy even without a direct grant statement in the reviewed migration files.

### 3.5 Policies not found

- No policy named `provider_review_replies_*` was found because `provider_review_replies` does not exist in the current inspected schema.
- No policies were found for the future-only review companion tables listed in the newer review planning specs because those tables do not exist yet in the current inspected schema.

## 4. Current State Mismatch

`docs/project-state/CURRENT_STATE.md` previously stated that the completed migration set was `0001` through `0050` and that migration validation was expected through `0050_provider_onboarding_leads.sql`.

The repository contains `supabase/migrations/0051_landing_page_contents.sql`. That migration appears to be an accepted landing content foundation because it contains a header for a landing content migration foundation, creates `public.landing_page_contents`, and enables RLS on that table without creating access policies in that migration.

This mismatch must be acknowledged in `CURRENT_STATE.md`. Future migration numbering must follow the actual repository file order rather than stale state text.

## 5. Conflict Analysis Against New Review Specs

The newer review planning specs describe a richer and fail-closed review foundation for future reviews, ratings, moderation, reports, disputes, provider replies, fraud signals, eligibility snapshots, aggregate snapshots, audit events, and policy references. The existing implemented schema already has `public.reviews` and `public.review_reports`, plus select policies.

| Area | Existing state | New spec expectation | Conflict level | Notes | Future decision needed |
| --- | --- | --- | --- | --- | --- |
| Existing `reviews` vs planned `reviews` | `public.reviews` already exists with `target_type`, direct entity FKs, required `rating`, `review_status`, `source_locale`, `is_verified`, `is_featured`, metadata, timestamps, and soft delete. | New foundation plan expected to create `reviews` with broader private review lifecycle fields, nullable body, moderation/verification/risk fields, eligibility flags, and fail-closed posture. | Blocker | A duplicate `reviews` table cannot be created. Rewriting existing table in place would be risky and outside documentation-only scope. | Decide whether to evolve existing table additively or create differently named v2 tables. |
| Existing `review_reports` vs planned `review_reports` | `public.review_reports` already exists with enum reason/status, reporter profile/patient contact FKs, note, reviewer, metadata, timestamps, and soft delete. | New plan expected richer report fields such as role, report type/reason/details, assignment, resolution, escalation, and future status model. | Blocker | A duplicate `review_reports` table cannot be created. | Decide whether to add columns additively or introduce v2 table names. |
| Enum strategy | Existing review migrations use PostgreSQL enums for target/status/reason/report status. | New foundation plan prefers text/check constraints unless repository convention strongly favors enums. | Medium | Repo has existing enum usage, but new review specs lean toward safer text/check constraints for evolving workflows. | Decide whether review compatibility patches continue enum strategy or use text/check for new companion tables. |
| Rating strategy | Existing `reviews.rating smallint NOT NULL` with 1–5 check. | New plan separates rating dimensions into `review_ratings` with `numeric(3,2)`, `rating_scale`, eligibility, and exclusion fields. | High | Existing table has a single required overall rating and no dimension model. | Decide whether to add `review_ratings` companion table keyed to existing `reviews`. |
| Verification strategy | Existing `reviews.is_verified boolean NOT NULL DEFAULT false`. | New plan expects richer `review_verifications` evidence metadata, statuses, evidence privacy, invitations/leads/appointments, and expiry/rejection fields. | High | Current boolean cannot represent evidence lifecycle. | Decide whether to add `review_verifications` companion table and how to map existing `is_verified`. |
| Provider reply missing | No `provider_review_replies` table found. | New plan expects provider replies separate from reviews. | High | Missing future feature foundation. | Add only after compatibility plan approves table naming and FK to existing or v2 reviews. |
| Moderation events missing | No `review_moderation_events` table found. | New plan expects append-only moderation events. | High | Existing status fields do not provide event history. | Add companion event table in a future migration if approved. |
| Disputes missing | No `review_disputes` table found. | New plan expects formal dispute records. | High | Existing reports are not full disputes. | Add companion dispute table if approved. |
| Fraud signals missing | No `review_fraud_signals` table found. | New plan expects private fraud/abuse signals. | High | No equivalent current table found. | Add companion fraud signal table if approved. |
| Eligibility snapshots missing | No `review_eligibility_snapshots` table found. | New plan expects derived eligibility snapshots defaulting false. | High | No current eligibility snapshot foundation found. | Add companion eligibility table if approved. |
| Aggregate snapshots missing | No `review_aggregate_snapshots` table found. | New plan expects derived aggregate summaries for reviewable entities. | High | No aggregate snapshot foundation found. | Add companion aggregate snapshot table if approved. |
| Audit events missing | No `review_audit_events` table found. | New plan expects private audit events. | High | Generic audit logs may exist elsewhere, but no review-specific audit table was found in review migrations. | Decide whether review-specific audit is required or whether existing audit logs are canonical. |
| Policy versions missing | No `review_policy_versions` table found. | New plan expects policy version references used by review decisions. | High | No current policy version table found for reviews. | Add policy version table if approved. |
| RLS existing policies vs fail-closed plan | Existing `reviews` and `review_reports` have RLS and select policies. | New foundation plan expected RLS enabled with no policies for new review foundation tables. | Blocker | Existing access behavior prevents treating current review tables as newly fail-closed. | Any hardening must be a separate RLS decision PR after product impact review. |
| Public select policy | `reviews_public_select` allows `anon` and `authenticated` SELECT where `deleted_at IS NULL AND status = 'approved'`. | New fail-closed foundation expected no public read through policies. | Blocker | Public read is already implemented for approved reviews. | Decide whether public review display is intended legacy/current behavior or should be hardened in a separate RLS PR. |
| Migration numbering mismatch | State docs said completed migrations through `0050`; repo contains `0051_landing_page_contents.sql`. | Future migrations must use actual latest migration order. | Medium | State documentation was stale relative to repository files. | Update `CURRENT_STATE.md` and follow repository migration order for future PRs. |

## 6. Safe Future Path Options

### Option A — Evolve Existing Review Tables

- Keep `public.reviews` and `public.review_reports`.
- Add missing companion tables only.
- Add columns to existing tables only through carefully approved patch migrations.
- Preserve backward compatibility.
- Review and potentially harden existing policies separately.

Pros:

- Avoids duplicate canonical review tables.
- Preserves existing FKs, indexes, triggers, generated types, and runtime assumptions.
- Supports incremental migration and lower operational risk.

Cons:

- Requires a careful compatibility map from old fields to new conceptual fields.
- Existing enum strategy may constrain future statuses.
- Existing public/private select policies remain a separate security decision.

Risks:

- Additive columns can still affect generated types and validation gates.
- Policy hardening could break public catalog behavior if not planned separately.
- Existing required `rating` may conflict with future draft or no-rating review flows.

### Option B — Add Review V2 Tables

- Leave existing `reviews` and `review_reports` untouched.
- Create new `review_*` v2/foundation tables with different names.
- Later migrate/cut over if needed.

Pros:

- Allows fail-closed V2 design without mutating existing tables immediately.
- Avoids immediate policy changes on legacy/current tables.
- Can model the newer specs more directly.

Cons:

- Introduces naming and canonical-source ambiguity.
- Requires future migration/cutover logic and data reconciliation.
- Increases generated type and code complexity when implementation begins.

Risks:

- Duplicate review concepts can create product confusion.
- Public SEO/schema rules may accidentally read from the wrong source later.
- Requires strict documentation of legacy vs v2 ownership.

### Option C — Freeze Existing Review Implementation and Defer Reviews

- Do not implement the new review system yet.
- Keep existing tables as legacy/current baseline.
- Continue other product areas.

Pros:

- Lowest immediate database and security risk.
- Avoids changing existing review behavior until a full decision is approved.
- Keeps current product scope narrow.

Cons:

- Review planning specs remain unimplemented.
- Missing moderation, disputes, fraud, eligibility, aggregate, audit, policy-version, and provider-reply foundations remain unresolved.
- Future review work will still require reconciliation.

Risks:

- Stale schema may drift further from the approved future model.
- Existing public select behavior may remain misaligned with future fail-closed expectations.

## 7. Recommended Decision

Recommended safety posture:

- Do not create a duplicate `reviews` table.
- Do not create a duplicate `review_reports` table.
- Do not drop or rewrite existing review tables.
- Do not alter existing policies in the same PR as foundation expansion.
- Treat the next implementation step as a documentation-approved compatibility patch plan first.
- After that plan is approved, use a narrow migration that adds only missing companion tables or safe additive columns.
- Any policy hardening must be a separate RLS PR after exact existing policies and product impact are documented.

Given the current inspection, Option A appears safest as the default next implementation direction if the product owner wants to preserve current table names and avoid v2 ambiguity. However, this document does not choose or authorize implementation. A separate `PHASED_BUILD_ONLY` approval must select the path before any schema change.

Because an existing public `reviews_public_select` policy was found, any decision to remove, narrow, or replace that policy must be handled in a separate RLS hardening decision PR, not as an immediate destructive change in a schema foundation PR.

## 8. Next Approved PR Sequence

Recommended sequence:

1. Existing Review Schema Reconciliation Spec V1 — this PR.
2. Review Compatibility Patch Plan Spec V1.
3. Review Companion Tables Migration V1 or Review Existing Tables Additive Patch Migration V1, depending on the approved path.
4. Review Generated Types Update.
5. Review RLS Policy Hardening / Access Alignment.
6. Review RLS Tests.
7. Admin Read-Only Moderation Queue.

## 9. CURRENT_STATE Update Requirements

`docs/project-state/CURRENT_STATE.md` must be updated only to reflect accurate current state.

Required minimal updates:

- Completed migration set should acknowledge `0051_landing_page_contents.sql` because it exists in the repository.
- Database foundations should acknowledge validation through `0051_landing_page_contents.sql` if that is the actual latest migration.
- Data/RLS foundations should note that legacy/current review foundations already exist:
  - `0020_reviews.sql`
  - `0021_review_reports.sql`
- Data/RLS foundations should note that further review system work is blocked until existing review schema reconciliation is approved.
- Unrelated state sections should not be rewritten.
- The update must not claim that a new review implementation was added.

## 10. Explicit Non-Implementation

This reconciliation does not include:

- no migrations
- no SQL changes
- no table changes
- no RLS changes
- no policy changes
- no grants
- no generated types
- no source code
- no API
- no server actions
- no UI
- no routes
- no schema
- no seed data
- no analytics/tracking
- no public Persian/Hindi routes

## 11. Completion Report Requirements

The final report for this documentation-only phase must include:

- Files created/changed.
- Confirmation documentation-only.
- Confirmation no migrations/SQL/table/RLS/policy/grants changed.
- Confirmation no generated types/source/API/UI/routes changed.
- Existing review tables found.
- Existing review policies found or not found.
- `CURRENT_STATE.md` updates made.
- Conflict summary.
- Recommended future path.
- Validation results.
- Blockers/conflicts.

## Rollback Notes

Rollback for this PR is documentation-only:

- Remove `docs/platform/DRMUSCAT_EXISTING_REVIEW_SCHEMA_RECONCILIATION_SPEC_V1.md`.
- Revert the small `docs/project-state/CURRENT_STATE.md` state alignment edits.
- Revert the optional README link if present.

No database rollback is required because this PR must not create migrations or alter schema/RLS/policies.
