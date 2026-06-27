# DrKhaleej Route Indexability Snapshot V1

## Purpose

This snapshot records the fast-launch route indexability state after the current import profile guard, sitemap guard, and smoke-check work.

It is documentation and validation support only. It does not approve new route families, database publishing, imported provider activation, ads rendering, offers rendering, user-generated content, appointment workflows, payments, or provider dashboard work.

## Source of truth

| Surface | Source |
| --- | --- |
| Static SEO route registry | `src/lib/seo/page-registry.ts` |
| Static sitemap output | `src/app/sitemap.ts` via `listSitemapEligibleSeoPageDefinitions()` |
| Imported sitemap output | `src/app/sitemap.ts` via `listPublicImportSitemapEntries()` |
| Static metadata and robots | `src/lib/seo/metadata.ts` via `buildLocalizedMetadata()` |
| Public robots file | `src/app/robots.ts` |
| LLM route declaration | `public/llms.txt` |
| Imported doctor profile guard | `src/server/public/import-doctor-profile-guard.ts` |
| Imported pharmacy profile guard | `src/server/public/import-pharmacy-profile-guard.ts` |
| Imported hospital profile guard | `src/server/public/import-hospital-profile-guard.ts` |
| Imported sitemap guard and family caps | `src/server/public/import-sitemap.ts` |
| Import publish readiness audit | `src/server/admin/import-publish-readiness-audit.ts` |
| Cross-family profile smoke validator | `scripts/import/check-public-import-profile-smoke.mjs` |

## Static public route snapshot

Canonical and hreflang are generated through the shared localized metadata helper for every supported locale/country pair. Static routes that are not sitemap-ready receive `noindex, follow` metadata while remaining crawlable enough for internal navigation and future promotion.

| Route | Localized URLs | Index policy | Readiness | Sitemap | Robots | Snapshot decision | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `/en/om`, `/ar/om` | `index` | `ready` | included | default indexable | index-ready | Keep as launch root. |
| `/doctors` | `/en/om/doctors`, `/ar/om/doctors` | `index` | `ready` | included | default indexable | index-ready | Bind reviewed public data and watch thin-listing signals. |
| `/centers` | `/en/om/centers`, `/ar/om/centers` | `index` | `ready` | included | default indexable | index-ready | Keep as trust directory. |
| `/labs` | `/en/om/labs`, `/ar/om/labs` | `index` | `ready` | included | default indexable | index-ready | Keep as trust directory; imported lab profiles remain blocked until their dedicated guard exists. |
| `/pharmacies` | `/en/om/pharmacies`, `/ar/om/pharmacies` | `index` | `ready` | included | default indexable | index-ready | Public list is ready; imported pharmacy profiles are allowed only through guarded import rows. |
| `/hospitals` | `/en/om/hospitals`, `/ar/om/hospitals` | `index` | `ready` | included | default indexable | index-ready | Public list is ready; imported hospital profiles are allowed only through guarded import rows. |
| `/services` | `/en/om/services`, `/ar/om/services` | `index` | `ready` | included | default indexable | index-ready | Keep as core service hub; money pages remain gated separately. |
| `/for-providers` | `/en/om/for-providers`, `/ar/om/for-providers` | `index` | `ready` | included | default indexable | index-ready | Keep as provider acquisition page. |
| `/dental` | `/en/om/dental`, `/ar/om/dental` | `noindex_until_ready` | `needs_content` | excluded | `noindex, follow` | sitemap-excluded | Promote only after real dentist/dental clinic data and local intro/FAQ/linking are ready. |
| `/beauty` | `/en/om/beauty`, `/ar/om/beauty` | `noindex_until_ready` | `needs_content` | excluded | `noindex, follow` | sitemap-excluded | Promote only after beauty/aesthetic provider data and safety copy are ready. |
| `/offers` | `/en/om/offers`, `/ar/om/offers` | `noindex_until_ready` | `blocked` | excluded | `noindex, follow` | sitemap-excluded | Keep blocked until the official offers engine and offer-claims gate exist. |
| `/pet-clinics` | `/en/om/pet-clinics`, `/ar/om/pet-clinics` | `noindex_until_ready` | `blocked` | excluded | `noindex, follow` | sitemap-excluded | Out of fast healthcare launch unless explicitly reapproved. |
| `/pet-shops` | `/en/om/pet-shops`, `/ar/om/pet-shops` | `noindex_until_ready` | `blocked` | excluded | `noindex, follow` | sitemap-excluded | Out of fast healthcare launch unless explicitly reapproved. |
| `/search` | `/en/om/search`, `/ar/om/search` | `noindex_until_ready` | `needs_content` | excluded | `noindex, follow` | sitemap-excluded | Keep as utility route until real result pages and no thin-search policy exist. |

## Dynamic imported provider route snapshot

Imported profile URLs are not indexable by route existence alone. A URL may enter the public index only when the family-specific profile guard, import publish queue, approved candidate record, reviewed source evidence, local Oman geo signal, contact/map signal, safe canonical pattern, import sitemap guard, family cap, and smoke validator all agree.

| Route family | Example canonical pattern | Public route status | Sitemap status | Indexability status | Snapshot decision | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Imported doctor profile | `/en/om/doctor/{slug}` and `/ar/om/doctor/{slug}` | route guard exists and smoke-checked | allowed only through guarded import sitemap rows | allowed only when queue metadata is `index`, `included`, exact canonical match, reviewed evidence exists, and approved candidate exists | guarded index path exists | Use for a small reviewed doctor batch only. |
| Imported pharmacy profile | `/en/om/pharmacies/{slug}` and `/ar/om/pharmacies/{slug}` | route guard exists and smoke-checked | allowed only through guarded import sitemap rows | allowed only when queue metadata is `index`, `included`, exact canonical match, reviewed evidence exists, and approved candidate exists | guarded index path exists | Use for a small reviewed pharmacy batch only. |
| Imported hospital profile | `/en/om/hospitals/{slug}` and `/ar/om/hospitals/{slug}` | route guard exists and smoke-checked | allowed only through guarded import sitemap rows | allowed only when queue metadata is `index`, `included`, exact canonical match, reviewed evidence exists, and approved candidate exists | guarded index path exists | Use for a small reviewed hospital batch only. |
| Imported lab profile | `/en/om/labs/{slug}` and `/ar/om/labs/{slug}` | not yet guarded | blocked | blocked | future | Build dedicated lab guard only after first doctor/pharmacy/hospital batches pass audit. |
| Imported center profile | `/en/om/center/{slug}` and `/ar/om/center/{slug}` | existing center detail foundation only | not part of fast import sitemap expansion | gated by existing public data | partial | Do not expand imported center sitemap in the first clean launch batch. |

## Import sitemap caps

`SITEMAP-GUARD-B import-sitemap-family-caps-v1` limits reviewed imported sitemap entries per family:

- doctor: `3000`
- pharmacy: `1500`
- hospital: `500`

These caps sit behind the same reviewed-evidence gate. They do not publish unreviewed rows and they do not replace the import publish readiness audit.

## Launch sitemap allowlist

Fast-launch sitemap surfaces are limited to:

- `/en/om`
- `/ar/om`
- `/en/om/doctors`
- `/ar/om/doctors`
- `/en/om/centers`
- `/ar/om/centers`
- `/en/om/labs`
- `/ar/om/labs`
- `/en/om/pharmacies`
- `/ar/om/pharmacies`
- `/en/om/hospitals`
- `/ar/om/hospitals`
- `/en/om/services`
- `/ar/om/services`
- `/en/om/for-providers`
- `/ar/om/for-providers`
- guarded imported doctor profile URLs only when `import_publish_queue` says `index`, `included`, `sitemap_included: true`, `robots_policy: index`, and the canonical path is exact.
- guarded imported pharmacy profile URLs only when `import_publish_queue` says `index`, `included`, `sitemap_included: true`, `robots_policy: index`, and the canonical path is exact.
- guarded imported hospital profile URLs only when `import_publish_queue` says `index`, `included`, `sitemap_included: true`, `robots_policy: index`, and the canonical path is exact.

## Blocked from first clean launch sitemap

The following are intentionally excluded until real data/content/claim gates exist:

- Dental and beauty money hubs.
- Offers route and offer cards.
- Search utility route.
- Pet clinic and pet shop legacy routes.
- Lab profile sitemap entries.
- Imported center profile sitemap entries.
- Area/service/specialty programmatic pages.
- Article CMS and generated article pages.
- User-generated content, appointment, payment, and provider dashboard routes.

## Current guard milestones

- `IMPORT-QA-A import-publish-readiness-audit-v1`
- `SITEMAP-GUARD-B import-sitemap-family-caps-v1`
- `PROFILE-SMOKE-A import-profile-smoke-v1`

## First launch decision

The next implementation step should be the first real import QA run for doctor/pharmacy/hospital data, followed by a limited reviewed batch. New lab profile guard work should wait until the existing three profile families prove clean under the audit, smoke check, and sitemap family caps.