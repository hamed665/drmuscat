# Preview Migration Sync

## Scope

This prerequisite infrastructure synchronizes one isolated Supabase Preview database from repository migrations. It does not connect to, migrate, store, or otherwise use a Production database URL. It does not publish, index, add sitemap entries, or activate any public entity.

## Required repository secrets

- `PREVIEW_DATABASE_URL`: PostgreSQL direct or Session Pooler URL for the isolated Preview project, port `5432` only.
- `PREVIEW_PROJECT_REF`: isolated Preview project reference.
- `PRODUCTION_PROJECT_REF`: Production project reference used only as a non-secret identity inequality guard. No Production database URL is permitted.

The workflow fails before any write when refs are missing/equal, the URL does not identify the configured Preview project, the port is not `5432`, or the Production ref appears in the URL.

## Execution model

1. Check out the exact pull-request SHA.
2. Validate the repository migration sequence and static RLS contract.
3. Run the identity preflight before any write.
4. Acquire a repository-wide GitHub Actions concurrency slot.
5. Acquire a PostgreSQL advisory lock.
6. Run `supabase db push --include-all` against the isolated Preview URL. A blank database bootstraps from `0001` through current; later runs apply only missing migrations according to the Supabase migration ledger.
7. Verify the ledger exactly equals repository versions, with no gap or extra repository-shaped version.
8. Inventory public schema objects, RLS state, and public RPC signatures and write only hashes/counts to the evidence artifact.
9. Upload a red or green artifact anchored to the exact SHA.

Raw CLI stdout is discarded. Any bounded stderr included on failure is scrubbed for PostgreSQL URLs. Secrets and connection strings must never be added to source, logs, artifacts, PR text, or chat.

## Fail-closed boundaries

- No transaction-pooler port `6543`.
- No Production URL secret or runtime variable.
- No concurrent Preview migration write.
- No merge while Preview Migration Sync is red or missing.
- No manual SQL in Supabase.
- No P04+ hosted proof before the exact-head migration sync is green.

## Dependency

P04-A PR #950 remains Draft until this prerequisite is merged and Preview Migration Sync plus the P04-A hosted proof are green on its final exact SHA.
