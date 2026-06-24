# DrMuscat Oman Country Adapter Migration V1

## Purpose

Move existing Oman geo route behavior behind the country adapter foundation without changing public behavior.

## Current behavior

```text
No route behavior changes
Oman remains the only active public country
Oman route namespace remains oman
Oman geo routes remain governorates, wilayats and areas
Metadata remains gated and noindex-first
Schema remains disabled until approved
Sitemap promotion remains gated
```

## Source files

```text
src/lib/geo/oman-country-adapter.ts
src/app/[locale]/[country]/oman/governorates/[governorateSlug]/page.tsx
src/app/[locale]/[country]/oman/wilayats/[wilayatSlug]/page.tsx
src/app/[locale]/[country]/oman/areas/[areaSlug]/page.tsx
scripts/validate-oman-country-adapter-migration.mjs
```

## Migration details

```text
country guard: isOmanCountryRoute(country)
metadata pathname: buildOmanGeoPath(entity, slug)
route namespace source: country adapter
geo route segment source: country adapter geo levels
```

## Safety rules

```text
No non-Oman route is enabled
No non-Oman route is public
No non-Oman sitemap entry is created
No JSON-LD is generated
No index promotion is enabled
```

## Next step

```text
Prompt 36 - Second Country Pilot Adapter
```

Prompt 36 may add disabled pilot route contracts for additional countries, but must keep them non-public until their own readiness gates exist.
