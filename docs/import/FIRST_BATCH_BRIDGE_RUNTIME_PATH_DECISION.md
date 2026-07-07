# First Batch Bridge Runtime Path Decision

This document selects the runtime path for executing the first-batch TypeScript dry-run bridge from CI.

## Decision

Use `tsx` as the TypeScript execution path for the first-batch dry-run bridge smoke.

This PR does not add the dependency. It only records and guards the decision. The dependency and the first CI smoke must land in a separate PR so the lockfile and workflow behavior can be reviewed independently.

## Why not compile first

The repository TypeScript configuration is optimized for Next.js and type checking:

- `compilerOptions.noEmit` is enabled;
- `moduleResolution` is `bundler`;
- path aliases use `@/*`;
- the bridge imports internal TypeScript modules from `src/server/admin`.

A compile-first bridge runner would need a separate emit tsconfig, alias handling, and generated output hygiene before it could be reliable.

## Why `tsx`

`tsx` is selected because it can execute TypeScript entrypoints directly in Node-oriented CI scripts while keeping the bridge source in TypeScript. The next PR must pin the dependency and prove a no-public-behavior smoke before any generator is changed to use the real bridge.

## Rules for the next PR

The implementation PR must:

1. add a pinned `tsx` dev dependency;
2. update the lockfile in the same PR;
3. add a bridge smoke script that executes the TypeScript bridge without opening any public route, sitemap, or database behavior;
4. keep the generated fixture output stable;
5. keep imported hospitals blocked;
6. keep the import readiness manifest and combined smoke passing.

## Current decision state

`selected_runtime_path`: `tsx`

`implementation_status`: `pending_dependency_pr`

`public_behavior_change`: `none`
