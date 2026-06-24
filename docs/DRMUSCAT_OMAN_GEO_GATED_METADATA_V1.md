# DrMuscat Oman Geo Gated Metadata V1

## Purpose

Route Oman geo metadata through a single gated helper.

The helper reads readiness and publication gate state before returning metadata. The current output remains noindex metadata.

## Helper source

```text
src/lib/seo/oman-geo-gated-metadata.ts
```

## Base noindex helper

```text
src/lib/seo/geo-route-metadata.ts
```

## Route integration

```text
/[locale]/[country]/oman/governorates/[governorateSlug]
/[locale]/[country]/oman/wilayats/[wilayatSlug]
/[locale]/[country]/oman/areas/[areaSlug]
```

Each route now calls:

```text
buildOmanGeoGatedMetadata(...)
```

instead of calling the noindex helper directly.

## Validation command

```bash
pnpm geo:gated-metadata:validate
```

This command is included in:

```bash
pnpm geo:check:oman
```

## Current behavior

```text
metadata helper reads readiness
metadata helper reads publication gates
robots.index remains false
robots.googleBot.index remains false
no sitemap behavior is added
no JSON-LD payload is generated
no index promotion is added
```

## Safety guarantees

- No route becomes indexable
- No noindex guardrail is removed
- No sitemap inclusion is added
- No JSON-LD payload is generated
- No provider query is added
- No editorial query is added
- No generated JSON is committed

## Future implementation gate

A later approved PR may add indexable metadata only after readiness, review workflow, evidence registry, and technical publication gates are all complete.
