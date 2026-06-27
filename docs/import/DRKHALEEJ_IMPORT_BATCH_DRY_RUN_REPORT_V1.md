# DrKhaleej Import Batch Dry-Run Report V1

## Purpose

This document defines the machine-readable report shape for the first guarded import batch rehearsal.

The report is a dry-run artifact only. It records whether a frozen doctor, pharmacy, and hospital import sample is ready for a controlled public sitemap rehearsal. It does not approve rows, publish rows, change database state, open new routes, or create dashboard/commercial workflows. The machine gets a report; the public internet does not get a buffet.

## Source of truth

| Surface | Source |
| --- | --- |
| Type contract | `src/server/admin/import-batch-dry-run-report.ts` |
| Rehearsal checklist | `docs/import/DRKHALEEJ_IMPORT_BATCH_REHEARSAL_V1.md` |
| Readiness audit | `src/server/admin/import-publish-readiness-audit.ts` |
| Sitemap family caps | `src/server/public/import-sitemap.ts` |
| Profile smoke validator | `scripts/import/check-public-import-profile-smoke.mjs` |

## Schema identity

The report must use this exact schema version:

`drkhaleej.import.batchDryRun.v1`

## First rehearsal caps

| Family | Dry-run cap |
| --- | --- |
| doctor | 50 |
| pharmacy | 25 |
| hospital | 10 |

These are rehearsal caps, not long-term import sitemap caps.

## Required decision checks

A report can return `go` only when all required checks pass:

- `ci_green`
- `seo_check_green`
- `readiness_audit_zero_blockers`
- `sitemap_diff_frozen`
- `representative_profile_smoke_passed`
- `blocked_route_classes_absent`

If any required check fails, the report decision must be `no_go`.

## Required top-level shape

```json
{
  "schemaVersion": "drkhaleej.import.batchDryRun.v1",
  "rehearsalId": "2026-06-27-first-import-rehearsal",
  "generatedAt": "2026-06-27T23:30:00Z",
  "commitSha": "example-sha-or-null",
  "decision": "no_go",
  "caps": {
    "doctor": 50,
    "pharmacy": 25,
    "hospital": 10
  },
  "checks": [
    { "key": "ci_green", "passed": false, "notes": null },
    { "key": "seo_check_green", "passed": false, "notes": null },
    { "key": "readiness_audit_zero_blockers", "passed": false, "notes": null },
    { "key": "sitemap_diff_frozen", "passed": false, "notes": null },
    { "key": "representative_profile_smoke_passed", "passed": false, "notes": null },
    { "key": "blocked_route_classes_absent", "passed": false, "notes": null }
  ],
  "sitemap": {
    "beforeUrlCount": 0,
    "afterUrlCount": 0,
    "importedDeltaCount": 0,
    "unexpectedUrlCount": 0,
    "unexpectedUrls": []
  },
  "byFamily": {
    "doctor": {
      "selectedCount": 0,
      "eligibleCount": 0,
      "blockedCount": 0,
      "sitemapUrlCount": 0,
      "sampledUrlCount": 0,
      "blockers": [],
      "samples": []
    },
    "pharmacy": {
      "selectedCount": 0,
      "eligibleCount": 0,
      "blockedCount": 0,
      "sitemapUrlCount": 0,
      "sampledUrlCount": 0,
      "blockers": [],
      "samples": []
    },
    "hospital": {
      "selectedCount": 0,
      "eligibleCount": 0,
      "blockedCount": 0,
      "sitemapUrlCount": 0,
      "sampledUrlCount": 0,
      "blockers": [],
      "samples": []
    }
  },
  "notes": []
}
```

## Blocker reasons

Allowed blocker reasons are:

- `canonical_unsafe`
- `source_missing`
- `contact_or_map_missing`
- `geo_missing`
- `candidate_missing`
- `candidate_not_approved`
- `candidate_type_mismatch`
- `queue_not_index_eligible`
- `sitemap_not_included`
- `robots_not_index`
- `sitemap_cap_exceeded`
- `unexpected_route_class`
- `representative_smoke_failed`

## Sample URL result shape

Each sampled public profile URL must record the family, locale, canonical path, rendered name signal, evidence signals, canonical signal, locale alternate signal, and pass/fail status.

A sample is passing only when it has location evidence, source evidence, contact or map evidence, canonical output, and the expected route-family behavior.

## Report decision rule

The report decision is `go` only when:

- all required checks pass;
- every selected row is eligible;
- blocker count is zero;
- unexpected sitemap URL count is zero;
- sitemap counts stay within the first rehearsal caps;
- representative profile samples pass.

Otherwise the decision is `no_go`.
