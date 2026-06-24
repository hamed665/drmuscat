# DrMuscat Oman Geo Unified Readiness Runtime V1

## Purpose

Add a unified readiness layer for Oman geo pages.

The readiness runtime combines provider inventory, editorial content, QA evidence, and index promotion eligibility into one safe state object. Routes can pass that single object into the scaffold, and the scaffold can show why a geo page is still blocked from promotion review.

This PR does not make any geo route indexable.

## Contract source

```text
src/config/geo/readiness-contract.ts
```

## Runtime source

```text
src/lib/geo/oman-readiness.ts
```

## Integrated routes

```text
/[locale]/[country]/oman/governorates/[governorateSlug]
/[locale]/[country]/oman/wilayats/[wilayatSlug]
/[locale]/[country]/oman/areas/[areaSlug]
```

## Runtime helpers

```text
listOmanGeoReadinessContracts()
getOmanGeoReadinessContract(entity)
getOmanGeoReadiness(input)
```

## Validation command

```bash
pnpm geo:readiness-runtime:validate
```

This command is included in:

```bash
pnpm geo:check:oman
```

and therefore runs in DrMuscat CI.

## Current readiness state

```text
status: blocked-evidence-missing
readyForPromotionReview: false
providerInventoryReady: false
editorialContentReady: false
qaEvidenceReady: false
indexPromotionEligibilityReady: false
noindexRemovalAllowed: false
sitemapPromotionAllowed: false
jsonLdAllowed: false
indexPromotionAllowed: false
```

## Evidence sources combined

```text
Provider inventory contract/runtime
Editorial content contract/runtime
QA evidence contract/runtime
Index promotion eligibility gate
```

## Runtime scaffold display

The scaffold now exposes readiness state through visible sections and QA data attributes:

```text
data-readiness-status
data-ready-for-promotion-review
```

It also displays readiness blockers from:

```text
readiness.blockedReasons
```

## Safety guarantees

- No noindex guardrail is removed
- No sitemap inclusion is added
- No JSON-LD is generated
- No index promotion is allowed
- No provider query is added
- No editorial query is added
- No QA approval is added
- No generated JSON is committed

## Explicit non-goals

- No route metadata promotion
- No route becomes indexable
- No sitemap allowlist
- No JSON-LD generation
- No provider evidence publishing
- No editorial evidence publishing
- No QA evidence approval

## Future implementation gate

A later approved PR may allow a page to enter promotion review only after provider inventory, localized editorial content, QA evidence, and index promotion eligibility all become complete.
