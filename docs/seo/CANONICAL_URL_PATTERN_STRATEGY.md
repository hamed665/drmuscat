# Canonical URL Pattern Strategy

## 1. Status and Authority

This document is documentation-only for SEO-C. It does not authorize implementation, product features, route creation, migrations, API handlers, UI changes, business logic, Supabase generated types, validators, route checks, RLS tests, SEO checks, seed rows, database imports, CMS records, public SEO pages, article routes, provider pages, branded hospital pages, programmatic pages, schema output, sitemap changes, robots changes, `llms.txt` changes, analytics events, crawlers, background jobs, AI chat, or payment/business workflows.

The URL strategy in this document does not authorize route creation. Canonical pattern documentation does not authorize sitemap, schema, robots, or `llms.txt` changes.

If this document conflicts with V10.4 master-spec files, `AGENTS.md`, `README.md`, `docs/project-state/*`, existing route checks, current repository state, SEO-A, SEO-B, or stricter guardrails, the V10.4 master-spec, current repo state, route checks, and stricter guardrails win.

Future implementation requires a separate `PHASED_BUILD_ONLY` task with four-axis mapping, allowed files, forbidden scope, validation, and human approval. Keyword `target_url_pattern` and `route_status` values are planning data only and do not authorize route/page generation. Medical and branded-search URL usage requires future human approval where applicable.

## 2. Four-Axis Mapping

- Execution Phase: Phase 3 — Public SEO Platform
- Lock Scope: Phase 4 — Public SEO Pages / documentation-only planning for SEO-C
- Product Module: Phase 9 — SEO/CMS and Programmatic Pages
- Subphase ID: SEO-C

## 3. Relationship to Current Repo State, V10.4, SEO-A, and SEO-B

SEO-C records canonical URL strategy before any future SEO route, page, sitemap, schema, robots, `llms.txt`, CMS, article, or programmatic SEO implementation.

Current repository state is after the admin provider onboarding lead detail baseline. The approved implemented public surface is limited to localized Oman-first public catalog/detail foundations, public provider onboarding, callback/provider-onboarding lead capture APIs, protected root `/admin`, and read-only admin provider onboarding lead list/detail.

V10.4 remains the canonical execution-control framework. SEO-A establishes SEO/GEO/AI-search guardrails only. SEO-B keyword data remains planning data only. V10.5 addendums and SEO planning documents do not authorize implementation.

SEO-C must preserve:

- public localized routes under `/:locale/:country`
- approved launch locales `en` and `ar`
- approved launch country `om`
- root-level admin only
- no Persian/Hindi public SEO routes
- no duplicate or deprecated canonical route families
- no hidden AI-only content
- sitemap eligibility limited to canonical, public, indexable, supported, quality-gated pages
- medical and branded-search human-approval requirements

## 4. Current Approved Canonical Public URL Families

The following route families are the current approved public canonical families for this repository state. Their presence in this document does not authorize additional implementation or expansion.

| URL family | Status | Canonical notes |
| --- | --- | --- |
| `/[locale]/[country]` | `current_approved` | Localized country root for approved `en`/`ar` + `om` only. |
| `/[locale]/[country]/centers` | `current_approved` | Public centers discovery/catalog family. |
| `/[locale]/[country]/center/[centerSlug]` | `current_approved` | Singular center detail family for approved public center profiles. |
| `/[locale]/[country]/doctors` | `current_approved` | Public doctors discovery/catalog family. |
| `/[locale]/[country]/doctor/[doctorSlug]` | `current_approved` | Singular doctor detail family; current repo/current-state/routes-check contract treats this as the approved doctor detail pattern. |
| `/[locale]/[country]/for-providers` | `current_approved_public_provider_onboarding` | Public provider plans/onboarding page; not authorization for dashboards, billing, payment, or provider mutation workflows. |
| `/[locale]/[country]/labs` | `current_approved` | Public labs discovery/catalog family. |
| `/[locale]/[country]/pharmacies` | `current_approved` | Public pharmacies discovery/catalog family. |
| `/[locale]/[country]/search` | `current_approved_discovery_search_shell` | Public search shell. Search query/result URLs must not become sitemap-eligible or indexable without a future explicit approval task. |
| `/[locale]/[country]/services` | `current_approved` | Public services discovery/catalog family. |

## 5. Admin/API/Crawler-Facing Context

These files and routes exist for context only. SEO-C does not authorize changes to these files or routes.

| Surface | Exists now | SEO-C handling |
| --- | --- | --- |
| `/admin` | yes | Root-level only; protected admin baseline; not localized; not sitemap/public SEO eligible. |
| `/admin/provider-onboarding-leads` | yes | Read-only admin list baseline; not localized; not sitemap/public SEO eligible. |
| `/admin/provider-onboarding-leads/[leadId]` | yes | Read-only admin detail baseline; not localized; not sitemap/public SEO eligible. |
| `/api/callback-requests` | yes | API endpoint; non-SEO; not a canonical public page; not sitemap eligible. |
| `/api/provider-onboarding-leads` | yes | API endpoint; non-SEO; not a canonical public page; not sitemap eligible. |
| `src/app/sitemap.ts` | yes | Crawler-facing file exists; SEO-C does not authorize sitemap changes. |
| `src/app/robots.ts` | yes | Crawler-facing file exists; SEO-C does not authorize robots changes. |
| `public/llms.txt` | yes | Crawler/AI-facing file exists; SEO-C does not authorize `llms.txt` changes. |

## 6. Future Planning-Only URL Families

The following URL families are planning-only and must be marked `future_approval_required`. They do not exist now for SEO-C implementation purposes and are not approved for route creation, page generation, CMS records, schema output, sitemap inclusion, robots changes, or `llms.txt` changes.

| URL family | Status | Notes |
| --- | --- | --- |
| `/[locale]/[country]/centers/[specialtySlug]` | `future_approval_required` | Future specialty-center planning only. |
| `/[locale]/[country]/centers/[specialtySlug]/[areaSlug]` | `future_approval_required` | Future specialty + area center planning only. |
| `/[locale]/[country]/areas/[areaSlug]` | `future_approval_required` | Future area page planning only. |
| `/[locale]/[country]/services/[serviceSlug]` | `future_approval_required` | Future service page planning only. |
| `/[locale]/[country]/services/[serviceSlug]/[areaSlug]` | `future_approval_required` | Future service + area planning only. |
| `/[locale]/[country]/articles/[articleSlug]` | `future_approval_required` | Future article route planning only; article routes are not approved. |

## 7. Forbidden and Deprecated URL Patterns

The following URL patterns are forbidden, deprecated, unsupported, or blocked unless a future explicit route-contract approval changes them.

| Pattern | Status | Reason |
| --- | --- | --- |
| `/[locale]/centers` | `blocked` | Countryless localized centers route conflicts with Oman-first route model. |
| `/[locale]/doctors` | `blocked` | Countryless localized doctors route conflicts with Oman-first route model. |
| `/fa/*` | `unsupported_locale` | Persian public SEO routes remain forbidden. |
| `/hi/*` | `unsupported_locale` | Hindi public SEO routes remain forbidden. |
| `/[locale]/[country]/admin` | `blocked` | Admin routes must remain root-level, not localized. |
| localized admin routes | `blocked` | Admin routes must not exist under localized route trees. |
| `/en/dentist/al-khuwair` style shortcuts | `blocked` | Deprecated shortcut pattern competing with canonical route families. |
| duplicate route families competing with approved canonical patterns | `blocked` | One canonical URL family per intent/entity combination. |
| unsupported GCC country routes unless future approved | `unsupported_country` | GCC expansion is future-only. |
| public SEO routes for unsupported languages/countries | `unsupported_locale` / `unsupported_country` | Only `en`, `ar`, and `om` are approved for launch. |
| branded hospital/clinic pages unless explicitly approved later | `future_approval_required` | Branded pages require future legal/ethical/compliance/human approval. |
| article routes unless explicitly approved later | `future_approval_required` | Article routes are not approved in SEO-C. |
| `/[locale]/[country]/doctors/[doctorSlug]` | `blocked` | Plural doctor detail route is forbidden unless future explicit route-contract approval changes it. Current approved pattern is `/[locale]/[country]/doctor/[doctorSlug]`. |

## 8. Locale and Country Constraints

- Approved launch locales: `en`, `ar`.
- Approved launch country: `om`.
- Persian/Hindi public SEO routes remain forbidden unless a future explicit approval changes the route contract.
- GCC expansion is future-only and must not be inferred from keyword data, V10.5 addendums, SEO planning documents, or spreadsheet target URLs.
- Unsupported locales must be treated as `unsupported_locale`.
- Unsupported countries must be treated as `unsupported_country`.
- Future internal links, canonical URLs, hreflang references, sitemaps, schema references, and `llms.txt` references must not invent unsupported locale/country URLs.

## 9. Canonical and Hreflang Rules

- Each indexable public page must have exactly one canonical URL.
- Canonical URLs must use approved route families only.
- Canonical URLs must not point to blocked, unsupported, deprecated, duplicate, private, admin, API, thin, or `noindex_required` surfaces.
- There must be one canonical URL per intent/entity combination.
- Hreflang may reference only valid approved `en`/`ar` counterparts that exist and are approved for the same canonical intent/entity.
- Hreflang must not invent Persian, Hindi, GCC, unsupported-country, deprecated, duplicate, private, admin, API, thin, or blocked URLs.
- `x-default` is not authorized by SEO-C and may only be introduced if explicitly approved by a future SEO implementation task.

## 10. Indexability / Noindex Status Model

| Status | Meaning | Sitemap handling |
| --- | --- | --- |
| `indexable` | Public, canonical, supported locale/country, quality-gated, visible-content-backed, and explicitly approved for indexing. | May be eligible only after all sitemap rules pass. |
| `noindex_required` | Publicly reachable or planned but must be excluded from indexing because it is thin, duplicate, query-based, temporary, unsupported by content, stale, private-adjacent, or compliance-sensitive without approval. | Not sitemap eligible. |
| `blocked` | Must not be generated, linked, indexed, or treated as a public SEO route. | Not sitemap eligible. |
| `unsupported_locale` | Locale is not approved for public SEO route generation. | Not sitemap eligible. |
| `unsupported_country` | Country is not approved for public SEO route generation. | Not sitemap eligible. |
| `future_approval_required` | Planning-only family or keyword target; requires future explicit approved task before implementation. | Not sitemap eligible until future approval, implementation, and quality gates pass. |

## 11. Sitemap Eligibility Rules

A URL may be sitemap-eligible only when all of the following are true:

1. It uses an approved public canonical route family.
2. It uses an approved locale and country.
3. It is `indexable`, not `noindex_required`, `blocked`, `unsupported_locale`, `unsupported_country`, or merely `future_approval_required`.
4. It is public and not admin, API, private, provider-only, dashboard-only, mutation-only, or auth-only.
5. It is backed by visible, approved public content.
6. It passes quality gates for uniqueness, usefulness, entity clarity, localization, and non-duplication.
7. It has no unresolved medical, branded, compliance, schema, private-data, or route ambiguity.
8. It is not a search-query URL, thin page, deprecated shortcut, duplicate canonical, unsupported language/country page, or hidden AI-only surface.

Admin/private/provider-only/search-query/thin/unsupported/deprecated/duplicate pages must not be sitemap-eligible.

## 12. Programmatic SEO Route Approval Model

Programmatic SEO remains unapproved. Future programmatic route work may proceed only through a separate approved `PHASED_BUILD_ONLY` task that defines:

- four-axis mapping
- allowed files
- forbidden scope
- exact route families
- route impact
- data sources
- quality thresholds
- noindex/index rules
- canonical and hreflang rules
- sitemap eligibility
- schema eligibility, if any
- robots and `llms.txt` impact, if any
- medical/branded/compliance review needs
- validation commands
- human approval checkpoint

Planning-only URL families do not authorize route creation, page generation, indexing, sitemap inclusion, metadata generation, schema output, CMS publication, or automated programmatic SEO.

## 13. Keyword-Target URL Mapping Rules

- `data/seo/drmuscat-keyword-seed.json` is planning data only.
- Keyword `target_url_pattern` values do not authorize route/page generation.
- Keyword `route_status` values are planning data only.
- `route_status: planning_only` does not mean approved implementation.
- Spreadsheet target URLs retained in source metadata must not override the current route contract.
- Unsupported locale/country keyword rows must not create public SEO target URLs.
- Medical, cost, symptom, condition, emergency, insurance, service-information, comparison, commercial healthcare, branded, and competitor keyword groups require human review before publication-oriented use.
- Keyword data must not be imported into the database, used as seed rows, used to create CMS records, used to generate pages, or used to update sitemaps/schema/robots/`llms.txt` without a future explicit approved task.

## 14. AI-Search/GEO URL Discipline

AI-search and GEO readiness must use only visible, approved, public content on approved canonical URL families. SEO-C does not authorize AI chat, AI diagnosis, AI treatment advice, AI prescription advice, automated medical advice, LLM summary blocks, hidden AI-only text, crawler-only pages, `llms.txt` changes, crawlers, background jobs, analytics events, or schema output.

Future AI-search-ready URLs must preserve:

- entity clarity for DrMuscat, doctors, centers, pharmacies, labs, services, areas, and Oman context
- visible summaries based on approved public facts only
- internal links to approved canonical routes only
- no private data, admin notes, CRM notes, payment logs, private reviews, license files, claim evidence, receipts, or unpublished provider data
- no invented doctors, clinics, prices, brands, reviews, ratings, services, or medical claims

## 15. Medical Content and Branded-Search URL Safety

Medical content must be human-approved before publication. URL families or keyword targets involving medical explanations, conditions, symptoms, treatments, procedures, costs, emergency/urgent care, insurance, service guidance, or safety claims must remain planning-only, `noindex_required`, or blocked until an approved human review and implementation task defines publication rules.

Future public URL usage must not include diagnosis, prescription advice, treatment guarantees, invented doctors, invented clinics, invented prices, invented reviews, unsupported medical claims, or hidden schema/AI-only claims.

Branded and competitor-search URL usage requires future explicit legal/ethical/compliance and human approval where applicable. SEO-C does not authorize branded hospital pages, branded clinic pages, provider pages, competitor comparison pages, affiliation claims, schema output, sitemap inclusion, or CMS publication.

## 16. Conflict Handling and Stop Rules

If any route ambiguity, schema conflict, sitemap ambiguity, hreflang ambiguity, unsupported locale/country question, medical-content risk, branded-search risk, RLS/security ambiguity, missing dependency, failed command, or unclear requirement occurs, stop rather than guessing.

When conflicts appear, apply this order of strictness for SEO-C:

1. Direct task instructions and `PHASED_BUILD_ONLY` constraints.
2. Current repo state and current route checks.
3. V10.4 master-spec execution controls.
4. Existing SEO-A and SEO-B guardrails.
5. V10.5 addendums as documentation-only context.

The stricter guardrail wins.

## 17. Explicitly Out of Scope

SEO-C does not authorize:

- product features
- route creation
- migrations
- API handlers
- UI components
- business logic
- Supabase generated type changes
- validators
- route check changes
- RLS test changes
- SEO check changes
- seed rows
- keyword database imports
- article routes
- public SEO pages
- CMS records
- schema output
- sitemap changes
- robots changes
- `llms.txt` changes
- analytics events
- crawlers
- background jobs
- AI chat
- provider pages
- branded hospital pages
- programmatic pages
- payment, billing, checkout, sales, referral, or analytics implementation

## 18. Validation Expectations

A future SEO-C documentation implementation task should validate that only the approved documentation files changed and that the broader repository remains healthy. Expected commands:

```bash
git status --short
test -f docs/seo/CANONICAL_URL_PATTERN_STRATEGY.md && test -f docs/seo/SEO_ROUTE_CONTRACT.md && echo "SEO-C docs exist"
pnpm env:check
pnpm db:validate:migrations
pnpm test:db:rls
pnpm routes:check
pnpm typecheck
pnpm build
pnpm lint
```

No validation command may be faked or skipped silently. `pnpm lint` may show warnings only, but must have no errors. Failed commands must be reported as blockers with the smallest safe fix.
