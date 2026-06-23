# DrMuscat Geo Editorial Content Contract V1

## Purpose

Define the content registry shape for future Oman geo editorial copy before any real copy is added.

This is a contract-only phase. It creates the structure and validation rules for future localized editorial content, but it does not publish or draft any content yet. Apparently we now need to explicitly forbid pretending an empty content registry is content, because software projects love finding new ways to embarrass everyone.

## Contract source

```text
src/config/geo/editorial-content-contract.ts
```

## Validation command

```bash
pnpm geo:editorial-content:validate
```

This command is included in:

```bash
pnpm geo:check:oman
```

and therefore runs in DrMuscat CI.

## Current state

```text
status: contract-only
registryEnabled: false
currentPublishedContentCount: 0
currentDraftContentCount: 0
currentReadyForReviewContentCount: 0
currentContentEvidenceAvailable: false
```

## Supported locales

```text
en
ar
```

## Required block keys

Future content entries must support:

```text
hero-summary
local-context
care-access
nearby-areas
editorial-disclaimer
```

## Content registry

The current registry is intentionally empty:

```text
OMAN_GEO_EDITORIAL_CONTENT_REGISTRY = []
```

No future code should treat this contract as proof of published content.

## Hard content guardrails

Future content must not allow:

- placeholder copy
- AI medical advice
- MOH verification claims
- provider ranking claims
- copied English/Arabic content
- index promotion without human review

## Explicit non-goals

- No editorial copy is published
- No draft editorial copy is added
- No provider queries are added
- No database access is added
- No route becomes indexable
- No route becomes sitemap-eligible
- No JSON-LD is generated
- No generated JSON is committed

## Future implementation gate

A future localized geo content PR may add real English and Arabic content entries only after it passes this contract and the editorial readiness contract.
