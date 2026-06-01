# Deny-by-Default Raw Landing Table Runtime Test Plan

## 1. Status and Authority

This document is documentation-only for `SEO-D3H4-J-F`. It records the conservative future strategy for deny-by-default runtime tests against the raw `public.landing_page_contents` table after `SEO-D3H4-J-D` added the local/advisory runtime scaffold and `SEO-D3H4-J-E` approved a plan-only runtime assertion strategy.

This document authorizes no implementation.

Specifically, this document does **not** authorize:

- runtime DB tests;
- SQL tests;
- package or script changes;
- `package.json` changes;
- `scripts/db` changes;
- CI changes;
- Supabase config;
- Docker config;
- SQL or migration changes;
- RLS policies;
- grants;
- views or projections;
- RPCs or functions;
- seed files, seed rows, or production seed behavior;
- generated database type changes;
- helper or route changes;
- route-check changes;
- sitemap, schema, robots, or `llms.txt` changes;
- metadata, canonical, or hreflang changes;
- crawler, public UI, public API, CMS, or public content behavior.

A future implementation requires a separate approved `PHASED_BUILD_ONLY` task with explicit four-axis mapping, exact allowed files, exact forbidden files, runtime model, environment strategy, role/auth simulation strategy, validation commands, and human approval checkpoints.

If this document conflicts with `AGENTS.md`, `README.md`, project-state files, V10.4 master-spec files, V10.5 addendums, prior SEO decision maps, current helper contracts, route checks, security/RLS protocols, or stricter SEO guardrails, the stricter guardrail wins.

## 2. Four-Axis Mapping

- Execution Phase: Phase 3 — Public SEO Platform
- Lock Scope: Phase 4 — Public SEO Pages / deny-by-default raw landing table runtime test plan documentation-only
- Product Module: Phase 9 — SEO/CMS and Programmatic Pages
- Subphase ID: SEO-D3H4-J-F

## 3. Relationship to Prior Phases

### SEO-D3H4-J-E PLAN

`SEO-D3H4-J-E` was a plan-only phase. It concluded that the first real SQL runtime tests should prove only deny-by-default access to the raw `public.landing_page_contents` table. It recommended documentation-only implementation next and explicitly did not recommend actual runtime DB test implementation until humans approve the model, environment, exact files, and role/auth simulation strategy.

### SEO-D3H4-J-D Runtime Scaffold

`SEO-D3H4-J-D` added `scripts/db/test-landing-runtime-scaffold.mjs` and registered `test:landing:runtime:scaffold` in `package.json`. The scaffold is local/advisory only. It performs source and posture checks, reports runtime DB unavailability when local Supabase config and/or DB service scaffolding is absent, and does not execute SQL runtime tests, connect to a database, run migrations, call Supabase CLI, read `.env.local`, or require production DB/secrets.

### SEO-D3H4-J-C Runtime Harness Implementation Plan

`SEO-D3H4-J-C` created `docs/seo/SQL_RUNTIME_TEST_HARNESS_IMPLEMENTATION_PLAN.md`. It documented a hybrid staged model and concluded that the first real runtime tests should be deny-by-default raw landing table tests. Projection/view tests should wait until a projection exists, and helper integration should wait until projection and RLS tests pass.

### SEO-D3H4-J-A Runtime Harness Readiness

`SEO-D3H4-J-A` created runtime harness readiness documentation. It concluded that the current repository had no approved runtime harness, no SQL runtime test files, no `psql` runtime scripts, no package script running runtime database tests, no Supabase config, no Docker DB support, and no approved runtime DB service.

### SEO-D3H4-H-B Landing Public Gate Static Guardrail

`SEO-D3H4-H-B` added `scripts/db/test-landing-public-gate-static.mjs` and `test:landing:public-gate`. It established static guardrails that block raw landing table exposure, landing RLS policies, anon/authenticated grants, landing seed rows, public-safe projection/view creation, helper data-bearing access, route/crawler exposure, and generated view drift.

### SEO-D3H4-I-A Public Landing Data Path Readiness Gate

`SEO-D3H4-I-A` created `docs/seo/PUBLIC_LANDING_DATA_PATH_IMPLEMENTATION_READINESS_GATE.md`. It concluded that current fail-closed safety is acceptable, but raw-table public SELECT, data-bearing helper work, route/crawler/metadata/indexing work, and projection/RLS/test implementation remain blocked pending explicit approval.

### SEO-D3H4-C-IMPL-A Landing Content Migration

`SEO-D3H4-C-IMPL-A` created `supabase/migrations/0051_landing_page_contents.sql`, updated generated types, and updated static validation. Migration `0051` created the raw private landing table, lifecycle/review enums, constraints, indexes, an `updated_at` trigger, and enabled RLS. It intentionally did not create public SELECT policies, mutation policies, anon access, broad authenticated access, views/projections, RPCs, materialized views, seed rows, helper access, route integration, crawler behavior, or public content.

## 4. Current Runtime Scaffold Baseline

Current inspected baseline:

- Runtime scaffold exists at `scripts/db/test-landing-runtime-scaffold.mjs`.
- Package script `test:landing:runtime:scaffold` exists and points to `node scripts/db/test-landing-runtime-scaffold.mjs`.
- Runtime execution is skipped.
- No database connection is attempted.
- No migrations are run.
- No SQL runtime tests exist under `supabase/tests`; the current `supabase/tests/rls` and `supabase/tests/seed` posture is scaffold-only.
- No Supabase config exists; `supabase/config.toml` is absent.
- No Docker DB service exists; `docker-compose.yml` and `Dockerfile` are absent.
- CI exists but does not define a Postgres, Docker, or Supabase DB service.
- No production secrets are required for the scaffold.
- No seed SQL exists under `supabase/seed`.
- Migration `0051_landing_page_contents.sql` creates `public.landing_page_contents` and enables RLS.
- No landing RLS policies exist.
- No grants to `anon` or `authenticated` exist for `public.landing_page_contents`.
- Generated `public.Views` remains empty.
- The public landing helper remains fail-closed.
- Routes remain fail-closed for unapproved public landing behavior.
- Crawler exposure remains absent; sitemap, robots, and `llms.txt` do not expose new landing content.
- No seed rows exist.
- The overall fail-closed posture remains intact.

This is a static/source/scaffold baseline, not runtime proof.

## 5. First Runtime Test Purpose

The first future real runtime tests must prove only the raw `public.landing_page_contents` table deny-by-default posture at runtime.

The first runtime test phase must not prove or implement:

- projection/view behavior;
- helper behavior;
- route behavior;
- crawler behavior;
- public content rendering;
- metadata behavior;
- sitemap behavior;
- schema.org behavior;
- indexability or noindex behavior;
- CMS behavior;
- public API behavior;
- visible noindex pages;
- indexable pages;
- landing content.

The purpose is narrow: prove that unauthenticated and broadly authenticated users cannot read or mutate the raw payload-bearing table and that no policy/grant path exposes it.

## 6. Candidate Harness Choices

### 6.1 Supabase CLI Local Runtime Test

- Pros:
  - Closest to intended local Supabase runtime semantics.
  - Can apply project migrations in a local Supabase-managed environment.
  - Better long-term fit for PostgREST/JWT-sensitive RLS tests than bare Postgres.
- Cons:
  - Requires `supabase/config.toml`, which is currently absent.
  - May require local Supabase services and Docker.
  - Can accidentally expand the repo into a broader runtime harness before explicit approval.
- Files likely needed if later approved:
  - `package.json` for one exact script.
  - `scripts/db/landing-runtime-test-runner.mjs` or similar if a wrapper is approved.
  - `supabase/tests/rls/landing_page_contents_deny_by_default.sql` if Supabase SQL convention is approved.
  - `supabase/config.toml` only if Supabase CLI local runtime is explicitly approved.
- Env/secrets needed:
  - Local generated Supabase test credentials or local CLI defaults only.
  - No production DB.
  - No production service-role secret.
  - No `.env.local` requirement.
- CI impact:
  - None for the first local-only phase.
  - Later CI support would need approved service/runtime setup.
- Local developer impact:
  - Requires Supabase CLI and likely local service startup.
- Risk:
  - Medium, because adding config/services can broaden project runtime assumptions.
- Recommendation:
  - Good long-term candidate, but do not implement now. Require explicit approval for `supabase/config.toml`, local service model, exact files, env strategy, role/auth simulation, and CI posture.

### 6.2 `psql` Ephemeral Postgres Runtime Test

- Pros:
  - Small and transparent.
  - Can be local-only.
  - Can apply migrations and assert database catalog/RLS/grant behavior.
  - Avoids Supabase config at first if an approved local Postgres service exists.
- Cons:
  - Bare Postgres is not identical to Supabase/PostgREST auth behavior.
  - `anon` and `authenticated` role setup must be explicitly emulated.
  - JWT claim behavior is not naturally exercised.
- Files likely needed if later approved:
  - `package.json` for one exact script.
  - `scripts/db/landing-runtime-test-runner.mjs` or similar.
  - Optional SQL assertion file only if an approved SQL convention exists.
  - DB service config only if explicitly approved.
- Env/secrets needed:
  - Local ephemeral Postgres connection values only.
  - No production DB or production secrets.
- CI impact:
  - None initially.
  - Later CI would require approved Postgres service container or equivalent.
- Local developer impact:
  - Requires local Postgres or approved ephemeral DB service.
- Risk:
  - Medium, because it proves database-level behavior but not full Supabase HTTP/PostgREST behavior.
- Recommendation:
  - Conservative possible first implementation if Supabase config remains unapproved, but only after humans approve the DB service and role/JWT emulation strategy.

### 6.3 Node Runner Against Local Postgres/Supabase

- Pros:
  - Can provide one consistent `pnpm` entry point.
  - Can orchestrate static preflight checks, migration application, and SQL assertions.
  - Can wrap either Supabase CLI or `psql` later.
- Cons:
  - Requires an approved DB model.
  - May require a new dependency such as a Postgres client, or careful shelling out to `psql`.
  - Can sprawl into helper/route or app-level integration unless tightly scoped.
- Files likely needed if later approved:
  - `package.json` for one exact script.
  - `scripts/db/landing-runtime-test-runner.mjs` or similar.
  - `.env.example` only if approved local runtime env keys are introduced.
- Env/secrets needed:
  - Local-only DB URL or local Supabase DB connection.
  - No production DB.
  - No production service-role public path.
- CI impact:
  - None initially.
  - Later CI optional/required posture requires approved DB service.
- Local developer impact:
  - Simplifies command usage after the runtime model is approved.
- Risk:
  - Medium, especially if dependency/env choices are not explicitly approved.
- Recommendation:
  - Strong wrapper candidate after the harness model is chosen, but do not implement now.

### 6.4 pgTAP

- Pros:
  - Database-native assertion style.
  - Good fit for future SQL/RLS regression suites.
  - Clear test files if a Supabase SQL test convention is approved.
- Cons:
  - Requires pgTAP availability and matching local/CI database support.
  - Adds setup complexity before the minimal runtime proof exists.
  - May be too much tooling for the first deny-by-default check.
- Files likely needed if later approved:
  - `supabase/tests/rls/landing_page_contents_deny_by_default.sql`.
  - `package.json` for one exact test script.
  - Possibly `supabase/config.toml` or DB service configuration.
- Env/secrets needed:
  - Local Supabase/Postgres with pgTAP support.
  - No production DB or production secrets.
- CI impact:
  - Higher than simple `psql` or Node because CI must provide pgTAP-capable runtime support.
- Local developer impact:
  - Developers need matching local DB/test extension support.
- Risk:
  - Medium/high for the first step because extension/tooling decisions could dominate the security objective.
- Recommendation:
  - Defer until a broader database test convention is approved.

### 6.5 Keep Scaffold-Only Until Supabase Config / DB Model Approved

- Pros:
  - Safest current posture.
  - Matches the approved scaffold-only context.
  - Avoids unapproved DB, secrets, config, CI, migration, or SQL-test expansion.
  - Preserves existing static guardrails.
- Cons:
  - Deny-by-default remains source/static/scaffold validated only, not runtime-proven.
- Files likely needed now:
  - None beyond this documentation-only plan.
- Env/secrets needed:
  - None.
- CI impact:
  - None.
- Local developer impact:
  - None beyond existing commands.
- Risk:
  - Low short-term; medium long-term if runtime proof remains deferred before data-bearing work.
- Recommendation:
  - Recommended now. Do not implement actual runtime tests until humans choose and approve the DB/runtime model.

## 7. Recommended Conservative Model

Recommended model:

- Do not implement runtime tests now.
- Prefer local-only first runtime tests later.
- Require no production DB.
- Require no production secrets.
- Require no `.env.local`.
- Do not make a CI DB job required yet.
- Do not add projection/view changes.
- Do not add RLS policies.
- Do not add grants.
- Do not change helpers.
- Do not change routes.
- Do not change route-check.
- Do not change crawler, sitemap, robots, `llms.txt`, schema, metadata, canonical, hreflang, indexability, UI, API, CMS, or content behavior.
- If the Supabase CLI model is chosen later, adding `supabase/config.toml` requires explicit approval.
- If the `psql` model is chosen later, DB service setup and role/JWT emulation require explicit approval.
- Keep current static checks and scaffold checks in place.

## 8. First Runtime Assertion Set

The first future runtime assertion set should include only:

1. Migrations apply successfully in a local-only runtime database.
2. `public.landing_page_contents` exists.
3. RLS is enabled on `public.landing_page_contents`.
4. `anon` cannot `SELECT` from the raw table.
5. `authenticated` non-role/non-privileged user cannot `SELECT` from the raw table.
6. `anon` cannot `INSERT` into the raw table.
7. `anon` cannot `UPDATE` the raw table.
8. `anon` cannot `DELETE` from the raw table.
9. `authenticated` non-role/non-privileged user cannot `INSERT` into the raw table.
10. `authenticated` non-role/non-privileged user cannot `UPDATE` the raw table.
11. `authenticated` non-role/non-privileged user cannot `DELETE` from the raw table.
12. No policies exist for `public.landing_page_contents`.
13. No grants to `anon` or `authenticated` exist for `public.landing_page_contents`.
14. No seed data is required if empty-table denial is enough.
15. No service-role public path exists or is introduced.

These assertions must not require adding policies, grants, views, projections, RPCs, functions, seed rows, helpers, routes, crawler exposure, or public content.

## 9. Role/Auth Simulation Strategy

### Anon Role

If using Supabase CLI/local Supabase, `anon` should represent unauthenticated public access through the local Supabase runtime. If using `psql`, `anon` may be emulated with direct database role behavior such as `SET ROLE anon`, but only after role setup is explicitly approved.

### Authenticated Role

If using Supabase CLI/local Supabase, `authenticated` should represent a broadly authenticated non-privileged user through the local Supabase runtime. If using `psql`, `authenticated` may be emulated with direct database role behavior such as `SET ROLE authenticated`, but only after role setup is explicitly approved.

### Supabase JWT Claims

Supabase JWT claims become relevant if future tests assert policy behavior that depends on `auth.uid()`, `auth.jwt()`, or role claims. The first deny-by-default raw table harness should avoid claim-dependent role semantics because no policies should exist for the raw landing table.

### Direct Postgres `SET ROLE`

Direct Postgres `SET ROLE` can prove database-level grant/RLS behavior for roles, but it does not fully prove Supabase/PostgREST HTTP semantics. If used, the limitation must be documented clearly in the implementation phase.

### Provider/Patient/Platform Roles

The first harness must not test provider, patient, publisher, reviewer, platform, or admin role semantics unless a separate approval explicitly expands scope. Those semantics remain out of scope for the first raw-table deny-by-default runtime proof.

## 10. Test Data Strategy

### Empty-Table Deny-by-Default — Preferred First

Preferred initial strategy:

- Use no seed rows.
- Use no fixture rows.
- Prove table existence, RLS enablement, no policies, no grants, and denial of raw read/mutation attempts for `anon` and broad `authenticated` roles.
- Avoid weakening the current no-seed posture.

### Transaction-Scoped Fixture Rows — Deferred

Transaction-scoped fixture rows may later help distinguish empty-table behavior from true row hiding. This is deferred because it requires approved elevated local setup, insertion mechanics, transaction rollback strategy, and a precise rule that fixture data never enters production seed paths.

### `supabase/tests` Local Fixtures — Deferred

Local SQL fixtures under `supabase/tests` are deferred. The current scaffold posture permits directories but no SQL runtime test files. Adding SQL test files requires explicit approval of the Supabase SQL test convention.

### Production Seed Path — Prohibited

The production seed path is prohibited for this runtime test strategy. No seed SQL, seed rows, or production content may be introduced unless a separate seed phase explicitly approves it.

## 11. File Scope for Future Actual Implementation

If later approved, possible implementation files are limited to the exact approved set, such as:

- `package.json` only for the exact approved script name.
- `scripts/db/landing-runtime-test-runner.mjs` or similar, only if a Node/wrapper model is approved.
- `supabase/tests/rls/landing_page_contents_deny_by_default.sql` only if Supabase SQL convention is approved.
- `supabase/config.toml` only if Supabase CLI local runtime is approved.
- `.github/workflows/ci.yml` only in a later approved CI phase.
- `.env.example` only if approved local runtime env keys are introduced.

Forbidden for the first actual runtime test phase unless a separate explicit approval says otherwise:

- `src/app/*`;
- `src/lib/*`;
- helpers or routes;
- route-check relaxation;
- migrations unless explicit separate phase approval exists;
- generated database types;
- sitemap, robots, or `llms.txt`;
- `data/seo`;
- seed SQL;
- public UI, public content, public API, or CMS behavior.

## 12. Stop Conditions

Stop and report a blocker if any future implementation requires:

- production secrets;
- production DB access;
- `.env.local`;
- RLS policy SQL;
- projection/view SQL;
- helper changes;
- route changes;
- route-check relaxation;
- seed policy weakening;
- CI DB service without approval;
- Supabase config without approval;
- Docker config without approval;
- unclear role/auth emulation;
- new dependency without approval;
- service-role use in any public/helper/route path;
- metadata, canonical, hreflang, schema, sitemap, robots, `llms.txt`, crawler, public UI, public API, CMS, or content changes;
- any validation failure.

## 13. Future Validation Expectations

Existing validation commands expected to remain in scope for future implementation phases:

- `pnpm env:check`
- `pnpm db:validate:migrations`
- `pnpm test:db:rls`
- `pnpm test:landing:public-gate`
- `pnpm test:landing:runtime:scaffold`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm routes:check`
- `pnpm build`
- `pnpm lint`
- `pnpm seo:check`

Candidate future command, not implemented by this document:

- `pnpm test:landing:runtime`

## 14. Human Approval Checkpoints

Before actual runtime DB test implementation, humans must approve:

- choice of Supabase CLI vs `psql` vs Node runner vs another model;
- `supabase/config.toml` or DB service if needed;
- environment strategy;
- exact script name;
- exact files;
- local-only vs CI-optional vs CI-required posture;
- role/auth simulation strategy;
- test data strategy;
- confirmation that no production data or secrets are used;
- confirmation that no helper, route, projection, view, RLS SQL, grant, seed, crawler, metadata, indexability, sitemap, robots, `llms.txt`, UI, API, CMS, or content behavior is included in the first runtime test phase.

Approval cannot be assumed. If the implementation model is unclear, the correct action is to stop rather than guess.

## 15. Recommended Next Subphase

Recommended next action: **no further implementation until explicit human approval**.

Do not proceed to `SEO-D3H4-J-G — Deny-by-Default Raw Landing Table Runtime Test Implementation` unless humans explicitly approve the runtime model, environment strategy, exact files, local-only/CI posture, role/auth simulation, and test data strategy.

## 16. Exact Allowed Files for Next Recommended Task

If no implementation is approved:

- no files.

If a future implementation is approved, the exact allowed files must be restated in that future prompt. Potential future files may include only the explicitly approved subset of:

- `package.json` for the exact approved script;
- `scripts/db/landing-runtime-test-runner.mjs` or similar;
- `supabase/tests/rls/landing_page_contents_deny_by_default.sql` if Supabase SQL convention is approved;
- `supabase/config.toml` if Supabase CLI local runtime is approved;
- `.github/workflows/ci.yml` only in a later CI phase;
- `.env.example` only if approved local runtime env keys are introduced.

## 17. Exact Forbidden Files for Next Recommended Task

Unless a future approval explicitly changes scope, the next recommended no-implementation posture forbids editing or adding:

- `package.json`;
- `scripts/db/*`;
- `.github/*`;
- `supabase/*`;
- `src/app/*`;
- `src/lib/*`;
- migrations;
- generated types;
- helpers;
- routes;
- route-check;
- sitemap, robots, or `llms.txt`;
- `data/seo`;
- tests;
- Docker or Supabase config;
- public UI, content, API, or CMS behavior.

## 18. Validation Expectations for This Documentation-Only Task

This documentation-only task should validate that exactly this plan file was created and no forbidden files were edited.

Expected commands for this task:

- `git status --short`
- `test -f docs/seo/DENY_BY_DEFAULT_RAW_LANDING_TABLE_RUNTIME_TEST_PLAN.md && echo "SEO-D3H4-J-F deny-by-default raw landing table runtime test plan exists"`
- `pnpm env:check`
- `pnpm db:validate:migrations`
- `pnpm test:db:rls`
- `pnpm test:landing:public-gate`
- `pnpm test:landing:runtime:scaffold`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm routes:check`
- `pnpm build`
- `pnpm lint`
- `pnpm seo:check`

Expected result:

- Only `docs/seo/DENY_BY_DEFAULT_RAW_LANDING_TABLE_RUNTIME_TEST_PLAN.md` is created.
- No existing files are modified.
- No code changes.
- No package/script changes.
- No CI changes.
- No Supabase/Docker config changes.
- No tests added.
- No migrations added.
- No generated database types changed.
- No metadata, schema, sitemap, robots, or `llms.txt` behavior changed.
