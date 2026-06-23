# DrMuscat Geo Editorial Readiness Contract V1

## Purpose

Define what counts as editorial readiness before Oman geo route pages can be considered for index promotion.

This is a contract-only phase. It does not generate copy, does not remove noindex, does not add sitemap entries, and does not add JSON-LD. It only defines the standards that future editorial content must meet before SEO promotion. Apparently we now need contracts to stop placeholder paragraphs from pretending to be strategy. Sensible.

## Contract source

```text
src/config/geo/editorial-readiness-contract.ts
```

## Validation command

```bash
pnpm geo:editorial-readiness:validate
```

This command is included in:

```bash
pnpm geo:check:oman
```

and therefore runs in DrMuscat CI.

## Current readiness state

```text
currentEditorialEvidenceAvailable: false
currentIndexPromotionAllowed: false
currentSitemapPromotionAllowed: false
promotionRequiresHumanReview: true
promotionRequiresArabicAndEnglishCopy: true
```

## Required editorial blocks

Each future geo page must include:

```text
hero-summary
local-context
care-access
nearby-areas
editorial-disclaimer
```

## Entity word thresholds

### Governorate pages

```text
minimumEnglishWords: 120
minimumArabicWords: 120
```

### Wilayat pages

```text
minimumEnglishWords: 90
minimumArabicWords: 90
```

### Area pages

```text
minimumEnglishWords: 70
minimumArabicWords: 70
```

## Hard content guardrails

The contract blocks:

- placeholder copy
- AI medical advice
- MOH verification claims
- provider ranking claims
- copied English/Arabic content
- index promotion without human review

## Explicit non-goals

- No editorial content is generated
- No provider queries are added
- No database access is added
- No route becomes indexable
- No route becomes sitemap-eligible
- No JSON-LD is generated
- No generated JSON is committed

## Future implementation gate

A future editorial content PR may add actual English and Arabic copy only after it follows this contract and includes automated readiness validation.
