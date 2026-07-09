# Imported Hospital Public Hold Contract

Imported hospital records must remain private to import/admin readiness until the full public provider discovery contract is implemented from one shared projection.

## Current rule

During import-readiness work, imported hospitals must not be public released through any of these paths:

- detail page returning `200`;
- public hospital directory listing;
- public search result;
- internal related-provider link graph.

A public sitemap entry is allowed only after import sitemap eligibility passes through the shared `import_publish_queue` gates:

- `publish_status = index_eligible`;
- `index_policy = index`;
- `sitemap_policy = included`;
- reviewed import evidence exists;
- a safe canonical hospital path exists;
- the hospital family cap is respected.

The hospital detail route must not exist while imported hospital detail pages are blocked. A fail-closed detail layout still creates a public route structure, so it must stay deleted until detail eligibility is implemented through the same projection path.

## Why this exists

Imported hospital profiles can include branch, department, doctor relation, service, and local-suggestion claims. A public page without verified discovery, source evidence, and internal-link coverage creates orphan-index and data-quality risk.

## Release prerequisites

Imported hospital public release is blocked until all of these are true in the same implementation path:

1. first-batch dry-run fixture passes with real doctor, pharmacy, hospital, relation, and local-suggestion rows;
2. public provider projection is the single source for manual and imported providers;
3. manual duplicates win over imported duplicates;
4. public detail eligibility is downstream of reviewed source, geo, contact/map, candidate, canonical, and route-family checks;
5. public discovery eligibility is downstream of public detail eligibility;
6. public sitemap eligibility is downstream of public discovery eligibility;
7. internal-link coverage is present for family, location, service/category, and safe related-provider paths;
8. hospital relation and local suggestion summaries show zero unsafe public blockers;
9. representative profile smoke checks pass for English and Arabic routes;
10. sitemap diff contains no unexpected imported hospital URLs.

Until then, doctor/pharmacy import readiness can proceed independently, hospital sitemap eligibility remains guarded by import queue readiness, and imported hospital public detail/discovery release stays locked.
