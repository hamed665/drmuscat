# SEO-D3H4-I-A — Public Landing Data Path Implementation Readiness Gate

## 1. Status and Authority

This document is documentation-only for `SEO-D3H4-I-A`. It records the current readiness gate for DrMuscat public landing data path implementation and determines whether any actual implementation family is ready to begin.

This document does **not** authorize:

- SQL implementation;
- SQL migrations;
- database view or projection implementation;
- RPC implementation;
- function implementation;
- materialized view implementation;
- gate table implementation;
- RLS policy implementation;
- public SELECT policy implementation;
- mutation policy implementation;
- test implementation;
- test script implementation or modification;
- generated database type changes;
- Supabase usage;
- service-role usage;
- database queries;
- route integration;
- data-bearing public query helpers;
- route-check changes;
- metadata output;
- canonical output;
- hreflang output;
- Open Graph output;
- sitemap changes;
- schema output;
- robots changes;
- `llms.txt` changes;
- visible noindex pages;
- indexable pages;
- crawler behavior;
- CMS UI;
- API handlers;
- seed rows;
- analytics jobs;
- background jobs;
- public UI;
- provider listings;
- center listings;
- landing content;
- content generation;
- keyword seed runtime usage;
- medical content;
- service descriptions;
- specialty descriptions;
- local area descriptions;
- payment logic;
- monetization logic;
- sponsored placement;
- ranking logic;
- referral logic;
- commission logic;
- entitlement logic;
- plan logic.

Future implementation requires a separate approved `PHASED_BUILD_ONLY` task with explicit four-axis mapping, approved files, forbidden files, migration/RLS impact, generated-type impact, helper impact, route impact, SEO/crawler impact, validation commands, and human approval checkpoints.

If this document conflicts with `AGENTS.md`, `README.md`, project-state files, V10.4 master-spec files, V10.5 addendums, prior SEO decision maps, current helper contracts, current route checks, or stricter security/SEO guardrails, the stricter guardrail wins.

## 2. Four-Axis Mapping

- Execution Phase: Phase 3 — Public SEO Platform
- Lock Scope: Phase 4 — Public SEO Pages / public landing data path implementation readiness gate documentation-only
- Product Module: Phase 9 — SEO/CMS and Programmatic Pages
- Subphase ID: SEO-D3H4-I-A

## 3. Relationship to Prior Phases

### SEO-D3H4-I PLAN

The approved `SEO-D3H4-I` plan-only report concluded that the only GREEN next step is a documentation-only readiness gate. It marked data-bearing helper implementation, route/crawler/metadata/indexing implementation, and raw-table public SELECT as RED. It marked projection/view SQL and RLS SQL as YELLOW/BLOCKED until security semantics, policy model, and SQL-level tests are approved. It recommended no actual implementation until humans approve the readiness gate, test model, SQL/projection/RLS sequencing, and exact allowed files.

### SEO-D3H4-H-A Landing Public Gate Test Implementation Plan

`SEO-D3H4-H-A` is documentation-only. It concluded that future testing should be hybrid and staged: static migration/RLS checks, SQL-level RLS tests, projection/view allowlist tests, helper unit tests, route-check guardrails, and CI validation. It stated that static-only checks and unit-only helper tests are insufficient and that SQL-level RLS/projection tests are required before helper reads.

### SEO-D3H4-D-C Public-Safe Projection/View Implementation Plan

`SEO-D3H4-D-C` is documentation-only. It concluded that no raw `landing_page_contents` exposure should occur, any future projection must expose only derived gate-safe values, projection must not expose payload or actor/reviewer/internal fields, and `SECURITY INVOKER` or otherwise RLS-respecting behavior must be verified before implementation. `SECURITY DEFINER` must not be used unless separately approved and proven safe.

### SEO-D3H4-G-A Landing Content RLS Implementation Plan

`SEO-D3H4-G-A` is documentation-only. It concluded that public SELECT should not be added to the raw `public.landing_page_contents` table now because the table contains payload, reviewer, actor, and internal workflow fields and RLS is row-level rather than column-level. Public read should wait for a public-safe projection/view plus RLS/projection tests. Helpers and routes remain fail-closed.

### SEO-D3H4-C-IMPL-A Migration

`SEO-D3H4-C-IMPL-A` created `supabase/migrations/0051_landing_page_contents.sql`, updated generated database types, and updated static validation. Migration `0051` created `public.landing_page_contents`, lifecycle/review enums, constraints, indexes, an `updated_at` trigger, and RLS-enabled/no-policy posture. It intentionally did not create public SELECT policies, mutation policies, anon access, broad authenticated access, views/projections, RPCs, materialized views, seed rows, helper access, route integration, crawler behavior, or public content.

### SEO-D3H4-E-A RLS Test Strategy Decision Map

`SEO-D3H4-E-A` concluded that projection/view allowlist and leakage tests are required before helper implementation. It also concluded that unit-only mocked helper tests and static-only RLS checks are insufficient for RLS/security proof.

### SEO-D3H4-D-A Public-Safe Projection/View Decision Map

`SEO-D3H4-D-A` preferred future helper reads from a public-safe projection/view rather than the raw payload-bearing table. It deferred RPC/function and materialized gate table/view models. It kept helpers fail-closed and required that helper output not expose content payload, raw rows, reviewer/admin/internal fields, actor fields, raw errors, provider/center lists, keyword seeds, or generated text.

### SEO-D3H4-B-A Specialty Relationship Semantics Decision Map

`SEO-D3H4-B-A` concluded that specialty relationship signals are not interchangeable, specialty helper work remains fail-closed, and `specialty_area` remains blocked by specialty semantics, area canonicalization, and local relevance requirements. Future tests must not treat all specialty links as equivalent.

### SEO-D3H4-A Landing Roles/Review Permissions Decision Map

`SEO-D3H4-A` concluded that provider/center-scoped roles must not be reused for global landing content, platform admin is not automatically a medical reviewer, and explicit landing role semantics remain unresolved. Mutation/RLS tests remain conditional on separately approved landing roles.

### SEO-D3H3C-A Landing Content RLS Decision Map

`SEO-D3H3C-A` concluded that public SELECT must be strict; drafts, rejected rows, pending rows, and private review fields must remain hidden; helpers must not expose actor/internal fields; service role is forbidden; ambiguous roles block mutation; and RLS uncertainty blocks helper implementation.

### SEO-D3H3B-A Migration Decision Map

`SEO-D3H3B-A` recommended a bounded future table named `public.landing_page_contents` and stated that public visibility must require published status, editorial approval, medical approval or explicit `not_required`, non-deleted state, resolved canonical identity, and safe related entities.

### SEO-D3H3D-A Local Relevance Source Decision Map

`SEO-D3H3D-A` required reviewed local relevance rather than inference from slugs, counts, provider density, keyword demand, or generated copy.

### SEO-D3H2 Area Canonicalization

`SEO-D3H2` kept area-bearing routes fail-closed because current route shapes do not prove canonical area identity. Area canonicalization remains a blocker for area-bearing landing families.

### SEO-D3D2B Skeleton Helper

`SEO-D3D2B` created a public landing query helper skeleton that remains fail-closed. It has no source tables, no Supabase usage, no database queries, and no content payload exposure. This document does not authorize making that helper data-bearing.

### Route-Check Guardrails

Current route-check guardrails protect the fail-closed posture by blocking unauthorized helper, route, crawler, metadata, sitemap, robots, schema, `llms.txt`, Supabase, service-role, keyword seed, private data, and content behavior. This document does not authorize route-check changes.

## 4. Current Data Path Readiness Snapshot

### Schema Readiness

Status: **GREEN for private schema foundation only; not GREEN for public data path implementation.**

Current evidence:

- `public.landing_page_contents` exists in migration `0051_landing_page_contents.sql`.
- The table includes locale, country, family, service/specialty/area/city references, canonical keys, content payload columns, lifecycle/review status columns, actor/reviewer fields, timestamps, and soft-delete state.
- The migration includes constraints for family scope, approval/published state, content length/safety, review timestamps, and publication fields.
- The migration includes indexes for published lookup, public-style lookup, service/specialty/area lookup, review queue, published time, and deleted rows.
- The latest migration currently present is `0051_landing_page_contents.sql`.

Readiness interpretation: the private storage baseline exists, but it does not authorize public reads, helper reads, public routes, seed rows, or crawler exposure.

### RLS Readiness

Status: **GREEN for deny-by-default baseline; YELLOW/BLOCKED for any new policy implementation.**

Current evidence:

- RLS is enabled on `public.landing_page_contents`.
- No RLS policies exist for `public.landing_page_contents`.
- Static RLS checks require `0051` to enable RLS and to avoid policies, anon access, broad authenticated access, public SELECT, mutation policies, and seed rows.

Readiness interpretation: the table is protected by no-policy RLS posture. Actual RLS policy implementation is not ready without human-approved policy model and SQL-level tests.

### Projection/View Readiness

Status: **YELLOW/BLOCKED.**

Current evidence:

- No public-safe projection/view exists.
- No materialized gate table/view exists.
- No RPC/function exists for landing gate data.
- Generated `public.Views` is empty.

Readiness interpretation: a public-safe projection/view is the preferred future public-read direction, but it is not ready until view/RPC choice, column allowlist, security semantics, RLS interaction, and SQL-level tests are approved.

### SQL-Level Test Readiness

Status: **YELLOW for planning; BLOCKED for implementation until approved.**

Current evidence:

- No SQL-level landing RLS tests exist.
- No projection/view allowlist tests exist.
- No projection leakage tests exist.
- Existing `test:db:rls` is static validation plus `scripts/db/test-rls-static.mjs`.

Readiness interpretation: SQL-level tests should be the first actual implementation family only after humans approve the test model, fixture strategy, and exact files.

### Helper Readiness

Status: **RED for data-bearing implementation now; GREEN for current fail-closed safety.**

Current evidence:

- The public landing helper remains skeleton/fail-closed.
- The helper has no import statements.
- The helper has no Supabase usage.
- The helper has no service-role usage.
- The helper performs no database queries.
- The helper does not read `landing_page_contents`.
- The helper does not read a projection/view.
- The helper returns `helperAvailable: false`, zero counts, no source tables, and unavailable/fail-closed results.

Readiness interpretation: helper implementation must remain blocked until public-safe SQL source and SQL-level tests exist and pass.

### Route/Crawler Readiness

Status: **RED for visible noindex, indexable, metadata, sitemap, schema, robots, `llms.txt`, or crawler implementation now; GREEN for current fail-closed route safety.**

Current evidence:

- Service and service-area routes still end in `notFound()` after fail-closed gate evaluation.
- Area, specialty, and specialty-area routes validate locale/country and call `notFound()`.
- Route-check blocks unauthorized route/helper/crawler/metadata/schema/sitemap/robots/`llms.txt` behavior.
- Sitemap, robots, and `llms.txt` do not expose landing content.

Readiness interpretation: route/crawler work must wait until data source, helper, medical/legal, canonical, and SEO approvals are complete.

### Generated Type Readiness

Status: **GREEN for table type presence; RED for projection/view type readiness.**

Current evidence:

- Generated table types include `landing_page_contents`.
- Generated `public.Views` is empty.

Readiness interpretation: if a future projection/view or RPC is added, generated types must be regenerated only in an explicit approved schema/type phase.

### Validation Script Readiness

Status: **GREEN for current static guardrails; YELLOW/BLOCKED for SQL-level proof.**

Current evidence:

- `scripts/db/validate-migrations.mjs` validates the `0051` schema baseline and forbids public/policy/route/crawler/content patterns in `0051`.
- `scripts/db/test-rls-static.mjs` validates RLS enablement and no-policy/no-grant/no-seed posture for `0051`.
- `package.json` supports existing validation commands including `env:check`, `db:validate:migrations`, `test:db:rls`, `typecheck`, `test:unit`, `routes:check`, `build`, `lint`, and `seo:check`.

Readiness interpretation: current static protection is useful but insufficient for future public data path access. SQL-level tests must be added later only with approval.

### Seed/Content Readiness

Status: **BLOCKED.**

Current evidence:

- No landing content rows or seed data exist.
- Static RLS checks forbid seed rows in `0051`.
- No public landing content is rendered.
- No metadata/schema/sitemap/robots/`llms.txt` public landing exposure exists.

Readiness interpretation: seed/test-data strategy requires human approval. Public content requires separate product/legal/medical approvals.

## 5. Gate Matrix

| Item | Gate | Requires human approval? | Current decision |
| --- | --- | --- | --- |
| A. `landing_page_contents` table exists | GREEN | No for existence; yes for use | Private schema foundation exists in `0051`. |
| B. RLS enabled | GREEN | No for current baseline; yes for changes | RLS is enabled with no policies. |
| C. Raw table public SELECT | RED | Yes | Do not implement. Raw table contains payload and internal fields; RLS is row-level, not column-level. |
| D. Mutation RLS policies | BLOCKED | Yes | Landing role/review/publish model is unresolved. |
| E. Public-safe projection/view | YELLOW/BLOCKED | Yes | Preferred future direction, but no view/projection exists and security semantics are unverified. |
| F. Projection security semantics verified | BLOCKED | Yes | SECURITY INVOKER/RLS-respecting behavior must be verified before implementation. |
| G. SQL-level RLS tests | YELLOW/BLOCKED | Yes | Required before helper reads, but absent now. |
| H. SQL-level projection allowlist/leakage tests | YELLOW/BLOCKED | Yes | Required before helper implementation, but absent now. |
| I. Generated `public.Views` type | RED | Yes if view/function added | `public.Views` is empty because no projection/view exists. |
| J. Helper data-bearing read path | RED | Yes | Helper remains fail-closed and has no data access. |
| K. Helper raw table read prevention | GREEN | Yes to change | Current helper and route-check prevent raw-table/helper expansion. |
| L. Route visible noindex readiness | RED | Yes | Routes still fail closed; no visible pages. |
| M. Sitemap/schema/metadata/crawler readiness | RED | Yes | Crawler/metadata exposure remains blocked. |
| N. Seed/test-data strategy | BLOCKED | Yes | No seed rows; test fixture strategy unapproved. |
| O. Local relevance source | BLOCKED | Yes | Reviewed local relevance source remains unresolved. |
| P. Area canonicalization for area-bearing families | BLOCKED | Yes | Area canonical identity remains unresolved for area-bearing routes. |
| Q. Specialty semantics implementation | BLOCKED | Yes | Specialty relationship semantics remain unresolved. |
| R. Route-check protection | GREEN | Yes to change | Current route-check protects fail-closed route/crawler posture. |
| S. Migration/static validator protection | GREEN | Yes to change | Current validators protect `0051` no-policy/no-public/no-seed posture. |
| T. Human approval state | BLOCKED | Yes | Actual implementation requires future approval with exact files and validation scope. |

## 6. Candidate Next Implementation Families

### Option A — RLS SQL Implementation Next

- Pros:
  - Could define explicit access boundaries.
  - Could prepare future private management policy model.
  - Could preserve raw table privacy if no public SELECT is added.
- Cons:
  - Raw table includes payload, reviewer, actor, and internal workflow fields.
  - Public raw-table SELECT would expose all selectable columns for allowed rows because RLS is row-level, not column-level.
  - Landing editor/reviewer/medical reviewer/publisher roles remain unresolved.
  - SQL-level RLS tests do not exist.
- Blockers:
  - No approved RLS policy model.
  - No approved landing role model.
  - No SQL-level RLS tests.
  - Public projection/view strategy not implemented or tested.
- Prerequisites:
  - Human approval of policy model.
  - Human approval of whether raw table remains private forever.
  - SQL-level tests before or in the same phase.
  - Explicit migration and validation scope.
- Allowed files if later approved:
  - A new SQL migration only if an RLS implementation phase is explicitly approved.
  - SQL-level test files only if a test implementation phase is explicitly approved.
  - Static validator updates only if validation protocol explicitly requires them.
  - Generated types only if schema/function changes require regeneration and the phase approves it.
- Forbidden files:
  - Routes, helpers, crawler files, sitemap, robots, `llms.txt`, package files, public UI/content files, API handlers, Supabase client/server files, and data/SEO runtime files unless separately approved.
- Security risk: **Medium to high**, and **high** if raw public SELECT is introduced.
- SEO/crawler risk: **Low** if no routes/crawler files are touched.
- Medical/legal risk: **Medium to high** if review/publish authority is wrong.
- Implementation risk: **Medium to high**.
- Recommendation: **Do not implement RLS SQL next.** Keep YELLOW/BLOCKED until policy model and tests are approved.

### Option B — Public-Safe Projection/View SQL Implementation Next

- Pros:
  - Best future direction for column minimization.
  - Avoids direct helper reads from raw payload-bearing table.
  - Can expose only derived gate-safe values if correctly designed.
  - Can support future helper access after tests pass.
- Cons:
  - View/RPC choice is unresolved.
  - Postgres/Supabase security semantics must be verified.
  - Projection allowlist/leakage tests do not exist.
  - Generated `public.Views` is currently empty.
- Blockers:
  - No approved projection shape.
  - No approved SECURITY INVOKER/RLS-respecting semantics proof.
  - No SQL-level projection allowlist/leakage tests.
  - No generated type strategy.
- Prerequisites:
  - Human approval of view vs RPC vs no projection.
  - Human approval of derived gate-safe fields only.
  - SQL-level tests before or in the same phase.
  - Explicit migration/type generation scope.
- Allowed files if later approved:
  - A new migration for projection/view/RPC only if explicitly approved.
  - SQL-level tests only if approved.
  - Generated database types only if schema changes require regeneration and approval.
  - Static validator updates only if explicitly approved.
- Forbidden files:
  - Helpers, routes, crawler files, sitemap, robots, `llms.txt`, package files, public UI/content files, API handlers, service-role usage, and keyword seed runtime imports unless separately approved.
- Security risk: **Medium** until semantics and leakage tests pass.
- SEO/crawler risk: **Low** if no route/crawler files are touched.
- Medical/legal risk: **Medium** if derived gates accidentally imply medical/content approval incorrectly.
- Implementation risk: **Medium**.
- Recommendation: **Do not implement projection/view SQL next.** Keep YELLOW/BLOCKED until security semantics and tests are approved.

### Option C — SQL-Level RLS/Projection Test Harness Implementation Next

- Pros:
  - Safest first actual implementation family after readiness approval.
  - Can prove raw table deny-by-default behavior.
  - Can prove future projection allowlist and leakage behavior.
  - Reduces risk before helper, route, or crawler work.
- Cons:
  - Still an implementation task and therefore needs separate approval.
  - Requires approved fixture/test-data strategy.
  - May require local database/Supabase CLI assumptions.
  - Projection shape and RLS model influence test design.
- Blockers:
  - Test data strategy unapproved.
  - Test-before-SQL vs same-phase-SQL decision unapproved.
  - Projection/RLS target semantics unapproved.
- Prerequisites:
  - Human approval of test model and fixtures.
  - Explicit allowed files for tests/scripts.
  - Decision on whether tests are implemented before SQL or in the same phase.
- Allowed files if later approved:
  - SQL test files in an approved location.
  - Test runner or static validation script changes only if explicitly approved.
  - Package script changes only if explicitly approved.
- Forbidden files:
  - Production helpers, routes, sitemap, robots, `llms.txt`, public UI/content, migrations unless same approved phase includes SQL, generated types unless schema changed, and Supabase client/server files.
- Security risk: **Low** if scoped to tests only.
- SEO/crawler risk: **Low** if no route/crawler files are touched.
- Medical/legal risk: **Low** if no content is added.
- Implementation risk: **Medium** due to local DB/test orchestration.
- Recommendation: **Potential first actual implementation family later, but not now.** Keep YELLOW until humans approve the readiness gate, test model, and exact files.

### Option D — Data-Bearing Helper Implementation Next

- Pros:
  - Would eventually provide gate data for route decisions.
  - Could unify public landing gate inputs once safe data sources exist.
- Cons:
  - No public-safe projection/view exists.
  - SQL-level RLS/projection tests do not exist.
  - Raw table direct reads are not acceptable.
  - Local relevance, area canonicalization, and specialty semantics remain unresolved.
- Blockers:
  - No tested public-safe data source.
  - No generated projection/view types.
  - No SQL-level tests.
  - No human approval for helper data access.
- Prerequisites:
  - Projection/view or approved safe source exists.
  - SQL-level RLS/projection tests pass.
  - Generated types are ready if needed.
  - Human-approved helper contract and exact files.
- Allowed files if later approved:
  - Specific helper file(s) and helper tests only after SQL tests pass and if explicitly approved.
- Forbidden files:
  - Raw table direct reads, service-role usage, route integration, crawler files, metadata/schema/sitemap, public UI/content, and keyword seed runtime imports.
- Security risk: **High now**.
- SEO/crawler risk: **Medium to high** if routes consume helper prematurely.
- Medical/legal risk: **High** if content/review/local relevance gates are wrong.
- Implementation risk: **High**.
- Recommendation: **RED. Do not implement now.**

### Option E — Route Visible Noindex Implementation Next

- Pros:
  - Could eventually support preview/noindex landing surfaces after safe data gates exist.
  - Could help validate route UX later without indexation if carefully scoped.
- Cons:
  - No data-bearing helper exists.
  - No SQL-level tests exist.
  - No public-safe projection/view exists.
  - Medical/legal/content approvals are absent.
  - Current routes deliberately fail closed.
- Blockers:
  - All data path gates are blocked.
  - Route/crawler approval absent.
  - No content approval.
  - Route-check currently protects against public landing expansion.
- Prerequisites:
  - SQL source ready and tested.
  - Helper ready and tested.
  - Human medical/legal/product approval.
  - Explicit route family approval.
  - Route-check updates only if explicitly approved.
- Allowed files if later approved:
  - Specific route family files only under an explicit route phase.
  - Route-check/test updates only if explicitly approved.
- Forbidden files:
  - Broad route expansion, indexable metadata, sitemap/schema exposure, robots/`llms.txt` changes, keyword runtime imports, unapproved content, and unapproved medical copy.
- Security risk: **Medium**.
- SEO/crawler risk: **High** because accidental crawl/index signals could leak.
- Medical/legal risk: **High**.
- Implementation risk: **High**.
- Recommendation: **RED. Do not implement now.**

### Option F — Documentation-Only Readiness Gate Implementation Next

- Pros:
  - Lowest risk.
  - Creates a clear readiness checkpoint before any implementation.
  - Preserves fail-closed helper, route, RLS, and crawler posture.
  - Documents blockers and human approvals.
- Cons:
  - Does not add runtime capability.
  - Requires later explicit implementation tasks.
- Blockers:
  - None if limited to this documentation artifact.
- Prerequisites:
  - Approved documentation-only task with exactly one allowed file.
- Allowed files if later approved:
  - This document only: `docs/seo/PUBLIC_LANDING_DATA_PATH_IMPLEMENTATION_READINESS_GATE.md`.
- Forbidden files:
  - All runtime, SQL, generated type, helper, route, route-check, crawler, package, test, data, Supabase, public UI/content, and API files.
- Security risk: **Low**.
- SEO/crawler risk: **Low**.
- Medical/legal risk: **Low**.
- Implementation risk: **Low**.
- Recommendation: **GREEN for this documentation-only artifact.** After this document, do not proceed to actual implementation until humans approve the readiness gate, test model, SQL/projection/RLS sequencing, and exact files.

## 7. Recommended Conservative Gate Decision

Current conservative decision:

- GREEN only for this documentation-only readiness gate.
- RED for data-bearing helper implementation now.
- RED for route, crawler, metadata, sitemap, schema, robots, `llms.txt`, visible noindex, and indexing implementation now.
- RED for raw table public SELECT.
- YELLOW/BLOCKED for projection/view SQL until security semantics and tests are approved.
- YELLOW/BLOCKED for RLS SQL until policy model and tests are approved.
- YELLOW for SQL-level test harness planning, but actual test implementation still requires a separate approved task.
- No actual implementation is ready now.

## 8. Ordering Recommendation

Safest future order:

1. Documentation-only readiness gate.
2. Human approval of readiness gate and sequencing.
3. SQL-level test harness plan/implementation after explicit approval.
4. RLS/projection SQL plan/implementation with tests before or in the same phase.
5. Generated type regeneration if a projection/view or RPC exists and the phase approves type generation.
6. Helper data-bearing plan/implementation only after SQL-level tests pass and safe source/types exist.
7. Route visible noindex much later, only after helper/data/medical/legal/SEO approvals.
8. Indexing/crawler/metadata/sitemap/schema later still, only after stable content, canonical strategy, medical/legal approvals, and no duplicate route risks.

## 9. Human Approval Checkpoints

Before any actual implementation, humans must approve:

- Whether to implement SQL-level tests before RLS/projection SQL or in the same phase.
- Whether future public-safe access should use a view, RPC, or no projection.
- DB/Postgres/Supabase view security semantics, including SECURITY INVOKER/RLS-respecting behavior.
- RLS policy model.
- Whether raw `public.landing_page_contents` remains private forever.
- Whether projection exposes only derived gate-safe fields.
- Local relevance source.
- Area canonicalization blocker handling.
- Specialty relationship handling.
- Test data strategy.
- Generated type strategy.
- Confirmation that the first implementation PR contains no helper, route, crawler, metadata, sitemap, schema, robots, `llms.txt`, public UI, or content changes.

## 10. Recommended Next Subphase

Recommended choice from the currently available implementation-family options:

**No further action until human product/legal/medical decision.**

Rationale:

- Do not recommend `SEO-D3H4-H-B — Landing Public Gate Test Implementation` yet, because actual test implementation still requires human approval of the readiness gate, test model, fixture strategy, and exact files.
- Do not recommend `SEO-D3H4-D-D — Public-Safe Projection/View SQL Implementation` yet, because projection shape, security semantics, and tests are not approved.
- Do not recommend `SEO-D3H4-G-B — Landing Content RLS SQL Implementation` yet, because the policy model and tests are not approved.

## 11. Exact Allowed Files for Next Recommended Task

Because the recommended next subphase is **no further action until human product/legal/medical decision**, the exact allowed files are:

- No files.

If humans later approve a future implementation task, that task must explicitly list only the files needed for that phase. No file list should be inferred from this readiness gate.

## 12. Exact Forbidden Files for Next Recommended Task

Until a future explicit phase approves otherwise, the following remain forbidden:

- Routes.
- Helpers.
- Route-check unless explicitly required by validation protocol.
- Migrations unless explicit RLS/projection implementation phase.
- Generated types unless explicit view/function changes require it.
- Package files.
- Sitemap, robots, and `llms.txt`.
- `data/seo`.
- Tests unless explicit test implementation phase.
- `scripts/db` unless explicit validation implementation phase.
- Public UI/content files.
- Supabase client/server files.
- API handlers.
- SQL.
- Database views.
- RPCs.
- Materialized views.
- Gate tables.
- RLS policies.
- Database queries.
- Supabase usage.
- Service-role usage.
- Route integration.
- Metadata, canonical, hreflang, Open Graph, sitemap, schema, robots, or `llms.txt` behavior.
- Visible noindex pages.
- Indexable pages.
- CMS records.
- Analytics, crawler, or background jobs.
- Provider/center listings.
- Medical content.
- Service descriptions.
- Specialty descriptions.
- Local area descriptions.
- Keyword seed runtime usage.
- Payment, monetization, sponsored, ranking, referral, commission, entitlement, or plan logic.

## 13. Validation Expectations

For this documentation-only task, expected validation commands are:

- `git status --short`
- `test -f docs/seo/PUBLIC_LANDING_DATA_PATH_IMPLEMENTATION_READINESS_GATE.md && echo "SEO-D3H4-I-A public landing data path readiness gate exists"`
- `pnpm env:check`
- `pnpm db:validate:migrations`
- `pnpm test:db:rls`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm routes:check`
- `pnpm build`
- `pnpm lint`
- `pnpm seo:check` if applicable

Validation must not be faked or skipped silently. If any command fails, the failure must be reported with the smallest safe fix or blocker.

## 14. Out of Scope

This readiness gate does not implement and does not authorize:

- public landing data path SQL;
- RLS policies;
- projection/view/RPC/gate-table/materialized-view SQL;
- SQL-level tests;
- helper reads;
- route rendering;
- visible noindex pages;
- indexable pages;
- crawler behavior;
- sitemap/schema/robots/`llms.txt` changes;
- metadata/canonical/hreflang/Open Graph output;
- CMS records;
- seed rows;
- public content;
- medical, service, specialty, or local area copy;
- keyword seed runtime usage;
- payment, monetization, sponsored, ranking, referral, commission, entitlement, or plan logic.

## 15. Final Recommendation

Actual public landing data path implementation is **not ready now**.

Final recommendation: **no further action until human product/legal/medical decision** approving the readiness gate, test model, SQL/projection/RLS sequencing, and exact allowed files.

When humans approve moving beyond this gate, the safest first actual implementation family is likely SQL-level RLS/projection test harness implementation, not helper, route, crawler, raw-table public SELECT, or indexing work. Even that test implementation must be separately approved with exact files and validation scope.
