# Public Local Suggestion Import Template Contract

## Purpose

This document defines how Excel and CSV import templates should map local suggestion columns into the public local suggestion payload contract.

The template contract exists to keep spreadsheet imports, JSON imports, dry-run reports, and runtime guards aligned. No template column should imply public display unless the payload would also pass the public local suggestion safety contract.

## Source of truth

The payload contract is the source of truth:

- `docs/import/public-local-suggestion-payload-contract.md`

This template contract only defines spreadsheet column names, aliases, and mapping rules.

## Recommended sheet names

Import workbooks may use any profile-family sheet, but local suggestions should be represented consistently.

Recommended options:

- `Local Suggestions`
- `local_suggestions`
- one family sheet with repeated `localSuggestion*` columns

If a workbook stores local suggestions inside a provider profile sheet, each suggestion row should still map to one `relations.localSuggestions[]` entry.

## Required public columns

A row is eligible for public display only when these columns are present and valid:

| Template column | Payload field | Requirement |
| --- | --- | --- |
| `source_family` | source family context | Required when the sheet does not imply the source family |
| `source_key` | source candidate key | Required |
| `source_area` | source area context | Required |
| `source_governorate` | source governorate context | Required |
| `target_family` | `targetFamily` | Required |
| `target_key` | `targetKey` | Required |
| `target_name` | `targetName` | Required |
| `target_area` | `targetArea` | Required |
| `target_governorate` | `targetGovernorate` | Required |
| `public_visible` | `publicVisible` | Must be `true` for public output |
| `confidence` | `confidence` | Must be `high` or `medium` |
| `source_name` or `source_url` | source evidence anchor | At least one is required |
| `last_checked_at` | `lastCheckedAt` | Required |

## Optional review columns

| Template column | Payload field | Public-safe values |
| --- | --- | --- |
| `relation_status` | `relationStatus` | empty, `active`, `approved` |
| `requires_review` | `requiresReview` | empty or `false` |
| `source_url` | `source.sourceUrl` | URL string |
| `source_name` | `source.sourceName` | human-readable source label |
| `notes` | ignored by public guard | never public evidence by itself |

## Accepted template aliases

Spreadsheet templates may use these aliases. The canonical template column should be preferred in new templates.

| Canonical template column | Accepted aliases |
| --- | --- |
| `source_family` | `sourceFamily`, `family_source`, `profile_family` |
| `source_key` | `sourceKey`, `profile_key`, `profile_slug`, `source_slug` |
| `source_area` | `sourceArea`, `profile_area` |
| `source_governorate` | `sourceGovernorate`, `profile_governorate` |
| `target_family` | `targetFamily`, `target_type`, `entity_type`, `family` |
| `target_key` | `targetKey`, `target_slug`, `candidate_key`, `slug` |
| `target_name` | `targetName`, `display_name`, `name`, `name_en` |
| `target_area` | `targetArea`, `area` |
| `target_governorate` | `targetGovernorate`, `governorate` |
| `public_visible` | `publicVisible`, `is_public`, `publish` |
| `confidence` | `confidence_level`, `match_confidence` |
| `relation_status` | `relationStatus`, `relationship_status`, `status` |
| `requires_review` | `requiresReview`, `needs_review` |
| `source_name` | `sourceName`, `evidence_name`, `reference_name` |
| `source_url` | `sourceUrl`, `evidence_url`, `reference_url`, `url` |
| `last_checked_at` | `lastCheckedAt`, `last_verified_date`, `lastVerifiedDate` |

## Boolean values

`public_visible` and `requires_review` should be parsed strictly.

Accepted true values:

- `true`
- `TRUE`
- `yes`
- `YES`
- `1`

Accepted false values:

- `false`
- `FALSE`
- `no`
- `NO`
- `0`
- empty cell

Unknown boolean values should not be treated as public-safe.

## Family normalization

Template family values should normalize into the supported payload families:

| Template value examples | Canonical family |
| --- | --- |
| `doctor`, `doctors`, `physician` | `doctor` |
| `pharmacy`, `pharmacies` | `pharmacy` |
| `hospital`, `hospitals` | `hospital` |
| `radiology`, `imaging`, `diagnostic_imaging` | `radiology` |
| `dentistry`, `dental`, `dentist` | `dentistry` |
| `beauty`, `beauty_center`, `beauty_salon` | `beauty` |

Unsupported family values must fail closed as `unsupported_family`.

## Mapping example

A spreadsheet row:

| source_family | source_key | source_area | source_governorate | target_family | target_key | target_name | target_area | target_governorate | public_visible | confidence | source_name | last_checked_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| doctor | doctor-ali | Al Khuwair | Muscat | pharmacy | pharmacy-01 | Example Pharmacy | Al Khuwair | Muscat | true | high | Oman Ministry of Health directory | 2026-07-01 |

Should map to:

```json
{
  "relations": {
    "localSuggestions": [
      {
        "targetFamily": "pharmacy",
        "targetKey": "pharmacy-01",
        "targetName": "Example Pharmacy",
        "targetArea": "Al Khuwair",
        "targetGovernorate": "Muscat",
        "publicVisible": true,
        "confidence": "high",
        "source": {
          "sourceName": "Oman Ministry of Health directory",
          "lastCheckedAt": "2026-07-01"
        }
      }
    ]
  }
}
```

The source family, source key, source area, and source governorate remain dry-run context for checking source candidate existence and location matching.

## Fail-closed rules

Spreadsheet rows must not become public when any of these conditions is true:

- `public_visible` is missing, false, or unrecognized;
- `target_family` is missing or unsupported;
- `source_key` is missing from the candidate map;
- `target_key` is missing from the candidate map;
- `target_name` is missing;
- source and target area or governorate do not match;
- source evidence is missing;
- `last_checked_at` is missing;
- `confidence` is not `high` or `medium`;
- the row links an entity to itself;
- `relation_status` is not empty, `active`, or `approved`;
- `requires_review` is true.

## Template authoring rules

- Prefer snake_case column names in new templates.
- Do not infer `target_family` from a missing value.
- Do not infer public visibility from a filled target name.
- Do not treat free-text notes as source evidence.
- Do not publish future-family rows until their candidate maps are populated.
- Keep template columns stable so dry-run reports can stay readable.

## Out of scope

This contract does not define:

- workbook styling;
- bulk upload UI behavior;
- route generation;
- sitemap generation;
- rating, review, booking, or insurance claims;
- neighborhood alias matching.
