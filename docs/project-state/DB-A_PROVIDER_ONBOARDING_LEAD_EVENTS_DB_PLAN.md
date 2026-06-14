# DB-A — Provider Onboarding Lead Events Database/RLS Plan

## 1. Purpose

DB-A is a documentation-only database/RLS planning phase for a future `provider_onboarding_lead_events` companion table. The goal is to define the safest future schema, constraint, index, RLS, server, and admin UI direction before any database implementation occurs.

Four-axis mapping for this planning phase:

- Execution Phase: Phase 2 — Database Core and RLS planning, supporting Phase 4 admin foundation workflows.
- Lock Scope: Documentation-only project-state planning; no database, RLS, route, UI, server action, or validator changes.
- Product Module: Phase 1 — Database, Phase 2 — RLS/Security, and Phase 6 — Admin Foundation planning for provider onboarding lead history.
- Subphase ID: DB-A.

DB-A explicitly does not:

- Create migrations.
- Update generated Supabase types.
- Add RLS policies.
- Implement admin UI/actions.
- Add notes/audit writes.

## 2. Current baseline

Current implemented baseline confirmed for this planning phase:

- `public.provider_onboarding_leads` exists.
- Protected admin provider onboarding lead list/detail exists.
- Admin provider onboarding lead status/priority mutation exists.
- `handled_at` may be set by ADM-B under the minimal handled-status rule.
- No `public.provider_onboarding_lead_events` table exists.
- No provider onboarding lead notes table exists.
- No provider onboarding lead-specific audit/history table exists.
- Generic `public.audit_logs` exists.
- Generic audit-log read access exists through platform-admin-only helper/policy infrastructure.
- Review-domain companion tables exist, including `review_moderation_events` and `review_audit_events`, but they are review-specific and are not suitable for provider onboarding lead history.
- Assignment, conversion, contact-action, and public publishing remain out of scope.

## 3. Why a companion event table is needed

`provider_onboarding_leads` should remain the current-state row for lead intake and workflow status. It should not become the storage location for historical notes or detailed action history.

A future `provider_onboarding_lead_events` table is needed because:

- `provider_onboarding_leads` should store the current lead state only.
- `provider_onboarding_lead_events` should store historical admin actions.
- `provider_onboarding_leads.metadata` must not be used for notes/history because JSON metadata is harder to validate, query, secure, and display consistently.
- Future conversion into candidate/provider records needs historical context before creating downstream records.
- Admin notes must stay private and admin-only.
- Future audit/history should be queryable, chronological, and append-only from application code.

## 4. Proposed table name

Recommended future table name:

```sql
public.provider_onboarding_lead_events
```

This is the preferred future table name unless a later DB implementation PR finds a hard conflict during migration design or validation.

## 5. Proposed columns

Recommended future columns:

| Column | Proposed definition | Purpose |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Stable event identifier for admin history rows. |
| `lead_id` | `uuid not null references public.provider_onboarding_leads(id) on delete cascade` | Connects each event to one provider onboarding lead; cascade keeps companion history tied to the lead lifecycle. |
| `actor_profile_id` | `uuid null references public.profiles(id)` | Identifies the platform admin profile that created the event when available. Nullable to allow system/backfill cases only if later approved. |
| `event_type` | `text not null` | Machine-readable event discriminator for timeline rendering and validation. |
| `old_status` | `text null` | Previous lead status for `status_changed` events. |
| `new_status` | `text null` | New lead status for `status_changed` events. |
| `old_priority` | `text null` | Previous lead priority for `priority_changed` events. |
| `new_priority` | `text null` | New lead priority for `priority_changed` events. |
| `note_text` | `text null` | Private admin note body for `note_added` events only. |
| `metadata` | `jsonb not null default '{}'::jsonb` | Reserved structured metadata for future tightly scoped server-generated context; not a notes store. |
| `created_at` | `timestamptz not null default now()` | Immutable event creation timestamp for chronological history. |

## 6. Event types

Recommended first implementation `event_type` values:

- `status_changed`
- `priority_changed`
- `note_added`

Optional future event types, explicitly out of scope for the first implementation:

- `assignment_changed`
- `conversion_started`
- `conversion_completed`
- `contact_logged`

The first implementation should not include optional future event types unless a later task explicitly expands scope.

## 7. Constraints

Minimum recommended future constraints:

- `event_type IN ('status_changed', 'priority_changed', 'note_added')`.
- `old_status` and `new_status` must be `NULL` or one of:
  - `new`
  - `reviewing`
  - `contacted`
  - `qualified`
  - `rejected`
  - `converted`
  - `closed`
- `old_priority` and `new_priority` must be `NULL` or one of:
  - `low`
  - `normal`
  - `high`
- `note_text` must be `NULL` or must satisfy all of:
  - `char_length(btrim(note_text)) BETWEEN 1 AND 1000`
  - no HTML/script-like content, using the same conservative pattern style already used by provider onboarding lead text constraints.
- `metadata jsonb not null default '{}'::jsonb`.
- `created_at timestamptz not null default now()`.
- `lead_id uuid not null`.

Optional event-specific constraints:

- `status_changed` must have `new_status`.
- `priority_changed` must have `new_priority`.
- `note_added` must have `note_text`.
- `note_added` should not require status or priority columns.
- `status_changed` and `priority_changed` should not require `note_text`.

Recommendation: if event-specific database constraints become too complex for the first migration, start with simple conservative database constraints and enforce detailed event-shape validation in server-side TypeScript. The database should still reject invalid enum-like values, blank notes, and HTML/script-like note text.

## 8. Indexes

Recommended future indexes:

- `provider_onboarding_lead_events_lead_id_created_at_idx` on `(lead_id, created_at DESC)`.
  - Supports the admin lead detail page history timeline for a single lead.
- `provider_onboarding_lead_events_actor_profile_id_idx` on `(actor_profile_id) WHERE actor_profile_id IS NOT NULL`.
  - Supports future admin accountability/debug views by actor without indexing null-only rows.
- `provider_onboarding_lead_events_event_type_idx` on `(event_type)`.
  - Supports filtering or counting status changes, priority changes, and notes.
- `provider_onboarding_lead_events_created_at_idx` on `(created_at DESC)`.
  - Supports future admin chronological review, diagnostics, or export workflows if explicitly approved.

## 9. RLS posture options

### Option A — RLS enabled with no direct client policies

- Enable RLS on `public.provider_onboarding_lead_events`.
- Add no anon policies.
- Add no authenticated policies.
- Access the table only through server-side service-role admin functions.
- Require `requirePlatformAdmin` before server-side reads/writes.

Benefits:

- Safest initial posture for private notes/history.
- Mirrors the conservative posture used by current provider onboarding leads and review companion foundations.
- Avoids client-side write surface.
- Keeps future policy design phase-gated.

Risks/tradeoffs:

- Admin UI must use server-side helpers/actions.
- Direct authenticated Supabase client reads/writes are unavailable.

### Option B — authenticated platform-admin SELECT/INSERT policies

- Enable RLS on `public.provider_onboarding_lead_events`.
- Add SELECT and INSERT policies for authenticated platform admins only.
- Use helper functions and explicit RLS validation.

Benefits:

- More flexible for direct authenticated admin access if a later architecture requires it.
- Could reduce service-role-only helper surface in some future workflows.

Risks/tradeoffs:

- Larger security surface.
- Policy bugs could leak private notes.
- Requires dedicated helper functions and RLS validation updates.
- Must be explicitly approved as an RLS phase before implementation.

## 10. Recommended RLS posture

Recommend Option A for the first implementation:

- RLS enabled.
- No direct anon/authenticated access policies initially.
- No grants to anon/authenticated unless explicitly approved.
- Server-side service-role access only after `requirePlatformAdmin`.

Rationale:

- Private notes/history are sensitive operational records.
- Client-side writes must be avoided.
- Admin UI can read/write through server-side admin helpers/actions.
- Direct authenticated policies can be added later in a dedicated RLS phase if needed.

## 11. Future migration requirements

A future DB implementation PR should:

- Create a new migration file with the next sequential migration number.
- Create `public.provider_onboarding_lead_events`.
- Add comments explaining the private/admin-only purpose.
- Add the recommended constraints and indexes.
- Enable RLS.
- Avoid public grants.
- Avoid anon/authenticated policies unless explicitly approved.
- Update migration validators if required by repo convention.
- Update generated Supabase types if the project workflow requires checked-in generated types.
- Run DB and RLS validation commands.

Do not pick the migration number in this document. The future implementation PR should use the next sequential migration number based on the repository state at that time.

## 12. Future server implementation requirements

Future server-side implementation should:

- Call `requirePlatformAdmin` first.
- Use the service-role Supabase client only server-side.
- Write event rows after a successful status/priority mutation.
- Write `note_added` only from an approved admin-only note action.
- Never write notes into `provider_onboarding_leads.metadata`.
- Reject HTML/script-like note text.
- Enforce note length server-side.
- Never expose raw database errors.
- Reject event writes for deleted leads unless explicitly approved.
- Prefer obtaining `actor_profile_id` from the `requirePlatformAdmin` result.
- Keep event writes append-only from application code; no edit/delete UI should be added in the first implementation.

## 13. Future UI requirements

Future admin UI may include:

- A private “Lead history” section on the lead detail page.
- Status/priority updates that create event rows.
- A private admin note form.
- Clear labeling that private notes are admin-only.

Future admin UI must not add:

- Notes on public pages.
- Provider-facing notes.
- Contact buttons.
- Conversion buttons.
- Publish buttons.
- Billing controls.
- Verified badge controls.

## 14. Privacy boundaries

Future implementation must preserve these privacy boundaries:

- Admin notes may contain sensitive operational context.
- Admins should avoid medical claims, diagnoses, patient data, or unnecessary personal data in notes.
- Notes are not provider-facing messages.
- Event history must not be exposed to public APIs.
- Event history must not be exposed to provider APIs.
- Future exports should exclude private notes unless explicitly approved.

## 15. Validation requirements for future DB implementation

A future DB implementation PR must run:

- `pnpm db:validate:migrations`
- `pnpm test:db:rls`
- `pnpm routes:check`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

If generated types are updated, use the documented project command if one exists at that time. This DB-A phase did not confirm an exact checked-in generated-types command beyond the validation gate reference to `db:types`/Supabase type generation, so a future implementation PR should confirm the exact command before updating generated types.

## 16. Risks and blockers

Known risks and blockers:

- Bad event table design can make history unqueryable.
- Weak actor identity makes the audit trail unreliable.
- Too-broad RLS can leak private notes.
- Using `provider_onboarding_leads.metadata` for notes/audit is risky.
- Implementing notes before the event table creates messy history.
- Conversion should wait for the event/history foundation.
- Public publishing remains out of scope.
- Contact-action remains out of scope.
- Assignment remains out of scope.

## 17. Recommended next sequence

After DB-A:

- DB-B: implement `provider_onboarding_lead_events` migration with conservative RLS posture.
- ADM-D: read-only private lead history UI.
- ADM-E: private admin note add action.
- ADM-F: wire status/priority mutation to write history events.
- DATA-A: candidate/provider conversion model plan.
- DATA-B: lead-to-candidate conversion implementation only after DATA-A.
- SEED-A: real seed/import phase only after explicit approval.

## 18. Validation for DB-A

Because DB-A is documentation-only, required validation for this phase is:

- `pnpm routes:check`
- `pnpm typecheck`
- `pnpm lint`

Validation results must be reported honestly in the PR and final response. If validation is skipped or fails, do not claim success.
