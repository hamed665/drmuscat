# Import Readiness Status After Manifest

This document captures the current import-readiness state after the runner was moved behind a manifest-driven contract.

## Current status

The import-readiness chain is now controlled by one workflow entrypoint and one manifest:

- workflow: `.github/workflows/import-readiness-contract.yml`
- runner: `scripts/import/run-import-readiness.mjs`
- manifest: `fixtures/import/import-readiness-runner.manifest.json`

The runner reads the manifest and executes the import-readiness checks in a fixed order. The manifest is validated by `scripts/import/check-import-readiness-runner-manifest.mjs`, and the workflow is guarded by `scripts/import/check-import-readiness-workflow-runner.mjs`.

## Public exposure status

Imported hospitals remain blocked from public release.

Allowed during this phase:

- contract checks;
- fixture checks;
- bridge-alignment checks;
- runtime preflight checks;
- dependency implementation checklist checks;
- doctor/pharmacy readiness preparation.

Not allowed during this phase:

- imported hospital detail page returning `200`;
- imported hospital directory discovery;
- imported hospital sitemap URLs;
- imported hospital internal related-provider links;
- a family-specific parallel public catalog that bypasses the unified provider projection.

## Passing readiness gates represented by the manifest

The manifest currently covers these gates:

1. runner manifest guard;
2. workflow runner guard;
3. import readiness status after manifest;
4. first-batch bridge runtime path decision;
5. tsx dependency implementation preflight;
6. tsx implementation checklist;
7. imported hospital public hold;
8. first-batch dry-run fixture validation;
9. generated fixture check;
10. first-batch generator bridge alignment;
11. first-batch bridge runtime preflight;
12. import public release preflight;
13. combined smoke.

## Remaining work before real import promotion

The next wave must be dependency/runtime focused, not public-surface focused:

1. add the pinned `tsx` dependency with `pnpm add -D tsx`;
2. commit the generated `pnpm-lock.yaml` change in the same PR;
3. prove that path in CI without changing public behavior;
4. restore the bridge smoke as an executable TypeScript smoke;
5. connect the first-batch generator to the real bridge;
6. keep the generated fixture output stable;
7. add doctor/pharmacy-only promotion gates;
8. keep hospitals blocked until a separate hospital hold retirement PR.

## Decision

The current state is `no_go` for imported hospital public release and `ready_for_tsx_dependency_implementation` for the next import-readiness step.

This is intentionally boring. Boring is what we call safety before it gets expensive.
