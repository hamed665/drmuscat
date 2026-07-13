# Import Readiness Execution Roadmap after PR #933

Tracking issue: #934

## Purpose

This document is the repository source of truth for completing controlled import and publication without duplicating the existing Pharmacy backend, rollback path, family registry, route registry, geo authority, SEO eligibility, sitemap eligibility, or internal-link infrastructure.

The implementation order is strict. Later waves must not be opened early merely to create activity. A pull request is complete only when its behavior, safety boundary, tests, readback, and required hosted checks are green.

## Merge policy

Every implementation pull request must satisfy all checks relevant to its scope before merge:

- focused unit tests;
- integration tests for cross-boundary behavior;
- static contract checks;
- migration-current validation for database changes;
- RLS, grants, and RPC privilege validation for database changes;
- compatibility checks for changed RPC signatures and audit schema versions;
- concurrency and replay tests where state can be written twice;
- persistence readback for every write path;
- exact recovery verification for rollback paths;
- `pnpm import:publish-readiness-audit:validate`;
- `pnpm typecheck`;
- `pnpm lint`;
- `pnpm build`;
- all required GitHub Actions green;
- Vercel green.

A write path must not merge without readback. A rollback path must not merge without exact logical recovery verification. A public promotion path must not merge before the Pharmacy Admin Preview canary and integrity report are green.

## Invariants

1. One authority exists for each concept. Existing reservation, snapshot, private mutation, rollback, registry, route, geo, SEO, sitemap, duplicate, and relation authorities are extended rather than copied.
2. Raw authorization or rollback secrets never enter Server Action results, React state, hydration payloads, HTML, forms, browser storage, URLs, logs, analytics, tracing attributes, or displayable errors.
3. Review represents the exact canonical patch that mutation will execute. No hidden field mutation is allowed.
4. Authorization is bound to actor, entity, family, review identity, snapshot hash, entity fingerprint, expected version, patch hash, request hash, operation scope, and expiry.
5. Authorization consumption and reservation creation happen in one transaction.
6. Public visibility, index eligibility, and sitemap inclusion are separate promotions.
7. Bulk reuses the proven single-entity executor and remains blocked until single-entity recovery is repeatedly proven.

## Wave 0 — Repair current security and contract debt

### 0.1 Remove authorization material from the Client boundary

- Remove the raw authorization envelope from Server Action result types and return values.
- Return only bounded status: unavailable, ready, expired, invalidated, or consumed, plus expiry.
- Keep reservation and mutation disabled.
- Add static checks proving token and nonce cannot be serialized or rendered.

### 0.2 Canonical reviewed mutation patch

- Build one canonical Pharmacy mutation patch.
- Generate the persisted Review diff from that patch.
- Include every field the existing mutation writer can change.
- Define stable normalization for absent values, nulls, empty strings, locale, country, metadata patching, and key ordering.
- Persist or deterministically reconstruct patch hash and request hash.
- Reject any mutation key outside the allowlist.

### 0.3 Preserve metadata and locale

- Replace destructive metadata replacement with an allowlisted merge.
- Preserve canonical geo, projection version, unrelated metadata, and required evidence.
- Stop forcing the locale to English.
- Add publish and rollback tests for metadata and locale parity.

### 0.4 Stable operation identity

- Stop generating a fresh reservation identity on every runtime-context load.
- Persist or deterministically derive one idempotency identity per actor/entity/review/operation/patch.
- Refresh, retries, back navigation, and multiple tabs must resolve the same attempt.

## Wave 1 — Server-owned authorization

### 1.1 Extend existing authorization persistence

Extend the existing table rather than adding a parallel subsystem. Add review state, family, expected version, patch hash, request hash, operation scope, lifecycle status, invalidation fields, consumed reservation, and timestamps.

Supported lifecycle:

```text
issued -> consumed
issued -> invalidated
issued -> expired
```

Do not add a persisted claimed state.

### 1.2 Invalidation and bounded readback

- A new Review invalidates the previous active authorization for the same actor/entity/operation.
- Fingerprint, expected-version, patch-hash, request-hash, expiry, or scope changes invalidate old authorization.
- Only one active authorization may exist for one actor/entity/review/operation identity.
- UI receives bounded status only.

## Wave 2 — Atomic reservation

### 2.1 Extend `import_publish_reserve_snapshot_audit`

The existing RPC must atomically:

1. lock and verify the active authorization;
2. verify Preview, actor, entity, Pharmacy family, Review, snapshot, fingerprint, expected version, patch hash, request hash, operation scope, and expiry;
3. resolve replay or conflict by stable idempotency identity;
4. create one reservation;
5. capture one rollback snapshot;
6. append `reservation_created` using a new audit schema version;
7. consume and link authorization to the reservation;
8. commit.

Any failure must leave zero reservation, zero snapshot, zero audit, an unconsumed authorization, and an unchanged entity.

Old audit readers remain compatible. New writes use `reservation_created`; `execution_started` is reserved for mutation time.

### 2.2 Admin reservation operation and readback

Operation: `reserve_private_publish`

Confirmation: `RESERVE PRIVATE PUBLISH <entity-id>`

Readback must prove exactly one linked reservation, snapshot, reservation audit, consumed authorization, matching hashes and version, no duplicate, no orphan, no audit gap, and no entity mutation.

## Wave 3 — Existing Pharmacy private executor

### 3.1 Admin wiring and publish readback

Operation: `private_publish`

Confirmation: `EXECUTE PRIVATE PUBLISH <entity-id>`

The Admin path resolves the verified reservation and calls the existing guarded Pharmacy executor. It must not execute independent SQL mutation logic.

The mutation transaction appends `execution_started`, applies the reviewed canonical patch, persists the terminal result and audit, and creates or resolves the existing durable rollback reference.

Readback must verify the terminal state, before/after versions, exact bounded patch, protected metadata preservation, private/noindex/no-sitemap/no-route state, one durable rollback authority, no duplicate execution, and no public leakage.

## Wave 4 — Existing rollback path

### 4.1 Durable rollback authority hardening

Use the existing durable publish reference rather than adding a second rollback-authorization subsystem. Keep the raw reference server-side, bind it to the publish terminal identity and current version, and consume it atomically in rollback.

Confirmation: `ROLLBACK PRIVATE PUBLISH <entity-id>`

### 4.2 Exact recovery

Compare the original logical state with post-rollback state. All bounded entity fields, publication state, locale, country, canonical path, projection version, metadata content, relation state included by the snapshot contract, and deletion/sort state must match.

Only append-only audit/history timestamps, updated version metadata, rollback metadata, and consumed authority states may differ.

## Wave 5 — Admin state machine and canary

Keep `/admin/imports/readiness` and the existing design system.

The UI sequence is:

1. Dry-run
2. Exact Review
3. Authorization ready
4. Reserve
5. Reservation verified
6. Private publish
7. Publish verified
8. Rollback
9. Exact recovery verified
10. Bounded audit history

Add server-authoritative refresh, stale-state detection, expiry countdowns, double-submit protection, replay versus fresh-success display, multi-tab collision handling, and safe retry only for readback. Never auto-retry reservation, mutation, or rollback.

Run one real Preview Pharmacy through the entire Admin path without bypass. Produce an integrity report requiring zero orphan authorizations, reservations, snapshots, references, duplicate operations, audit gaps, unfinished executions, state mismatches, public/search/sitemap exposure, secret leakage, or unrestricted payload leakage.

## Wave 6 — Registry convergence before public route activation

Audit and document the authoritative mapping:

```text
ImportEntityType
-> PublicEntityFamily
-> PublicProviderRouteFamily
-> database storage family
-> SEO profile
-> schema projection
-> relation policy
-> sitemap family
```

Mark each mapping supported, planned, disabled, or unsupported. Extend existing registries only. Do not create routes, placeholders, category pages, or sitemap entries in this audit.

## Wave 7 — Pharmacy public lifecycle

1. Independent `public/noindex` promotion authorization and snapshot.
2. Enable the approved bilingual public route while keeping robots noindex and sitemap excluded.
3. Verify English and Arabic URLs, canonical, reciprocal hreflang, structured data, content completeness, links, mobile rendering, errors, query count, HTML/JS size, and the repository's existing performance budget.
4. Promote independently to index after all live checks pass.
5. Promote independently to sitemap after canonical-only, lastmod, index, duplicate, redirect, locale, and sitemap-eligibility checks pass.

Each promotion has an independent rollback path.

## Wave 8 — Intake convergence and core families

Audit Manual, CSV, Excel, API, and AI-assisted ingestion. All must converge into Unified Draft, canonical geo, evidence, duplicate detection, readiness, exact Review, and controlled publish. Direct entity-table writes and entrypoint-specific publication logic are forbidden.

Then complete the same lifecycle for Hospital followed by Doctor. Hospital and Doctor use the shared transaction and authorization authorities with family adapters; they do not receive copied reservation, authorization, or rollback subsystems.

## Wave 9 — Shared core and later families

Extract a generic controlled-publish core only after Pharmacy, Hospital, and Doctor are fully proven. Preserve their behavior during extraction.

Extend the existing family, capability, SEO, route, schema, relation, internal-link, and nearby registries for additional healthcare facilities, medical beauty, non-medical beauty, veterinary medical, pet retail/services, fitness, home healthcare, and ambulance.

Only verified relations may create public internal links. Geographic proximity alone never creates an organizational relation.

## Final wave — Bulk

Bulk remains blocked until at least ten successful private publishes, ten successful rollbacks, complete Pharmacy/Hospital/Doctor lifecycles, several additional facility canaries, and zero duplicate, orphan, audit-gap, public-leakage, or recovery findings.

Bulk uses per-entity jobs, concurrency initially equal to one, pause/cancel/kill-switch controls, bounded read retries, no automatic retry for ambiguous mutations, and the exact same single-entity executor. There is no blind Publish All control.

## Explicitly stopped

Do not add:

- independent claim or claim-recovery lifecycle;
- browser bearer-secret handoff;
- encrypted authorization cookies or server-memory custody as a substitute for persisted authority;
- parallel reservation, private publish, rollback, family, SEO, route, or sitemap subsystems;
- direct Excel publish;
- Hospital and Doctor implementation in parallel;
- public/index before the Pharmacy Admin canary;
- placeholder or empty category routes;
- public links from candidate relations;
- organizational inference from proximity;
- Bulk Publish or Publish All before the final wave;
- unrelated keyword, LLM-content, Search Console, or sitemap automation.

## Current next implementation

The next implementation PR removes authorization material from the Server Action/client boundary while keeping reservation and mutation disabled. The immediately following PR converges Review and the exact mutation patch. No execution capability opens before both are complete and green.