# 05c_DATABASE_EXECUTION_PATCH_AND_VALIDATION_V10.md

# Database Execution Patch and Validation V10

## 1. Merge Rule
This document must be used as a validation and patch checklist against `05b_DATABASE_FULL_DDL_V10.sql.md`.

For fresh local/pre-production setup, merge fixes into the base DDL before first migration.

Do not run old DDL and then expect enum corrections to remove values.

## 2. event_owner_type Rule
`event_owner_type` must not include `ad_campaign`.

Paid ad telemetry belongs in `ad_events`, not `events`.

If an old DB already created event_owner_type with `ad_campaign`, do not casually drop/recreate enum. Stop and make a dedicated migration plan.

## 3. FK Ordering Rule
`payments.receipt_media_asset_id` must be a plain UUID until `media_assets` exists. Add FK after media_assets is created.

## 4. Doctor Branch Consistency
`doctor_centers.organization_id` must match `centers.organization_id`.
Server-side insert logic must derive or validate organization_id from the referenced center. Do not trust the client.

## 5. Events RLS Rule
`events` has baseline admin read. Center owner event read policies are later and must be tenant-safe. Do not expose analytics to owners until tested.

## 6. Validation Checklist
Before migrations:
- indexed tables exist
- indexed columns exist
- trigger targets exist
- updated_at trigger targets have updated_at
- FK targets exist or FK is added after target table
- invoice/card default functions exist before table defaults need them
- `doctor_centers` exists before indexes
- `subscriptions` has updated_at/activated_at/expired_at/cancelled_at
- `audit_logs` has request_id
- `events` direct insert is revoked from anon/authenticated
- no duplicate canonical table definitions exist

# V10 CANONICAL ADDITION — Mandatory Migration Execution Order

Claude Code must follow this exact migration construction order when generating Supabase migrations.

## Canonical Migration Order

1. Extensions
   - `pgcrypto`
   - `postgis`
2. ENUM types and domain-level controlled types
3. Tables without foreign keys or with only `auth.users` references
4. Core identity and organization tables
5. Directory tables
6. Business, CRM, monetization, ledger, media, patient offers and article tables
7. Deferred foreign keys that depend on tables created later
8. Indexes
9. Utility functions
10. Trigger functions
11. Table triggers
12. RPC transaction functions
13. RLS helper functions
14. Enable RLS on tables
15. RLS policies
16. Explicit GRANT/REVOKE review
17. Seed data, only if explicitly approved for the phase

## Ordering Guardrails

- Every indexed table must exist before its index is created.
- Every indexed column must exist before its index is created.
- Every trigger target table must exist before the trigger is created.
- Every `updated_at` trigger target table must have an `updated_at` column.
- Foreign keys to tables created later must be added via `ALTER TABLE` after both tables exist.
- `payments.receipt_media_asset_id` foreign key must be added after `media_assets` exists.
- `doctor_centers` must exist before any `idx_doctor_centers_*` indexes are created.
- `event_owner_type` must not include `ad_campaign` in the canonical V10 schema.
- Paid ad telemetry belongs in `ad_events`, not `events`.

## Merge vs Incremental Rule

`05c_DATABASE_EXECUTION_PATCH_AND_VALIDATION_V10.md` and later execution patches must be merged into the canonical DDL before the first executable migration is generated.

Incremental fallback is allowed only for safe additive changes.

Incremental fallback is not safe for ENUM corrections when the old enum has already been created.

For local/pre-production:

- merge corrections into canonical DDL
- reset local database
- recreate schema from corrected canonical DDL

For production:

- stop
- create a dedicated migration plan
- never casually drop/recreate enum types

## Phase 1 DDL Validation Checklist

Before running migrations, Claude Code must verify:

1. every indexed table exists
2. every indexed column exists
3. every trigger target table exists
4. every updated_at trigger target table has updated_at
5. every referenced enum exists before use
6. every referenced table exists before FK creation
7. changelog claims match actual DDL
8. no duplicate canonical table definitions exist
9. public.events has no direct anon/authenticated INSERT policy
10. public.ad_events remains separate from public.events
11. offer claim codes and invoice numbers use canonical DB functions
12. doctor_centers exists before its indexes are created
13. payments receipt FK is added after media_assets exists
14. profile_roles uses `profile_role_type`, not free text


# V10 CANONICAL DATABASE DECISIONS

## Subscription Lifecycle
Canonical MVP subscription statuses are exactly:
- `pending`
- `active`
- `suspended`
- `expired`
- `cancelled`

`trial` is not enabled in MVP. Claude Code must not add `trial` unless the user explicitly approves a trial feature and updates the enum, billing logic, UI labels and tests together.

## Billing RPC Placeholder Rule
The three billing RPCs may remain placeholder stubs only before the billing phase:
- `create_manual_subscription_transaction`
- `approve_manual_payment_and_activate_subscription`
- `create_balanced_ledger_transaction`

If Claude Code implements billing UI or payment approval in Phase 7, these RPCs become blockers and must be implemented with ledger balance checks, audit logs, transaction safety, and role restrictions.

## RLS Rule
Every application table must have RLS enabled in the first executable migration. Policies may be introduced phase by phase, but no client route may depend on an unprotected table.

# V10 Growth / Reviews / AI / Reporting Validation Addendum

Before migration is accepted, validate that these tables exist:
- reviews
- review_votes
- review_reports
- center_review_responses
- review_moderation_events
- ai_chat_sessions
- ai_chat_messages
- ai_chat_leads
- offer_claims
- center_scorecards
- center_analytics_daily
- center_monthly_reports
- sales_activities
- sales_proposals
- center_contracts

Validate that RLS is enabled on all V10 added tables.

Validate that direct public writes are not allowed to:
- moderation tables
- AI message internals
- center analytics
- reports
- sales proposals
- contracts

Review creation must insert pending only.
Review approval/publication must be admin/server action only.
AI chat must not expose cross-user sessions.
Offer redemption must be center/admin scoped and audited.

The rolling one-review-per-user-per-center-per-90-days rule must be enforced in server logic; do not fake it with an unsafe PostgreSQL expression unique index.


## Advertising validation

Before any advertising implementation, validate that these tables exist: `ad_placements`, `ad_campaigns`, `ad_creatives`, `ad_wallets`, `ad_wallet_transactions`, `ad_events`, `ad_placement_bookings`, `ad_pricing_rules`.

Validate that RLS is enabled for all ad tables, public read is limited to active placement metadata only, and all campaign/wallet/billing/event management is admin/server-action controlled until a safe center self-service RPC layer is explicitly implemented.

## V10 Ad DDL Completion Rule

`05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md` is mandatory. Claude Code must validate it immediately after this file. The ad system is not implementation-ready unless these tables exist: `ad_placements`, `ad_campaigns`, `ad_creatives`, `ad_wallets`, `ad_wallet_transactions`, `ad_events`, `ad_placement_bookings`, `ad_pricing_rules`.

Required `ad_campaigns` fields: `campaign_type`, `daily_budget`, `total_budget`, `spent_amount`, `wallet_id`, `creative_id`, `bid_amount`, `flat_price`, `status`, `review_notes`, `approved_by`, `approved_at`.

Required `ad_events` fields: `placement_id`, `creative_id`, `idempotency_key`, `billed_amount`, `fraud_score`, `is_billable`, `is_billed`, `metadata`.

Canonical `listing_status` values are exactly: `draft`, `published`, `hidden`, `archived`. Do not use `active` or `pending_review` as listing statuses.

## V10.3 Canonical Override Notice
Validation references to `doctor_centers` apply only to legacy V10 compatibility. V10.3 implementation must validate `doctor_practice_locations` as the canonical writable relation. If `doctor_centers` exists, it must not become a second writable source of truth.
