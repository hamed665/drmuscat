# SEO-D3H2 — Area Canonicalization Decision Map

## 1. Status and Authority

This document is documentation-only for SEO-D3H2. It records the current area canonicalization decision map for DrMuscat public SEO landing pages, especially the ambiguity created by using `areaSlug` without city context.

This document does not authorize implementation. It does not authorize route integration, data-bearing query helpers, route-check changes, migrations, metadata, canonical tags, hreflang tags, Open Graph metadata, sitemap changes, schema output, robots changes, `llms.txt` changes, visible noindex pages, indexable pages, landing content generation, keyword seed runtime usage, Supabase usage, database queries, CMS records, API handlers, seed rows, crawler behavior, public UI, provider listings, center listings, medical copy, service descriptions, local area descriptions, payment, monetization, sponsored placement, ranking, referral, commission, entitlement, or plan logic.

Future implementation requires a separate approved `PHASED_BUILD_ONLY` task with explicit four-axis mapping, allowed files, forbidden files, route impact, database/RLS impact, SEO/crawler impact, validation commands, and human approval. If this document conflicts with `AGENTS.md`, `README.md`, project-state files, V10.4 master-spec files, V10.5 addendums, existing route checks, SEO-D3H1, SEO-D3G1, existing helper contracts, or stricter SEO/security guardrails, the stricter instruction wins.

## 2. Four-Axis Mapping

- Execution Phase: Phase 3 — Public SEO Platform
- Lock Scope: Phase 4 — Public SEO Pages / area canonicalization documentation-only decision map
- Product Module: Phase 9 — SEO/CMS and Programmatic Pages
- Subphase ID: SEO-D3H2

## 3. Relationship to Prior Phases

### SEO-D3H1

SEO-D3H1 concluded that no further route integration or data-bearing public landing query helper work should proceed until blocker resolution happens first. It identified area canonicalization / area slug ambiguity as a foundational blocker for area and area-bearing landing routes.

SEO-D3H2 resolves that planning thread conservatively: current area-bearing routes must remain fail-closed for publishable and data-bearing behavior until canonical area identity is proven by either city-context routing, a canonical area key, or another separately approved model.

### SEO-D3G1

SEO-D3G1 concluded that remaining SEO-D2 scaffold routes should not be integrated further because repeated fail-closed route integration can create false readiness without solving schema, content, and policy blockers. SEO-D3H2 preserves that conclusion. It does not select a new route for integration.

### SEO-D3F2

SEO-D3F2 integrated the service-area scaffold route only in a fail-closed manner. That route validates locale/country, calls the fail-closed service-area skeleton helper, passes helper input into the decision helper, and still always ends in `notFound()`. SEO-D3H2 does not broaden that integration and does not make service-area area identity data-bearing.

### SEO-D3E2

SEO-D3E2 integrated the service scaffold route only in a fail-closed manner. SEO-D3H2 does not change service-route behavior.

### SEO-D3D2B Skeleton Helper

The SEO-D3D2B skeleton helper exports landing gate helpers for area-bearing and non-area-bearing families, but all current helpers remain fail-closed. In particular:

- `getAreaLandingGateData(...)` remains skeleton/fail-closed;
- `getServiceAreaLandingGateData(...)` remains skeleton/fail-closed;
- `getSpecialtyAreaLandingGateData(...)` remains skeleton/fail-closed.

SEO-D3H2 does not authorize any helper to become data-bearing.

### Decision Helper

The landing page decision helper remains a pure gate evaluator over already-supplied inputs. SEO-D3H2 does not authorize the decision helper to fetch, resolve, canonicalize, render, publish, or generate crawler signals.

### Route-Check Guardrails

Current route-check guardrails allow only explicitly selected service/service-area route integrations and forbid public landing query skeleton tokens or landing gate helper references in other app routes. SEO-D3H2 does not change route-check. Future area route integration or route-shape changes require a separate route-check phase.

## 4. Current Geo Schema Evidence

### Country Modeling

`geo_countries` contains:

- `id` as primary key;
- `code country_code not null unique`;
- `slug text not null unique`;
- localized names;
- `is_active`;
- `deleted_at`.

Country identity is globally unique by both `code` and `slug`. This is sufficient for the existing `[country]` segment in principle, assuming the route country maps to the supported country code/slug model in a future approved implementation.

### City Modeling

`geo_cities` contains:

- `id` as primary key;
- `country_id` referencing `geo_countries`;
- optional `region_id`;
- `slug`;
- localized names;
- `is_active`;
- `deleted_at`;
- unique constraint `geo_cities_country_id_slug_key unique (country_id, slug)`.

City slug uniqueness is scoped to country. A future city-context area route can use country plus city slug to resolve a city candidate before resolving area.

### Area Modeling

`geo_areas` contains:

- `id` as primary key;
- `country_id` referencing `geo_countries`;
- optional `region_id`;
- required `city_id` referencing `geo_cities`;
- `slug`;
- localized names;
- optional latitude/longitude;
- `is_active`;
- `deleted_at`;
- unique constraint `geo_areas_city_id_slug_key unique (city_id, slug)`.

Area slug uniqueness is scoped to city, not country and not globally. Therefore `areaSlug` under `[country]` alone is not a proven canonical area identity.

### Active / Deleted / Public Visibility Fields

The geo tables include `is_active` and `deleted_at` fields. Public RLS policies for `geo_countries`, `geo_regions`, `geo_cities`, and `geo_areas` allow `SELECT` to `anon` and `authenticated` only when `deleted_at IS NULL AND is_active = true`.

These public RLS policies are necessary for public-safe reads in already-approved catalog contexts, but they do not solve canonical route identity. Public visibility is not the same as canonical uniqueness.

## 5. Current Route Evidence

### `/[locale]/[country]/areas/[areaSlug]`

- Includes city context: no.
- Can uniquely resolve `geo_areas` today: no, because `geo_areas.slug` is unique by `city_id`, not by country.
- Current fail-closed behavior: the route validates locale/country and calls `notFound()` unconditionally.
- Crawler status: not included in sitemap, robots, or `llms.txt`; no metadata/canonical/hreflang/schema is emitted.
- SEO-D3H2 decision: keep fail-closed for publishable/data-bearing behavior.

### `/[locale]/[country]/services/[serviceSlug]/[areaSlug]`

- Includes city context: no.
- Can uniquely resolve `geo_areas` today: no, because `areaSlug` alone is not a canonical area key under country.
- Current fail-closed behavior: the route validates locale/country, calls `getServiceAreaLandingGateData(...)`, evaluates `decideLandingPageGate(...)`, and still always ends in `notFound()`.
- Crawler status: not included in sitemap, robots, or `llms.txt`; no metadata/canonical/hreflang/schema is emitted.
- SEO-D3H2 decision: keep fail-closed for publishable/data-bearing behavior.

### `/[locale]/[country]/centers/[specialtySlug]/[areaSlug]`

- Includes city context: no.
- Can uniquely resolve `geo_areas` today: no, because `areaSlug` alone is not a canonical area key under country.
- Current fail-closed behavior: the route validates locale/country and calls `notFound()` unconditionally.
- Crawler status: not included in sitemap, robots, or `llms.txt`; no metadata/canonical/hreflang/schema is emitted.
- SEO-D3H2 decision: keep fail-closed for publishable/data-bearing behavior.

## 6. Core Problem Statement

`geo_areas.slug` uniqueness is scoped by `city_id`. Current area-bearing route shapes do not include `citySlug` or any other city-context segment. Therefore `areaSlug` alone under `[country]` is not sufficient for canonical area identity.

The current area-bearing routes must remain fail-closed for publishable and data-bearing behavior. A route returning `notFound()` is safe as a scaffold; a route resolving data, publishing content, emitting metadata/canonical/hreflang/schema, or entering sitemap/robots/`llms.txt` is not safe until canonical area identity is resolved.

## 7. Decision Options

### Option A — Keep `/[locale]/[country]/areas/[areaSlug]` but Require Country-Wide Unique Area Slugs

**Description:** Keep the current route shape and add a future invariant that `geo_areas.slug` must be unique within a country.

**Pros:**

- Preserves short URLs.
- Minimal route-design change.
- Easier user-facing path if Oman area slugs are curated to be unique.

**Cons:**

- Conflicts with current schema, where uniqueness is `(city_id, slug)`.
- Requires auditing existing/future areas for country-wide collisions.
- Still needs a policy for areas with the same common name across cities.
- May force unnatural slugs to avoid collisions.

**Schema impact:** likely requires a new uniqueness constraint, generated/canonical slug field, or validation process.

**Route impact:** current route shape could remain if the new invariant is proven.

**Sitemap/canonical impact:** sitemap/canonical generation must wait until country-wide uniqueness is enforced and validated.

**Migration likely:** yes.

**SEO risk:** medium to high until uniqueness is proven; low only after enforced canonical uniqueness.

**Implementation risk:** medium; retrofitting uniqueness can conflict with existing or future area data.

**Recommendation status:** defer. Do not assume country-wide uniqueness silently.

### Option B — Change Canonical Route Shape to Include City Context

**Description:** Use a future route shape such as `/[locale]/[country]/areas/[citySlug]/[areaSlug]` or an equivalent city-context route.

**Pros:**

- Aligns with current schema: cities are unique by `(country_id, slug)`, and areas are unique by `(city_id, slug)`.
- Avoids forcing country-wide area slug uniqueness.
- Makes canonical area identity explicit.
- Better preserves real-world geographic hierarchy.

**Cons:**

- Requires new route shape and route-check planning.
- Existing scaffold route `/areas/[areaSlug]` cannot become the canonical publishable route without redirect/canonical decisions.
- URL length increases.
- Requires future sitemap/canonical/hreflang strategy.

**Schema impact:** may not require immediate schema changes if country + city slug + area slug resolution is sufficient; may still need canonical landing keys for content mapping.

**Route impact:** likely requires new route directory and an explicit decision about what to do with existing `/areas/[areaSlug]` scaffold.

**Sitemap/canonical impact:** sitemap and canonical output must use the city-context canonical route only after separate approval.

**Migration likely:** no for basic identity if current schema is sufficient; yes if landing content/canonical keys are stored separately.

**SEO risk:** lower than Option A once implemented carefully; current risk remains high until implemented and approved.

**Implementation risk:** medium because route shape, route-check, redirects, and content mapping require coordinated phases.

**Recommendation status:** preferred future direction for canonical identity, pending a separate plan.

### Option C — Add `canonical_area_slug` / `canonical_area_key`

**Description:** Add a future globally or country-unique canonical area key while preserving current city-scoped `slug` for local display/legacy relationships.

**Pros:**

- Can preserve short canonical URLs if the key is country/global unique.
- Avoids overloading existing `geo_areas.slug` semantics.
- Provides a stable key for landing content, metadata, sitemap, and redirects.
- Can support city disambiguation inside the key when needed.

**Cons:**

- Requires schema/model design.
- Requires backfill and governance for future area records.
- Could create confusion between display slug and canonical landing slug/key.
- Requires uniqueness constraints and editorial/admin tooling in later phases.

**Schema impact:** likely new column(s), uniqueness constraint(s), and validation rules.

**Route impact:** current route could use canonical key in a later phase, or city-context route could still be preferred.

**Sitemap/canonical impact:** sitemap/canonical output must wait until the key is populated, unique, and approved.

**Migration likely:** yes.

**SEO risk:** medium until key governance exists; potentially low after enforcement.

**Implementation risk:** medium to high because it touches schema, data governance, content mapping, and redirects.

**Recommendation status:** acceptable future alternative or complement to Option B; requires migration planning later.

### Option D — Keep Existing Routes Permanently Fail-Closed Until a Later Migration/Model Is Approved

**Description:** Make no route, helper, crawler, metadata, or schema changes now. Keep existing area-bearing routes as fail-closed scaffolds until a future approved canonical identity model exists.

**Pros:**

- Safest immediate behavior.
- Prevents ambiguous public URLs.
- Avoids premature metadata/sitemap/canonical commitments.
- Avoids data-bearing helper false readiness.
- Preserves current route-check and crawler isolation.

**Cons:**

- Does not create publishable area pages.
- Delays area, service-area, and specialty-area SEO expansion.
- Leaves current scaffold routes non-public and non-indexable.

**Schema impact:** none now.

**Route impact:** none now.

**Sitemap/canonical impact:** none now; area-bearing routes stay absent.

**Migration likely:** no now; later likely depending on chosen identity model.

**SEO risk:** low now because ambiguous pages are not published; opportunity cost exists.

**Implementation risk:** low now.

**Recommendation status:** immediate required policy.

## 8. Recommended Decision

The conservative decision is:

1. Do not publish or data-enable the current `/[locale]/[country]/areas/[areaSlug]` route until canonical uniqueness is resolved.
2. Prefer a city-context canonical route or a canonical area key over silently assuming country-wide area slug uniqueness.
3. Keep all current area-bearing routes fail-closed.
4. Treat Option D as the immediate policy.
5. Treat Option B as the preferred future route-identity direction unless a later approved plan chooses Option C or a country-wide uniqueness model.

This decision blocks area-bearing publishable/data-bearing behavior now. It does not implement the future route shape or canonical key.

## 9. Immediate Policy

- The area route remains not integrated beyond its fail-closed scaffold.
- `getAreaLandingGateData(...)`, `getServiceAreaLandingGateData(...)`, and `getSpecialtyAreaLandingGateData(...)` outputs must keep `canonicalIsUnique: false` unless canonical uniqueness can be proven in a future approved phase.
- `hasLocalRelevance` remains `false` until an approved local relevance source exists.
- No metadata, sitemap, schema, canonical, hreflang, Open Graph, robots, or `llms.txt` behavior is authorized for area-bearing routes.
- No visible noindex or indexable area pages are authorized.
- No landing content, local area description, service description, medical content, or keyword seed runtime usage is authorized.

## 10. Future Migration/Model Needs

Future approved phases may need to plan one or more of the following:

- city-context route model such as `/[locale]/[country]/areas/[citySlug]/[areaSlug]`;
- `canonical_area_key` or `canonical_area_slug` model;
- country-level or global uniqueness constraints if short area routes are retained;
- redirect/canonical migration if old scaffold route shapes must redirect or remain 404;
- landing content table keyed to canonical area identity;
- local relevance table/source keyed to canonical area identity;
- route-check updates for any future route shape;
- sitemap/canonical/hreflang isolation and publication checks.

No migration implementation is authorized by this document.

## 11. Query Helper Implications

- `getAreaLandingGateData(...)` remains skeleton/fail-closed.
- `getServiceAreaLandingGateData(...)` remains skeleton/fail-closed.
- `getSpecialtyAreaLandingGateData(...)` remains skeleton/fail-closed.
- No data-bearing area helper is authorized until canonical area identity, local relevance source, landing content review model, medical review model, and count policy blockers are resolved.
- Area-bearing helper outputs must not infer canonical uniqueness from `areaSlug` alone.
- Area-bearing helper outputs must not infer local relevance from counts, slugs, keyword demand, or provider density.

## 12. Route-Check Implications

No route-check changes are authorized now.

Future route-check behavior should continue to forbid area route integration until a separate approved task explicitly selects an area-bearing route/helper combination. If a future route shape changes, route-check and sitemap/crawler isolation must be updated in a separate phase with explicit allowed files and validation commands.

Any future selected route hardening should assert:

- exact selected route/helper allowlisting only;
- final unconditional fail-closed behavior until publication is approved;
- no JSX/public content rendering unless explicitly approved;
- no metadata/schema/canonical/hreflang/sitemap/robots/`llms.txt` behavior unless explicitly approved;
- no Supabase/public catalog runtime/keyword seed/private/admin/monetization tokens unless explicitly approved.

## 13. Sitemap/Crawler Implications

- No area-bearing route should be added to sitemap now.
- `robots.ts` should not mention area-bearing landing routes now.
- `llms.txt` should not mention area-bearing landing routes now.
- No canonical or hreflang output should exist for area-bearing routes until canonical route identity is resolved.
- No schema output should exist for area-bearing routes until data/content/review readiness is separately approved.

## 14. Open Blockers After This Document

SEO-D3H2 resolves only the decision posture for area canonicalization: current `areaSlug`-only routes are blocked for publishable/data-bearing behavior until canonical identity is proven.

The following blockers remain open:

- local relevance source;
- landing content review model;
- medical review model;
- unclaimed listing policy;
- data-bearing helper readiness;
- specialty relationship semantics for specialty-bearing routes;
- future sitemap/canonical/hreflang strategy after canonical route identity is approved;
- future redirect policy if current scaffold route shapes are replaced.

## 15. Recommended Next Subphase

Recommended next subphase: **SEO-D3H3 Landing Content Review Model Plan**.

Justification:

- Area canonical identity alone is not enough to publish pages.
- Even a perfectly unique area route must remain non-publishable without approved landing intro content, review status, and medical/non-medical classification.
- A landing content review model is foundational for `hasUniqueVisibleIntro`, `medicalReviewStatus`, future local relevance content, and publication readiness across all landing families.
- This next subphase should remain PLAN ONLY or documentation-only and must not add migrations, content records, routes, metadata, sitemap, schema, or public UI.

## 16. Validation Expectations

For SEO-D3H2 documentation-only implementation, validation should run after creating this document:

1. `git status --short`
2. `test -f docs/seo/AREA_CANONICALIZATION_DECISION_MAP.md && echo "SEO-D3H2 area canonicalization doc exists"`
3. `pnpm test:unit`
4. `pnpm env:check`
5. `pnpm db:validate:migrations`
6. `pnpm test:db:rls`
7. `pnpm routes:check`
8. `pnpm typecheck`
9. `pnpm build`
10. `pnpm lint`

Expected file-change result: only `docs/seo/AREA_CANONICALIZATION_DECISION_MAP.md` is created. No code, route, route-check, migration, test, sitemap, robots, `llms.txt`, metadata, schema, public UI, or helper behavior changes are expected.
