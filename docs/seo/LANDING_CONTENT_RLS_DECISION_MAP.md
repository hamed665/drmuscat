# SEO-D3H3C-A — Landing Content RLS Decision Map

## 1. Status and Authority

This document is documentation-only for SEO-D3H3C-A. It records a conservative future Row Level Security (RLS) decision map for the proposed `public.landing_page_contents` model.

This document does not authorize SQL, migrations, RLS policy implementation, generated database type changes, Supabase client/type changes, database queries, service-role usage, runtime helpers, data-bearing public query helpers, route integration, route-check changes, metadata, `generateMetadata`, `generateStaticParams`, canonical tags, hreflang tags, Open Graph output, sitemap changes, schema output, robots changes, `llms.txt` changes, visible noindex pages, indexable pages, CMS UI, API handlers, seed rows, crawler behavior, analytics/background jobs, public UI, provider listings, center listings, landing content, medical copy, service descriptions, local area descriptions, content generation, keyword seed runtime usage, payment logic, monetization logic, sponsored placement, ranking, referral, commission, entitlement, or plan logic.

Future implementation requires a separate approved `PHASED_BUILD_ONLY` task with explicit four-axis mapping, allowed files, forbidden files, migration/RLS impact, generated-type impact, helper impact, route impact, SEO/crawler impact, validation commands, and human approval. If this document conflicts with `AGENTS.md`, project-state files, V10.4 master-spec files, V10.5 addendums, SEO-D3H3C, SEO-D3H3B-A, SEO-D3H3A, SEO-D3H2, existing helper contracts, existing route checks, or stricter security/SEO guardrails, the stricter guardrail wins.

## 2. Four-Axis Mapping

- Execution Phase: Phase 3 — Public SEO Platform
- Lock Scope: Phase 4 — Public SEO Pages / landing content RLS documentation-only decision map
- Product Module: Phase 9 — SEO/CMS and Programmatic Pages
- Subphase ID: SEO-D3H3C-A

## 3. Relationship to Prior Phases

### SEO-D3H3C Plan

SEO-D3H3C was a PLAN ONLY task. It concluded that no RLS implementation should happen yet and that the safest next action is this documentation-only decision map before any SQL, migration, RLS policy, generated type, helper, route, crawler, or content work.

### SEO-D3H3B-A Landing Content Migration Decision Map

SEO-D3H3B-A recommended one future bounded table name: `public.landing_page_contents`. It did not authorize SQL, migrations, RLS, generated database types, helper integration, route integration, public rendering, crawler behavior, or landing content. It also recorded that future public visibility must require published status, editorial approval, medical approval or explicit `not_required`, non-deleted state, resolved canonical identity, and safe related entities.

### SEO-D3H3A Landing Content Review Model Decision Map

SEO-D3H3A established that existing service descriptions, specialty descriptions, provider descriptions, reviews, media captions, slugs, counts, keyword seed data, and generated content are not valid landing content sources. It established that future landing content must be unique per locale/country/family/canonical landing key, published, editorially approved, medically approved or explicitly not required, and tied to resolved canonical identity.

### SEO-D3H2 Area Canonicalization

SEO-D3H2 concluded that `areaSlug` alone is not canonical because `geo_areas.slug` uniqueness is scoped by `city_id`. Area-bearing route families must remain fail-closed until city-context routing, an approved `canonical_area_key`, or another approved canonical area identity model exists.

### SEO-D3H1 Blocker Resolution

SEO-D3H1 concluded that no further route integration or data-bearing landing query helper work should proceed until blockers are resolved. This RLS decision map documents one blocker area but does not remove blockers.

### SEO-D3F2 / SEO-D3E2 Fail-Closed Routes

SEO-D3E2 and SEO-D3F2 integrated service and service-area scaffold routes only in a fail-closed manner. Those routes validate locale/country, call fail-closed skeleton helpers, pass fail-closed input into the decision helper, and still end in `notFound()`. This document does not authorize changing those routes.

### SEO-D3D2B Skeleton Helper

SEO-D3D2B introduced skeleton landing gate helpers. Current landing helpers return fail-closed output with no source tables, no content payload, no Supabase usage, and no database queries. This document does not authorize a data-bearing helper.

### Decision Helper

The landing page decision helper remains a pure evaluator over supplied gate inputs. It does not fetch, resolve, canonicalize, publish, render, generate crawler signals, or expose content. This document does not authorize changing it.

### Route-Check Guardrails

Current route-check guardrails protect the fail-closed posture by checking selected route integrations, skeleton helper behavior, forbidden runtime/crawler/content tokens, and absence of forbidden route families. This document does not authorize route-check changes.

## 4. Current Blocker Posture

- No dedicated landing content table exists.
- No SQL or migration is authorized.
- No RLS implementation is authorized.
- The skeleton helper remains fail-closed.
- Public helpers cannot expose content payloads such as `title`, `intro`, `sections`, `faq`, reviewer data, admin notes, internal statuses, or metadata payloads.
- No route, crawler, metadata, sitemap, robots, `llms.txt`, schema, visible noindex, indexable page, public rendering, or public UI change is authorized.
- Area canonicalization still blocks area-bearing publishability because `areaSlug` alone is insufficient.
- Local relevance remains unresolved and must not be inferred from slugs, counts, provider density, city names, area names, taxonomy names, provider descriptions, or generated copy.
- Role semantics for landing editor, editorial reviewer, medical reviewer, and publisher are unresolved.
- Current generated database types do not include `public.landing_page_contents`; generated type changes are blocked until a future approved migration implementation phase.

## 5. Existing RLS Conventions

### RLS Enablement Style

Existing migrations enable RLS with direct `ALTER TABLE public.<table> ENABLE ROW LEVEL SECURITY;` statements. Public catalog RLS enables RLS for geo, taxonomy, providers, reviews, and media tables as a grouped pass. Later phases enable RLS for private review/report/media tables, monetization tables, legal/consent/audit tables, provider license records, and provider onboarding leads.

### Policy Naming Style

Existing policies generally use clear table/action/scope names:

- `<table>_public_select` for public catalog SELECT policies.
- `<table>_select_private_allowed` or `<table>_select_allowed` for authenticated helper-gated private reads.
- More explicit split names such as `provider_license_records_public_select_anon` and `provider_license_records_public_select_authenticated` when anon and authenticated policies are separated.

A future landing content policy should use explicit names such as `landing_page_contents_public_select` only after strict public predicates are approved. Authenticated/editor/reviewer/publisher policies should include action and role scope in the name.

### Public SELECT Patterns

Current public SELECT policies are explicit and fail-closed:

- Geo and taxonomy rows require `deleted_at IS NULL` and `is_active = true`.
- Public centers and doctors require `deleted_at IS NULL`, `is_active = true`, and active provider status.
- Child/provider relationship rows use parent `EXISTS` checks against active and non-deleted parent entities.
- Public reviews require non-deleted approved status.
- Public media requires non-deleted approved asset status, and later public media hardening requires explicit public visibility, approved media review status, allowed entity/usage kinds, and safe image MIME types.
- Public provider license records require explicit public visibility, approved license review status, non-empty license data, non-deleted state, and active related center or doctor.

### Authenticated, Private, and Admin Patterns

Authenticated private policies generally use `TO authenticated`, helper functions such as `public.can_view_review_private(id)`, `public.can_view_review_report(id)`, `public.can_view_media_asset_private(id)`, and `public.can_view_entity_media_private(id)`, plus `deleted_at IS NULL`.

Admin access is generally expressed through `public.is_platform_admin()`, which depends on a non-deleted profile linked to `auth.uid()` and `is_platform_admin = true`. Provider/private center access uses helper functions such as `public.can_view_center_private_data(...)` and center membership role checks.

### Helper Function Patterns

RLS helper functions are commonly SQL or PL/pgSQL, `STABLE`, `SECURITY DEFINER`, and set `search_path = public`. Helper functions typically:

- return false for null targets;
- allow platform admins where appropriate;
- resolve `public.current_profile_id()`;
- check non-deleted profile/entity rows;
- use active membership or related ownership/access predicates;
- avoid exposing raw private data directly.

### Anon and Authenticated Policy Patterns

Public reads commonly allow `TO anon, authenticated` when the same public predicate applies to both roles. Some policies split anon and authenticated when explicit role-specific policy naming or future extension clarity is desired. Private reads are generally `TO authenticated` only. Anonymous writes are not broadly used and remain highly constrained by security guardrails.

### Role and Permission Helper Functions

Current broad role helpers include:

- `public.current_profile_id()`
- `public.is_platform_admin()`
- `public.is_provider_user()`
- `public.is_patient_user()`

Current center access helpers include center-membership checks and center-scoped roles. These are not global landing content roles. No explicit landing editor, editorial reviewer, medical reviewer, publisher, SEO admin, or super admin role semantics are established for landing content.

### Soft-Delete Visibility Patterns

Current public and private policies generally require `deleted_at IS NULL`. Partial indexes commonly separate active rows from deleted rows. A future landing content policy must treat `deleted_at IS NOT NULL` as hidden for public and as non-public by default.

### Active, Status, and Review Visibility Patterns

Existing public visibility combines lifecycle and review gates:

- Geo/taxonomy: active and non-deleted.
- Providers: active, non-deleted, and active status.
- Reviews/media: approved and non-deleted.
- Contact visibility: safe false defaults and review statuses.
- Entity media: explicit public visibility and approved media review status.
- Provider license: explicit public visibility, approved license review status, non-empty public license field, and active related provider.

Future landing content must be at least as strict as these patterns.

### Review, Media, Provider, Contact, and License Visibility Policies

Reviews and media demonstrate the split between public approved rows and authenticated private helper-gated rows. Provider/contact/license visibility demonstrates explicit visibility flags and review statuses before public exposure. Landing content should follow the stricter combined model: lifecycle publication, editorial review, medical review, soft-delete exclusion, canonical identity, and related active entity checks.

### Row-Level, Not Column-Level, Risk

Current RLS policies are row-level. They restrict which rows a role can select, not which columns a role can see from an allowed row. A future `landing_page_contents` table is expected to contain payload fields and private reviewer/admin/audit fields. Strict table RLS is necessary but not enough to prevent payload or internal-field leaks if public helpers or clients read raw table rows. A future public-safe view or projection should be preferred for helper reads.

### Service-Role and Secret Handling

Security guardrails prohibit hardcoded service-role keys, exposing service-role keys in client bundles, logging tokens or auth cookies, and using public helpers to bypass RLS. Future public landing helpers must use anon/server-safe, RLS-enforced reads only and must not use service-role access.

### Generated Database Type Implications

Generated database types currently reflect existing tables, functions, enums, and views. Because `public.landing_page_contents` does not exist, it is not present in generated types. Any future migration that adds landing content enums, tables, policies, views, or functions must regenerate database types only in the same separately approved migration implementation phase. This document does not authorize generated type changes.

## 6. Future `landing_page_contents` RLS Goals

Conceptual only. Future RLS for `public.landing_page_contents` should aim for:

- public SELECT only for published rows;
- `editorial_review_status` approved;
- `medical_review_status` approved or explicitly `not_required`;
- `deleted_at IS NULL`;
- `canonical_landing_key` present and non-empty;
- canonical identity resolved;
- related country, service, specialty, city, and area rows active and non-deleted as applicable;
- area-bearing content requires `city_id` plus `area_id`, or a separately approved `canonical_area_key` model;
- no draft, pending, rejected, archived, or deleted visibility;
- no reviewer, admin, internal note, metadata payload, or audit actor exposure in public helper output;
- no service-role access in public helpers;
- public helpers expose derived booleans/status only, not raw rows or content payloads.

## 7. Public SELECT Policy Plan

This section is prose only and does not provide executable SQL.

A future public SELECT policy should be a narrow positive predicate. Future condition examples include:

- lifecycle status is `published`;
- editorial review status is `approved`;
- medical review status is in the approved or not-required states;
- `deleted_at` is absent;
- `canonical_landing_key` is present and non-empty;
- canonical identity is resolved and not ambiguous;
- related service row is active and non-deleted for service/service-area families;
- related specialty row is active and non-deleted for specialty/specialty-area families;
- related country row is active and non-deleted;
- related city and area rows are active and non-deleted for area-bearing families;
- area-bearing content has `city_id` plus `area_id`, or an approved canonical area key model;
- there is no broad SELECT for drafts, in-review rows, pending rows, rejected rows, archived rows, deleted rows, internal rows, or ambiguous rows.

No public access should be allowed if canonical identity is ambiguous, if area identity is unresolved, if related entity status is ambiguous, if review state is incomplete, or if the row is deleted or unpublished.

## 8. Authenticated, Editor, Reviewer, and Admin Policy Plan

This section is conceptual only. It does not authorize policies.

Future write/review/publish rules should be explicit:

| Action | Conservative future actor | Current status |
| --- | --- | --- |
| Create draft content | Explicit landing editor or platform admin, if approved | Blocked until role semantics exist |
| Update draft content | Draft creator with landing editor permission, landing editor, or platform admin, if approved | Blocked until role semantics exist |
| Submit for review | Explicit landing editor or platform admin, if approved | Blocked until role semantics exist |
| Approve editorial review | Explicit editorial reviewer or platform admin, if approved | Blocked until role semantics exist |
| Mark medical review `not_required` | Explicit medical/legal/product approver or platform admin under documented rules, if approved | Blocked until role semantics exist |
| Approve medical review | Explicit medical reviewer, if approved | Blocked until role semantics exist |
| Publish | Explicit publisher/admin after all gates pass, if approved | Blocked until role semantics exist |
| Archive/delete | Explicit content admin/platform admin with soft-delete semantics, if approved | Blocked until role semantics exist |

Current role and permission helpers are insufficient for a full landing content workflow. The future model needs an explicit landing editor, editorial reviewer, medical reviewer, and publisher decision. Until those role semantics are explicit, write, review, publish, archive, and delete policies must remain blocked.

Platform-admin-only management is possible only if later human product/legal/medical stakeholders explicitly approve that simplification. It must not be inferred from the current `is_platform_admin` helper alone.

## 9. Public Helper Boundary

A future public landing helper must remain a gate-data helper, not a content API.

The helper must not expose:

- `title`;
- `intro`;
- `sections`;
- `faq`;
- reviewer fields;
- admin/internal fields;
- raw content rows;
- raw Supabase or database errors;
- private metadata payloads;
- audit actor profile IDs.

The helper may only derive:

- `hasUniqueVisibleIntro`;
- `hasLocalRelevance`, only from a future approved local relevance source;
- `medicalReviewStatus`, mapped conservatively;
- `sourceTables`, only if approved and only as a bounded source list;
- entity and canonical flags such as `entityExists`, `canonicalIsUnique`, `entityIsAmbiguous`, `privateDataExcluded`, `helperAvailable`, and related active/deleted safety flags.

The helper must fail closed on:

- RLS denial;
- zero rows;
- multiple rows;
- draft rows;
- pending or in-review rows;
- rejected rows;
- archived rows;
- deleted rows;
- ambiguous related entity state;
- unresolved canonical identity;
- unresolved local relevance;
- missing or incomplete medical review;
- private-data risk;
- query errors or partial query failures.

## 10. Private Field Classification

Future `landing_page_contents` field classification:

| Field | Classification | Public/helper treatment |
| --- | --- | --- |
| `title` | Public-eligible only if published and approved | Not exposed by gate helper; future rendering requires separate approval |
| `intro` | Public-eligible only if published and approved | Helper may derive `hasUniqueVisibleIntro`; must not return intro text |
| `sections` | Public-eligible only if published and approved; medical/local risk | Not exposed by gate helper; separate rendering/content approval required |
| `faq` | Public-eligible only if separately approved, published, editorial-approved, and medically safe | Not exposed by gate helper; default disabled for public use |
| `status` | Helper-derived only / admin-visible raw field | Public helper may derive publish gate pass/fail; should not expose full raw workflow state |
| `editorial_review_status` | Helper-derived only / admin-reviewer raw field | Public helper may derive editorial gate pass/fail; should not expose full raw workflow state |
| `medical_review_status` | Helper-derived only with conservative public mapping | Public helper may return mapped `approved`, `not_required`, `required`, or `missing` only if approved by contract |
| `is_medical` | Admin/reviewer-only or helper-derived only | May inform internal medical gate; not public payload |
| `requires_medical_review` | Admin/reviewer-only or helper-derived only | May inform internal medical gate; not public payload |
| `created_by_profile_id` | Private always | Never public |
| `updated_by_profile_id` | Private always | Never public |
| `reviewed_by_profile_id` | Admin/reviewer-only | Never public |
| `medical_reviewer_profile_id` | Admin/reviewer-only | Never public |
| `published_by_profile_id` | Admin/reviewer-only | Never public by default |
| `reviewed_at` | Admin/reviewer-only | Never public by default |
| `medical_reviewed_at` | Admin/reviewer-only | Never public by default |
| `published_at` | Public-eligible only if future crawler/rendering phase approves; otherwise helper-derived only | Gate helper should not expose unless separately approved |
| `deleted_at` | Private/internal lifecycle field | Never public; used only for fail-closed gating |
| `canonical_landing_key` | Helper-derived identity/canonical field | May be used internally for uniqueness; avoid exposing raw rows |

## 11. View vs Direct Table Access

Strict table RLS is necessary but not enough for a payload-bearing landing content table because RLS is row-level rather than column-level.

Conceptual options:

| Option | Decision |
| --- | --- |
| Direct table with strict RLS | Necessary as a base protection, but risky for public helper reads because allowed rows may include payload and private reviewer/admin fields |
| Public-safe view/projection | Preferred conservative future option for helper reads; should expose only derived gate-safe fields and avoid payload/internal columns |
| RPC | Not approved now; should remain blocked unless a future task explicitly approves an RLS-safe RPC contract |
| Materialized gate table | Deferred; adds migration, refresh, staleness, and validation complexity |

Recommendation: a future implementation should combine strict table RLS with a public-safe view or projection before public helpers read landing content-derived data. No RPC, service-role, materialized gate table, or direct payload-bearing public helper access is approved by this document.

## 12. RLS Dependency on Roles

Current role/permission inspection shows broad profile booleans and helper functions for platform admin, provider user, and patient user. Center-scoped roles exist through center memberships and can include roles such as owner, admin, manager, staff, billing, sales, and editor for center-private access.

Landing editor, editorial reviewer, medical reviewer, and publisher roles do not currently exist as explicit global landing content semantics.

Future decisions:

- Block create/update/review/publish/archive/delete policies until landing content role semantics are explicit.
- Do not reuse center-scoped `editor` or center membership roles for global landing content without explicit approval.
- Do not infer medical reviewer authority from platform admin unless human product/legal/medical stakeholders approve that model.
- Platform-admin-only management may be considered later, but only as a documented human-approved role decision.

## 13. RLS Dependency on Related Entities

Future public visibility for `landing_page_contents` depends on related entity safety:

- `service_id` must reference an active, non-deleted service where applicable.
- `specialty_id` must reference an active, non-deleted specialty where applicable.
- Country identity must reference an active, non-deleted country or approved country primitive.
- `city_id` and `area_id` must reference active, non-deleted rows for area-bearing content.
- Provider counts and center counts do not authorize content visibility.
- Provider density, keyword demand, route slugs, area names, city names, service names, specialty names, or generated copy do not prove content approval.
- Area canonicalization remains required before area-bearing content is publishable.
- Local relevance remains separately unresolved and must be handled in a later approved plan.

## 14. Failure and Default Policy

Future landing content RLS and helper behavior should default to hidden/fail-closed:

- Missing row = hidden/fail-closed.
- Multiple rows = fail-closed.
- Draft, pending, in-review, rejected, archived, or deleted row = hidden/fail-closed.
- Related entity inactive or deleted = hidden/fail-closed.
- Ambiguous canonical identity = fail-closed.
- Ambiguous area identity = fail-closed.
- Ambiguous role = no write, review, publish, archive, or delete permission.
- Missing medical review = fail-closed unless explicitly `not_required`.
- Missing local relevance = fail-closed for area-bearing families.
- RLS uncertainty = block helper implementation.
- Public helper query error = generic helper unavailable; do not expose raw error details.
- No keyword fallback.
- No placeholder content.
- No crawler, sitemap, metadata, visible noindex, or indexability fallback.

## 15. RLS Implementation Ordering

Future only, if separately approved:

1. Migration creates landing content enums, table, constraints, indexes, and updated-at trigger.
2. RLS decision map is approved.
3. RLS is enabled for the table.
4. Admin/editor/reviewer/publisher policies are created only after role semantics are approved.
5. Public SELECT policy is created only after a strict predicate is approved.
6. RLS validation tests/static checks are added in a separate approved task.
7. Generated database types are regenerated only in the migration implementation phase.
8. Helpers/routes are not connected until RLS validation passes.
9. No seed data is added.
10. No crawler, sitemap, robots, `llms.txt`, metadata, schema, public UI, or public content integration is added in the RLS phase.

## 16. RLS Test Strategy

Plan only. Future RLS validation should include static checks and role behavior checks.

Static validation expectations:

- `public.landing_page_contents` has RLS enabled.
- No broad public policy such as an unconditional public SELECT exists.
- Public SELECT predicates include publication, editorial review, medical review, soft-delete, canonical identity, and related active entity gates.
- Private/admin/reviewer fields are not exposed through any public-safe view/helper projection.
- Service-role imports or bypass patterns are absent from public helpers/routes.
- Helpers/routes remain disconnected until RLS validation passes.

Behavior expectations:

- `anon` cannot see draft, in-review, pending, rejected, archived, or deleted rows.
- `anon` can see only published, editorial-approved, medical-approved-or-not-required, non-deleted, canonical rows with safe related entities.
- Authenticated non-editor cannot mutate landing content.
- Editor can draft/update only if an explicit role exists.
- Editorial reviewer can approve editorial review only if an explicit role exists.
- Medical reviewer can approve medical review only if an explicit role exists.
- Publisher/admin can publish only if an explicit role exists and all gates pass.
- Public view/helper must not expose reviewer/internal fields.
- Ambiguity and multiple-row cases fail closed.

## 17. Whether RLS Implementation Should Happen Next

No RLS implementation should happen next.

Reasons:

- No landing content table exists.
- No migration implementation is authorized.
- Role semantics are unresolved.
- Area canonicalization remains unresolved for area-bearing content.
- Local relevance remains unresolved.
- Public helpers and routes are fail-closed.
- No crawler, metadata, sitemap, robots, `llms.txt`, visible noindex, indexable page, or public rendering behavior is authorized.
- Human product/legal/medical review may still be required before schema or workflow implementation.

## 18. Recommended Next Subphase

Recommended next subphase: SEO-D3H3D — Local Relevance Source Plan.

This is conservative because local relevance remains a separate blocker for area-bearing landing pages and must not be inferred from slugs, provider counts, center counts, area names, city names, taxonomy names, keyword demand, or generated copy. RLS test strategy planning can follow later after local relevance and role semantics are clearer, or after human product/legal/medical stakeholders approve moving closer to implementation.

If human product/legal/medical stakeholders are unavailable to approve review semantics or role semantics, stop before migration or RLS implementation.

## 19. Exact Allowed Files for Next Recommended Task

If SEO-D3H3D is documentation-only, allowed files should be limited to one `docs/seo/*.md` file only.

No code, routes, migrations, generated types, package files, tests, crawler-facing files, public UI, public content, or data files should be edited by default.

## 20. Exact Forbidden Files for Next Recommended Task

Forbidden unless a later task explicitly approves them:

- routes under `src/app/**`;
- `scripts/routes-check.mjs`;
- helpers under `src/lib/catalog/**`;
- decision helpers under `src/lib/seo/**`;
- migrations under `supabase/migrations/**`;
- generated types under `supabase/types/**`;
- Supabase client/type files under `src/lib/supabase/**`;
- `package.json`;
- `pnpm-lock.yaml`;
- `vitest.config.ts`;
- `src/app/sitemap.ts`;
- `src/app/robots.ts`;
- `public/llms.txt`;
- `data/seo/**`;
- tests, unless an explicit RLS test phase is approved;
- public UI/content files;
- metadata, canonical, hreflang, Open Graph, schema, sitemap, robots, or `llms.txt` behavior;
- keyword seed runtime imports;
- API handlers, CMS records, analytics/crawler/background jobs;
- SQL, migrations, RLS policies, database queries, service-role usage, or Supabase usage.

## 21. Validation Expectations

For SEO-D3H3C-A, the expected validation commands are:

- `git status --short`
- `test -f docs/seo/LANDING_CONTENT_RLS_DECISION_MAP.md && echo "SEO-D3H3C-A landing content RLS decision map exists"`
- `pnpm test:unit`
- `pnpm env:check`
- `pnpm db:validate:migrations`
- `pnpm test:db:rls`
- `pnpm routes:check`
- `pnpm typecheck`
- `pnpm build`
- `pnpm lint`

No validation command may be faked or skipped silently. Any failure must be reported with the blocker and the smallest safe fix.
