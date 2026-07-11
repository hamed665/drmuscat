# DrKhaleej Controlled Publish Dry-Run Executor

## Purpose

This phase adds a deterministic dry-run planner for one controlled publish request. It produces a reviewable request hash, field-level change plan, rollback preview, and audit preview without writing to the database.

## Required upstream readiness

A dry-run plan is ready only when:

- the controlled single publish contract is ready;
- executor infrastructure is ready;
- the protected persistence schema is ready;
- exactly one entity, actor, idempotency key, expected version, and current version are present;
- expected and current versions match;
- current rollback state is complete;
- desired canonical route and projection version are present.

## Deterministic request hash

The planner canonicalizes the request payload by recursively sorting object keys and generates a SHA-256 request hash. Equivalent requests produce the same hash regardless of object key insertion order.

The hash is a preview only. This phase does not reserve an idempotency key or persist anything.

## Change and rollback previews

The plan lists only fields that would change. The rollback preview preserves the complete pre-mutation state:

- visibility;
- index policy;
- sitemap policy;
- publish status;
- public-ready state;
- projection version;
- canonical route.

## Audit preview

The plan produces a `dry_run_reviewed` audit preview with a pending outcome, schema version, entity, actor, idempotency key, expected/current versions, and request hash.

It does not insert an audit event. Humans apparently need both a preview of the paperwork and explicit confirmation that the preview is not the paperwork.

## Safety boundary

- Dry-run only.
- No database reads or writes.
- No idempotency reservation.
- No rollback snapshot persistence.
- No audit event persistence.
- No publish mutation.
- No server action or Admin button.
- No public route or sitemap behavior.
- No bulk publish.

`planReady` remains separate from `executionReady`. This phase always returns `executionReady: false`, `mutationEnabled: false`, `bulkAllowed: false`, and an empty database operation list.
