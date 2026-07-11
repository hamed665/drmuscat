# DrKhaleej Reservation Canary Integration Harness

## Purpose

This harness exercises the private Supabase publish persistence adapter with a deterministic Fake RPC client before any preview database integration is allowed.

It covers these adapter outcomes:

- reserved / replayed / conflict / failed

## Boundaries

- No database connection.
- No Supabase client construction.
- No environment-variable access.
- No network request.
- No entity mutation.
- No terminal persistence.
- No public route, projection, visibility, index, or sitemap mutation.
- No Admin action or button.
- No bulk publish.

## Fake RPC client

The injected client records the RPC name and returns one synthetic payload for each scenario. The real adapter then performs the same response normalization and fail-closed mapping used by future server-only integration code.

Each scenario must call exactly one fake RPC named `import_publish_reserve_snapshot_audit`.

## Expected scenarios

- `reserved` returns the reservation, rollback snapshot, and audit identifiers.
- `replayed` returns the existing terminal result without creating a second reservation.
- `conflict` normalizes an idempotency request mismatch.
- `failed` normalizes a synthetic RPC error to `rpc_failed`.

The harness does not enable reservation-only mode and does not alter the hard-disabled execution flags.
