# DrMuscat Oman Geo Publication Gates V1

## Purpose

Add a central publication gate layer for Oman geo pages.

The gate controls future noindex removal, sitemap promotion, JSON-LD, and index promotion. The current state remains blocked. No route becomes indexable in this PR.

## Contract source

```text
src/config/geo/publication-gates-contract.ts
```

## Runtime source

```text
src/lib/geo/oman-publication-gates.ts
```

## Route integration

The Oman geo routes pass existing readiness into the publication gate accessor and then pass the gate state into the runtime scaffold.

```text
/[locale]/[country]/oman/governorates/[governorateSlug]
/[locale]/[country]/oman/wilayats/[wilayatSlug]
/[locale]/[country]/oman/areas/[areaSlug]
```

## Validation command

```bash
pnpm geo:publication-gates:validate
```

This command is included in:

```bash
pnpm geo:check:oman
```

## Gate keys

```text
noindex-removal
sitemap-promotion
json-ld
index-promotion
```

## Required inputs before any future gate can open

```text
readiness-complete
review-approved
evidence-approved
technical-gate-enabled
```

## Current state

```text
publicationGateEnabled: false
readinessComplete: false
reviewApproved: false
evidenceApproved: false
technicalGateEnabled: false
noindexRemovalAllowed: false
sitemapPromotionAllowed: false
jsonLdAllowed: false
indexPromotionAllowed: false
```

## Runtime scaffold data attributes

```text
data-publication-gate-status
data-publication-index-allowed
```

## Safety guarantees

- No noindex guardrail is removed
- No sitemap inclusion is added
- No JSON-LD is generated
- No route becomes indexable
- No provider query is added
- No editorial query is added
- No generated JSON is committed

## Future implementation gate

A later approved PR may open publication gates only after unified readiness, promotion review, evidence registry, and technical gate checks are all complete.
