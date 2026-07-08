# Sitemap Eligibility Gate Contract

Status: canonical sitemap eligibility gate contract.
Scope: contract, helper, and import sitemap hardening.
Build mode: canonical-first, hreflang-ready, internally-linked, fail-closed.

## Purpose

Sitemap promotion must happen only after a URL has passed canonical, public-safety, hreflang, internal-link, and content gates.

A sitemap is not a dumping ground for hopeful URLs. It is a promotion surface for pages the project is ready to let crawlers trust.

## Required gate fields

A sitemap candidate must expose:

```text
pathname
entityType
canonicalPath
publicRouteEnabled
publicSafe
indexable
sitemapEligible
hreflangReady
minimumInternalLinksPassed
contentScorePassed
blockedByImportedHospitalRelease
```

## Required pass conditions

A candidate may enter sitemap only when:

```text
canonical exists
canonical equals pathname
publicRouteEnabled = true
publicSafe = true
indexable = true
sitemapEligible = true
hreflangReady = true
minimumInternalLinksPassed = true
contentScorePassed = true
blockedByImportedHospitalRelease = false
```

## Import sitemap hardening

Imported providers must not enter sitemap from `publicDiscoveryEligible && publicSitemapEligible` alone.

Import sitemap candidates must also require:

```text
metadata.sitemap_included = true
metadata.robots_policy = index
metadata.canonical_path exists
metadata.import_entity_candidate_id exists
metadata.hreflang_ready = true
metadata.minimum_internal_links_passed = true
metadata.content_score_passed = true
metadata.public_route_enabled = true
metadata.public_safe = true
metadata.blocked_by_imported_hospital_release != true
```

## Imported hospital rule

Imported hospital sitemap promotion remains blocked until controlled release gates pass.

Hospital metadata must not override the release blocker.

## Route posture

This gate does not reopen held hospital detail routes. Route checks remain fail-closed while sitemap eligibility becomes stricter.

## Non-goals

This contract does not add or change:

- public routes
- runtime page rendering
- hreflang HTML output
- internal link rendering
- imported hospital release
- database schema
