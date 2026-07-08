# DrKhaleej SEO and Geo Roadmap 2026 v1

Status: canonical roadmap and implementation order.
Scope: documentation and validation only.
Build mode: phased, fail-closed, engine-first, public-route-last.

## Purpose

This roadmap keeps DrKhaleej oriented while it expands from manual healthcare catalog pages into a multi-vertical, geo-aware, SEO-first discovery platform for Oman and later GCC markets.

The goal is to rank across provider, specialty, service, city, area, neighborhood, and related-care searches without creating fragile one-off cards, hardcoded URLs, or unsafe public pages.

## Current operating rule

The project must continue from the current fail-closed state:

- imported hospital public detail stays held
- imported hospital discovery stays held until explicit release gates pass
- imported hospital sitemap promotion stays held
- route expansion is blocked until canonical, internal link, hreflang, sitemap, payload, and shared-card foundations exist
- public pages must use public-safe projections, not raw import payloads

## Core architecture

All public discovery surfaces must move through one central pipeline:

```text
Entity Registry
→ Geo Registry
→ Canonical Route Resolver
→ Search Intent Contract
→ Relation Engine
→ Internal Link Engine
→ Hreflang Projection
→ Sitemap Eligibility Gate
→ Page Payload Projection
→ Shared Card View Model
→ Server-rendered Integrations
→ First Indexable Batch
→ Imported Hospital Controlled Release
```

Cards, pages, search results, sitemap builders, and schema builders must not make independent SEO decisions.

## Supported entity families

The roadmap must support these public entity families through shared contracts:

```text
doctor
hospital
clinic
dental_clinic
dentist
pharmacy
lab
imaging_center
beauty_clinic
charity_center
pet_clinic
pet_shop
service
specialty
department
article
geo_area
```

Family-specific behavior is allowed only in policy/adapters. It must not be spread across cards or route components.

## Doctor multi-practice rule

A doctor has one canonical doctor profile.

A doctor may have many practice locations and may work at several hospitals, clinics, or dental centers.

Practice relations must be represented as relations, not duplicated doctor profiles.

Required future source behavior:

```text
doctor
→ doctor_practice_locations
→ center / hospital / clinic / dental_clinic
→ center_location
→ geo area / city / country
```

## Geo-first model

Geo is a ranking and navigation primitive, not decoration.

The hierarchy is:

```text
Country
→ Governorate
→ Wilayat / City
→ Area
→ Neighborhood or landmark, optional
→ Provider location
```

Geo matching and recommendations should rank by:

```text
1. same exact area
2. same city or wilayat
3. coordinate distance
4. same specialty or service
5. source quality and verification
6. profile completeness
7. freshness
8. sponsored placement later, separate from organic validity
```

Geo pages may become indexable only after minimum inventory, unique content, breadcrumb, canonical, hreflang, and internal-link coverage pass.

## Canonical route resolver

No component, card, search result, sitemap builder, or schema builder may construct provider URLs directly.

The canonical resolver must return:

```ts
{
  canonicalPath: string | null;
  routeFamily: string;
  publicRouteEnabled: boolean;
  reason?: string;
}
```

If a public route is not enabled, the resolver must return `canonicalPath: null` or `publicRouteEnabled: false`. It must not create pretend URLs.

## Search intent contract

Search must support city, area, specialty, service, and entity-family intent.

Required intents:

```text
provider_name
doctor_by_specialty
center_by_category
service_near_area
specialty_near_area
pharmacy_near_area
emergency_near_area
pet_service_near_area
beauty_service_near_area
charity_near_area
dental_service_near_area
```

Search result ranking should combine exact geo match, specialty/service match, family/category match, distance, verification/source quality, profile completeness, and internal authority.

Search pages remain noindex unless a dedicated indexable landing page is created through the roadmap gates.

## Internal link engine

Internal links must be generated through candidates and budgets. They must not be hand-authored in cards.

Minimum candidate fields:

```text
source_page_type
source_entity_type
source_entity_id
target_page_type
target_entity_type
target_entity_id
relation_type
anchor_en
anchor_ar
priority
reason
review_status
canonical_path
public_safe
```

Candidate rules:

- target must have canonical path
- target must be public-safe
- target route must be enabled
- target must not duplicate another target on the same page
- anchor text must not repeat spam patterns
- link budget must be enforced
- imported hospital held entities must not be linked as public targets

## Link budgets

Initial budgets:

```text
doctor_profile: max 18
center_or_hospital_profile: max 22
pharmacy_profile: max 13
dental_profile: max 18
pet_profile: max 13
beauty_profile: max 14
geo_page: max 30
article_page: max 16
```

Budgets can grow only after public-safe data quality and crawl performance are proven.

## Hreflang projection

Hreflang must be projected before page payloads become final.

Rules:

- if canonical is null, hreflang is null
- if the paired locale page is not public, do not emit that alternate
- if page is noindex, do not emit sitemap hreflang
- each public locale page must reference itself and its valid alternates

## Sitemap eligibility gate

Sitemap is a promotion surface, not a dumping ground.

A URL can enter sitemap only if all of the following pass:

```text
canonical exists
publicSafe = true
detailEligible = true
discoveryEligible = true
sitemapEligible = true
hreflangReady = true
minimumInternalLinks passed
contentScore passed
not duplicate
not hospital-held
```

Sitemap categories should remain split by family and page type.

## Page payload projection

Runtime pages should render prepared payloads. They should not query scattered helpers or make SEO decisions during render.

Provider payload minimum fields:

```text
entity
canonical
hreflang
breadcrumb
geoContext
summary
safe contact actions
locations
services
relations
internalLinks
schemaVisibilityFlags
indexEligibility
```

Required future payload entrypoints:

```text
getProviderProfilePayload()
getGeoPagePayload()
getSpecialtyGeoPagePayload()
getServiceGeoPagePayload()
getArticlePayload()
getSearchPayload()
```

## Shared provider card view model

All provider cards must use one shared view model.

Minimum model:

```text
id
family
title
subtitle
badges
locationLabel
distanceLabel
relationReason
href
image
trustLabel
actions
```

Card rules:

- card does not build URLs
- card does not query data
- card does not decide relations
- card does not render fake ratings
- card does not render fake booking availability
- card does not render fake insurance
- card receives safe href and trust labels from the view model

## Performance and client boundary

The public site must target sub-2-second visible page loads for core pages.

Initial budget:

```text
LCP < 2s
cached TTFB < 500ms
INP < 200ms
CLS < 0.05
public JS < 120KB
CSS < 80KB
DB queries per profile page <= 3
above-the-fold images < 160KB
```

Boundary rules:

- public profile pages are server components by default
- provider cards are server components by default
- related sections are server components by default
- breadcrumbs are server components by default
- search input and filters may be small client components
- maps must be lazy and below the fold unless a later performance proof allows otherwise

Forbidden before integration gates:

```text
'use client' on public layout
'use client' on public profile
'use client' on provider card grid
client-side graph logic
client-side heavy search
URL building inside components
relation logic inside components
large map above the fold
```

## Suggested page recommendations

Every page type should receive related recommendations from the engine.

Hospital / center page:

```text
doctors in this facility
departments
nearby pharmacies
nearby labs
nearby imaging centers
other providers in same area
related specialties
related articles
```

Doctor page:

```text
practice locations
other doctors in same specialty
nearby doctors in same area
nearby pharmacies
nearby labs or imaging centers
related services
related articles
```

Pharmacy page:

```text
nearby hospitals
nearby clinics
nearby doctors
same-area pharmacies
related area pages
```

Dental page:

```text
dentists
related dental services
nearby pharmacies
nearby imaging or lab services when relevant
same-area dental centers
related articles
```

Beauty page:

```text
related beauty services
nearby beauty clinics
dermatology doctors nearby
nearby pharmacies
related articles
```

Pet page:

```text
nearby pet clinics
nearby pet shops
pet grooming services
pet vaccination
emergency vet nearby
pet care articles
```

Lab / imaging page:

```text
nearby doctors
nearby hospitals
related tests or scans
same-area centers
related articles
```

## First indexable batch policy

The first indexable batch must be small, source-safe, and internally linked.

Preferred first batch:

```text
Muscat main pages
top city/category pages
top specialty pages
top service pages
verified manual profiles
strong article clusters
```

Do not publish all imported providers at once.

## PR sequence

Canonical implementation sequence:

```text
830 lock hospital blockers
831 canonical resolver
832 replace familyPath
833 entity family registry
834 geo registry contract
835 search intent contract
836 internal link contract
837 internal link fixture builder
838 internal link projection
839 hreflang projection
840 sitemap requires internal links
841 profile payload contract
842 geo payload contract
843 service/specialty geo payload contract
844 shared provider card view model
845 performance/client boundary guard
846 doctor integration
847 pharmacy integration
848 lab/imaging integration
849 dental integration
850 beauty integration
851 pet integration
852 charity integration
853 manual center/hospital integration
854 directory cards use shared card
855 search results use shared card
856 sitemap projection fixture
857 first indexable batch
858+ imported hospital controlled release
```

## Current status snapshot

Current next action: start at PR 830.

Current held surface:

```text
imported hospital detail/discovery/sitemap
```

Current build posture:

```text
fail-closed
projection-first
route-last
engine-first
cards-after-payload
```

## Non-goals for this roadmap PR

This roadmap does not add or change:

- database migrations
- public routes
- sitemap output
- import write behavior
- JSON-LD output
- public profile UI
- card rendering
- search runtime
- noindex/index behavior

Those changes must happen in later PRs, in the order above.
