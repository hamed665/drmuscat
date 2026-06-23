# DrMuscat Geo Route Contract V1

## Purpose

Define and guard the first runtime route scaffold for Oman geo discovery.

This contract now allows runtime route files for governorate, wilayat, and area discovery pages while still blocking SEO-heavy behavior such as sitemap entries, metadata generation, JSON-LD, provider queries, and database access.

## Status

```text
runtime-scaffold
```

Runtime route files are enabled. SEO runtime behavior is not enabled.

## Canonical source

The canonical geo registry remains:

```text
src/config/geo/oman.ts
```

The route contract lives in:

```text
src/config/geo/route-contract.ts
```

The shared runtime scaffold component lives in:

```text
src/components/geo/oman-geo-runtime-scaffold.tsx
```

## Runtime route templates

The route scaffold follows the existing DrMuscat locale/country structure:

```text
/[locale]/[country]/...
```

### Governorates

```text
/[locale]/[country]/oman/governorates/[governorateSlug]
```

### Wilayats

```text
/[locale]/[country]/oman/wilayats/[wilayatSlug]
```

### Areas

```text
/[locale]/[country]/oman/areas/[areaSlug]
```

Supported route params remain limited to:

```text
locale: en | ar
country: om
```

## Validation command

```bash
pnpm geo:routes:validate
```

The validator checks that:

- The contract is in `runtime-scaffold` status.
- Runtime route files exist.
- Runtime routes are enabled only for the scaffold.
- Metadata remains disabled.
- Sitemap remains disabled.
- JSON-LD remains disabled.
- The route files guard invalid params with `notFound()`.
- The route files do not define `generateMetadata` yet.

## Implementation gates still pending

Future SEO route work must be done in separate approved PRs and must include:

- metadata behavior
- hreflang behavior
- canonical behavior
- sitemap behavior
- empty state behavior
- noindex/index policy for thin pages
- provider listing behavior

## Explicit non-goals

- No sitemap entries
- No metadata generation
- No JSON-LD generation
- No provider queries
- No database migrations
- No generated JSON committed
- No claim that thin pages are indexable yet
