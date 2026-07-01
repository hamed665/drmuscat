# Supabase warning hardening backlog

This document tracks the remaining Supabase Security Advisor warning work after the soft-launch profile SEO gate sequence.

It is a tracking and operating contract, not a runtime migration.

## Completed in code

### PR 687: function search path hardening

Status: merged.

Covered item:

- `public.set_updated_at()` now has an explicit function search path through migration `0066_function_search_path_hardening.sql`.
- The migration is validated by `scripts/db/check-security-function-search-path.mjs`.
- The current migration validator runs the legacy migration inventory first, then validates current-only migrations separately.

### PR 688: sensitive helper search path hardening

Status: merged.

Covered item:

- Sensitive helper functions now have explicit helper search paths through migration `0067_sensitive_helper_search_path_hardening.sql`.
- The migration is validated by `scripts/db/check-sensitive-helper-search-path.mjs`.
- This PR intentionally did not change function execution privileges.

## Remaining manual-review items

### Function execution privilege hardening

Status: pending manual DB review.

Reason for manual review:

- Several helper functions are used inside RLS policies.
- Removing broad callable access incorrectly can break valid authenticated reads.
- The safe order is to inventory function signatures, confirm which helpers are policy-only, confirm client RPC usage is absent, then apply the privilege change in a dedicated migration.

Required review before a migration:

- Confirm every sensitive helper signature from migrations.
- Confirm whether each helper is used by RLS policy code, server code, client RPC, or only internal database policy logic.
- Keep authenticated policy use working.
- Keep service-role maintenance paths working.
- Do not add table changes, public policies, seed data, or feature changes in the same PR.

Functions currently treated as sensitive helpers include:

- `current_profile_id()`
- `is_platform_admin()`
- `is_provider_user()`
- `is_patient_user()`
- `is_active_center_member(uuid)`
- `can_manage_center(uuid)`
- `can_view_center_private_data(uuid)`
- `can_view_patient_contact(uuid)`
- `can_view_appointment(uuid)`
- `can_view_review_private(uuid)`
- `can_view_review_report(uuid)`
- `can_view_media_asset_private(uuid)`
- `can_view_entity_media_private(uuid)`
- `can_view_center_subscription(uuid)`
- `can_view_sponsored_campaign(uuid)`
- `can_view_sponsored_placement_private(uuid)`
- `can_view_consent_log(uuid)`
- `can_view_audit_log(uuid)`

### Extension schema hardening

Status: pending manual DB review.

Reason for manual review:

- Moving extensions out of the public schema is a database placement change.
- Before applying it, the project must confirm there is no unqualified usage of extension-provided functions, operators, or operator classes.
- Repository search did not show current usage of `unaccent`, `pg_trgm`, or `gin_trgm_ops`, but the final check must happen against the actual database and generated SQL surfaces too.

Required review before a migration:

- Confirm whether `pg_trgm` and `unaccent` are installed in the public schema.
- Confirm no generated SQL, database function, index, or search helper depends on unqualified extension symbols.
- Move extensions only in a dedicated migration.
- Add a validator that checks the migration and blocks unrelated table, policy, seed, or feature changes.

## Launch interpretation

Security Advisor Errors remain launch blockers.

Warnings may remain during soft launch only when tracked here or in a successor security backlog.

No warning in this document approves public ranking, ratings, booking claims, insurance claims, open-now claims, native profile sitemap expansion, GEO/index expansion, provider self-editing public copy, claim workflow launch, or sponsored ranking.

## Next safe order

1. Run manual DB review for function execution privileges.
2. Add a dedicated privilege migration only after the review is complete.
3. Run manual DB review for extension schema placement.
4. Add a dedicated extension schema migration only after usage is confirmed safe.
5. Re-run Supabase Security Advisor.
6. Update this backlog with remaining warning count and exact completed PRs.
