# DrMuscat Oman Geo Gated Sitemap V1

## Purpose

Add a central gated sitemap helper for Oman geo pages.

The helper knows the candidate governorate, wilayat and area paths, but it only returns entries after publication gates allow them. The current output remains empty.

## Helper source

```text
src/lib/seo/oman-geo-gated-sitemap.ts
```

## Validation command

```bash
pnpm geo:gated-sitemap:validate
```

This command is included in:

```bash
pnpm geo:check:oman
```

## Candidate coverage

```text
governorates
wilayats
areas
```

## Runtime helpers

```text
listOmanGeoSitemapCandidates()
listOmanGeoGatedSitemapEntries()
getOmanGeoGatedSitemapRuntimeState()
```

## Current behavior

```text
candidateCount: derived from Oman geo registry
includedEntryCount: 0
sitemapPromotionAllowed: false
noindexRemovalAllowed: false
jsonLdAllowed: false
indexPromotionAllowed: false
```

## Gate requirements

A sitemap entry requires all of these to be true:

```text
sitemapPromotionAllowed
indexPromotionAllowed
noindexRemovalAllowed
```

All are currently false.

## Safety guarantees

- No sitemap entry is committed
- No sitemap entry is returned while gates are blocked
- No route becomes indexable
- No noindex guardrail is removed
- No JSON-LD payload is generated
- No provider query is added
- No editorial query is added
- No generated JSON is committed

## Future implementation gate

A later approved PR may connect this helper to a real sitemap generation surface only after publication gates are approved.
