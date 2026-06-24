# DrMuscat Second Country Pilot Adapter V1

## Purpose

Add a disabled second-country pilot adapter without creating public routes.

## Pilot country

```text
UAE
countryCode: ae
countrySlug: united-arab-emirates
routeNamespace: uae
status: disabled-draft
```

## Geo levels

```text
emirate -> city -> area
```

All UAE geo levels remain disabled.

## Disabled route templates

```text
/[locale]/[country]/uae/emirates/[emirateSlug]
/[locale]/[country]/uae/cities/[citySlug]
/[locale]/[country]/uae/areas/[areaSlug]
```

No public routes are created.

## Safety rules

```text
No public routes
No metadata
No sitemap
No JSON-LD
No LLM surface
No index promotion
```

## Activation requirements

```text
country readiness contract
geo data seed
provider inventory evidence
editorial content evidence
QA evidence
publication gates
approved promotion review
```

## Next step

```text
Prompt 37 - Stable ID Policy
```
