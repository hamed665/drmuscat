# DrMuscat Oman Geo Review Workflow V1

## Purpose

Add a controlled review state for Oman geo pages.

The current state is blocked. No page becomes indexable in this PR.

## Contract source

```text
src/config/geo/promotion-review-contract.ts
```

## Runtime source

```text
src/lib/geo/oman-promotion-review.ts
```

## Readiness integration

```text
src/lib/geo/oman-readiness.ts
```

## Validation command

```bash
pnpm geo:promotion-review:validate
```

This command is included in:

```bash
pnpm geo:check:oman
```

## Entity coverage

```text
governorate
wilayat
area
```

## Required evidence before review

```text
provider-inventory-ready
editorial-content-ready
qa-evidence-ready
index-eligibility-ready
promotion-reviewer-approved
```

## Current state

```text
status: blocked-readiness-missing
decision: none
reviewRequested: false
reviewedByHuman: false
readyForPromotionReview: false
promotionReviewEnabled: false
promotionReviewRequestAllowed: false
```

## Guardrails

```text
noindexRemovalAllowed: false
sitemapPromotionAllowed: false
jsonLdAllowed: false
indexPromotionAllowed: false
```

## Non-goals

- No route becomes indexable
- No sitemap inclusion is added
- No JSON-LD is generated
- No noindex guardrail is removed
- No provider query is added
- No editorial query is added
- No generated JSON is committed
