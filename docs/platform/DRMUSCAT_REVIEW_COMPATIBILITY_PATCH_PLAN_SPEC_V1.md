# DrMuscat Review Compatibility Patch Plan Spec V1

## Status and Authority

- Status: Documentation-only.
- Authority: Existing review schema compatibility planning only.
- This document does not authorize implementation.
- This document does not authorize SQL migration creation.
- This document does not authorize altering existing review tables.
- This document does not authorize altering RLS policies.
- This document does not authorize generated type updates.
- This document does not authorize source code/API/UI/routes/server actions.
- Future implementation requires separate PHASED_BUILD_ONLY approval.

## Four-Axis Mapping

- Execution Phase: Phase 1 — Review Compatibility Patch Planning / documentation alignment only
- Lock Scope: Review compatibility patch planning only
- Product Module: Reviews & Ratings
- Subphase ID: `PLAN-REVIEW-COMPATIBILITY-PATCH-V1`

## 1. Purpose

This spec defines the safe compatibility path for evolving the existing review schema without creating duplicate `reviews` or `review_reports` tables.

It must:

- choose a recommended future path;
- preserve existing tables;
- avoid destructive schema rewrites;
- define additive patch strategy;
- define companion table strategy;
- define RLS hardening sequencing;
- define generated types sequencing;
- define validation requirements;
- define rollback requirements;
- define stop conditions.

No implementation is authorized by this document.

## 2. Existing Baseline Summary

The current repository already includes the following review baseline:

- `public.reviews` exists.
- `public.review_reports` exists.
- Existing review enums exist for review targets/statuses and report reasons/statuses.
- Existing review/report indexes and update triggers exist.
- An existing public select policy exists for approved reviews.
- Existing authenticated private select policies exist for private review/report access.
- Helper functions exist for review/report private access.
- The current table model stores `rating` directly on `reviews`.
- The current table model does not have separate moderation events, provider replies, disputes, fraud signals, eligibility snapshots, aggregate snapshots, audit events, or policy versions.

The exact current inventory is intentionally not repeated here. Use `docs/platform/DRMUSCAT_EXISTING_REVIEW_SCHEMA_RECONCILIATION_SPEC_V1.md` as the canonical reconciliation inventory for the existing schema, policies, helpers, and compatibility blockers.

## 3. Decision: Recommended Compatibility Path

Recommended path: **Option A — Evolve Existing Review Tables Additively + Add Missing Companion Tables**.

This means:

- Do not create a duplicate `reviews` table.
- Do not create a duplicate `review_reports` table.
- Do not drop existing review tables.
- Do not rewrite existing review enums in place.
- Do not remove existing policies in the same migration as schema expansion.
- Preserve existing app behavior until a dedicated RLS hardening phase.
- Add missing companion tables in a future migration.
- Add safe additive columns to existing tables only where necessary and low-risk.
- Harden RLS in a later dedicated PR after generated types and compatibility patch are reviewed.

Option A is preferred because it aligns the newer review specs with the existing database reality, avoids destructive or duplicate core tables, preserves current public/admin assumptions, and creates a safer migration path through additive schema expansion followed by separate generated type and RLS review phases.

| Option | Pros | Cons | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| Option A — Evolve existing review tables additively + add missing companion tables | Preserves `public.reviews` and `public.review_reports`; avoids duplicate table names; minimizes data loss risk; allows incremental review of schema, types, and RLS; keeps current behavior stable until hardening. | Requires careful compatibility naming; leaves some legacy enum/status meanings in place; requires multiple follow-up PRs for types, RLS, UI/API, and moderation workflows. | Medium, because additive changes still require careful validation but avoid destructive rewrites. | Recommended. |
| Option B — Review V2 tables | Avoids touching existing review tables immediately; can model the newer specs cleanly from scratch. | Creates parallel review domains; risks source/API ambiguity; requires migration/sync decisions; may duplicate `reviews` semantics; can confuse RLS, generated types, reporting, and future public projections. | High, because parallel tables create long-term product and data ambiguity. | Not recommended unless Option A becomes impossible due to verified schema conflicts. |
| Option C — Freeze/defer reviews | Avoids immediate database risk; no schema changes now. | Does not resolve reconciliation blockers; leaves newer review specs without an implementation path; delays moderation, eligibility, reply, and aggregate planning; creates future drift. | Medium to High, because unresolved drift grows over time. | Not recommended as the primary path; acceptable only as a temporary stop if blockers appear. |

## 4. Compatibility Patch Scope

A future implementation migration should be limited to:

A. Additive columns on `public.reviews`.
B. Additive columns on `public.review_reports`.
C. New companion tables only.
D. Conservative indexes for new columns/tables.
E. RLS enabled on new companion tables with no policies.
F. No changes to existing policies.

Explicitly out of scope for the future compatibility migration:

- dropping or renaming existing columns;
- changing existing enum values;
- dropping existing policies;
- altering the existing public select policy;
- generated types update;
- UI/API implementation;
- Review/AggregateRating schema;
- public views/projections;
- seed data.

## 5. Proposed Additive Columns for `public.reviews`

A future compatibility migration may plan these safe additive columns only:

- `moderation_status text`
- `verification_status_v2 text`
- `risk_level text`
- `contains_medical_sensitive_content boolean not null default false`
- `contains_private_data boolean not null default false`
- `contains_abuse boolean not null default false`
- `contains_defamation_risk boolean not null default false`
- `last_moderated_at timestamptz`
- `moderated_by_profile_id uuid`
- `rejection_reason_v2 text`
- `blocked_reason text`
- `privacy_action_required boolean not null default false`
- `dispute_status text`
- `schema_eligible boolean not null default false`
- `rating_eligible boolean not null default false`
- `public_visibility_v2 boolean not null default false`

Rules:

- Do not rename existing `status`.
- Do not remove existing `is_verified`.
- Do not change existing `rating`.
- Use `_v2` suffix only where necessary to avoid conflicts with existing column names/meaning.
- Default safety flags must be fail-closed.
- New eligibility fields default false.
- Any FK to `profiles` must be verified before implementation.
- If FK target is unclear, future migration must use a UUID column without FK and document the pending FK decision.

## 6. Proposed Additive Columns for `public.review_reports`

A future compatibility migration may plan these safe additive columns only:

- `reported_by_role text`
- `report_type text`
- `report_details text`
- `assigned_to_profile_id uuid`
- `resolution_v2 text`
- `escalation_type text`
- `privacy_sensitive boolean not null default true`
- `safe_status_summary text`

Rules:

- Do not rename existing `reason`.
- Do not rename existing `status`.
- Do not remove existing `note`.
- Do not remove existing reviewer/reporting references.
- New privacy-sensitive fields default private.
- Keep existing behavior stable.

## 7. Proposed New Companion Tables

A future migration may add these missing companion tables:

- `review_policy_versions`
- `review_moderation_events`
- `review_disputes`
- `provider_review_replies`
- `review_fraud_signals`
- `review_eligibility_snapshots`
- `review_aggregate_snapshots`
- `review_audit_events`

Do not add:

- duplicate `reviews`;
- duplicate `review_reports`;
- `review_ratings` in the first compatibility patch unless explicitly approved, because existing `reviews.rating` already exists;
- `review_verifications` in the first compatibility patch unless explicitly approved, because existing `is_verified` exists and the evidence model needs a separate privacy decision;
- `review_notification_events`.

| Companion table | Purpose | Key conceptual fields | Dependency | RLS default | Public/private default | First compatibility migration? | Risk level |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `review_policy_versions` | Record review policy/version references used by future moderation, eligibility, and schema decisions. | Policy version label, effective dates, status, notes, created metadata. | None beyond verified naming and lifecycle rules. | RLS enabled, no policies. | Private by default. | Include if needed to anchor moderation/eligibility decisions; otherwise defer. | Medium |
| `review_moderation_events` | Store append-only moderation history outside the mutable `reviews.status` field. | Review ID, event type, prior/new states, actor profile UUID, reason, metadata, created timestamp. | Existing `public.reviews`; optional profile reference must be verified. | RLS enabled, no policies. | Private by default. | Include. | Medium |
| `review_disputes` | Track formal provider/user/admin disputes related to a review. | Review ID, opened by role/profile UUID, dispute status, reason, resolution, timestamps. | Existing `public.reviews`; actor profile FK must be verified or left as UUID. | RLS enabled, no policies. | Private by default. | Include only if dispute workflow foundation is approved for the compatibility migration; otherwise defer. | Medium-High |
| `provider_review_replies` | Store provider replies separately from user review content. | Review ID, provider/center/doctor reference, reply body, status, moderation fields, timestamps. | Existing `public.reviews`; provider ownership model must be verified. | RLS enabled, no policies. | Private until a later public projection/RLS phase. | Defer unless provider reply foundation is explicitly approved. | High |
| `review_fraud_signals` | Store private abuse/fraud/risk signals and evidence metadata. | Review ID, signal type, severity/risk level, source, metadata, created by, timestamps. | Existing `public.reviews`; evidence privacy decision required. | RLS enabled, no policies. | Private by default. | Include only if privacy-safe field boundaries are approved; otherwise defer. | High |
| `review_eligibility_snapshots` | Capture derived review/rating/schema eligibility at a point in time. | Review ID, schema eligibility, rating eligibility, public visibility eligibility, reasons, policy version, calculated timestamp. | Existing `public.reviews`; optional `review_policy_versions`. | RLS enabled, no policies. | Private by default until a later projection decision. | Include if aggregate/schema sequencing requires it; otherwise defer. | Medium |
| `review_aggregate_snapshots` | Store derived aggregate rating summaries for reviewable entities. | Target type/reference, rating counts, average rating, eligibility inputs, snapshot timestamp, policy version. | Existing `public.reviews`; eligibility strategy must be confirmed. | RLS enabled, no policies. | Private by default; public display requires later approval. | Defer until review volume, eligibility, and public display rules are approved. | High |
| `review_audit_events` | Store review-specific audit trail for sensitive administrative or automated decisions. | Entity type/ID, action, actor profile UUID, reason, metadata, created timestamp. | Actor profile FK must be verified or left as UUID; may overlap with generic audit logs. | RLS enabled, no policies. | Private by default. | Include only if no existing canonical audit log covers review events; otherwise defer and document mapping. | Medium |

## 8. RLS and Policy Strategy

- Existing `reviews_public_select` must not be changed in the compatibility schema patch PR.
- Existing `reviews_select_private_allowed` must not be changed in the compatibility schema patch PR.
- Existing `review_reports_select_allowed` must not be changed in the compatibility schema patch PR.
- All new companion tables must have RLS enabled.
- No policies should be created for new companion tables in the compatibility schema patch PR.
- Policy hardening must be a separate dedicated PR.
- Public projections/views must not be created yet.
- No grants to anon/authenticated should be added.

Schema expansion and access-control changes should not be mixed. Keeping them separate makes rollback easier, lowers public access risk, and allows generated types review to happen before any policy hardening changes can expose, hide, or reinterpret data. New companion tables should therefore be fail-closed by enabling RLS without adding access policies in the compatibility schema patch PR.

## 9. Generated Types Strategy

- Generated types should not be updated in the compatibility patch migration PR unless repository convention requires same-PR type updates.
- Preferred sequence:
  1. compatibility patch migration;
  2. generated types update PR;
  3. RLS hardening PR.
- If generated types are updated in the same PR, the diff must be strictly limited to review schema additions.
- Any unexpected `public.Views` change must stop the task.

## 10. Validation Strategy

A future compatibility migration PR must run:

- `git status --short`
- `git diff --check`
- `pnpm env:check`
- `pnpm db:validate:migrations`
- `pnpm test:db:rls`
- `pnpm typecheck`
- `pnpm build`
- `pnpm lint`

If any command is unavailable:

- report the exact command;
- report the reason;
- do not fake pass.

If migration changes only SQL, still run repository migration and RLS static validations.

## 11. Rollback Strategy

Future migration rollback must:

- avoid destructive changes;
- be additive wherever possible;
- not drop existing review data;
- not drop existing policies;
- not alter public behavior;
- allow forward-fix if rollback of columns is unsafe;
- include rollback notes in the PR body;
- stop if rollback cannot be reasoned about.

## 12. Stop Conditions for Future Compatibility Migration

Stop if:

- existing review schema differs from the reconciliation spec;
- expected columns already exist with incompatible types;
- enum or status conflict appears;
- FK target is unclear;
- generated types change unexpectedly;
- any source/API/UI file changes;
- any existing policy changes;
- any grant to anon/authenticated appears;
- any public view/projection appears;
- migration validation fails;
- RLS static test fails;
- route/build/typecheck/lint fails unexpectedly.

## 13. Future PR Sequence

Recommended sequence:

1. This compatibility patch plan spec.
2. Review Compatibility Additive Migration V1.
3. Review Generated Types Update V1.
4. Review RLS Policy Hardening Plan or Implementation V1.
5. Review RLS Positive/Negative Tests V1.
6. Review Admin Read-Only Moderation Queue V1.
7. Review Submission UI V1.
8. Provider Reply UI V1.
9. Aggregate Rating Display only after maturity.
10. AggregateRating schema only after explicit approval.

## 14. Explicit Non-Implementation

This document includes:

- no migrations;
- no SQL changes;
- no table changes;
- no RLS changes;
- no policy changes;
- no grants;
- no generated types;
- no source code;
- no API;
- no server actions;
- no UI;
- no routes;
- no schema;
- no seed data;
- no analytics/tracking;
- no public Persian/Hindi routes.

## 15. Completion Report Requirements

The final report for this phase must include:

- files created/changed;
- confirmation documentation-only;
- confirmation no migrations/SQL/table/RLS/policy/grants changed;
- confirmation no generated types/source/API/UI/routes changed;
- recommended compatibility path;
- proposed additive columns summary;
- proposed companion tables summary;
- RLS sequencing summary;
- generated types sequencing summary;
- validation results;
- blockers/conflicts.
