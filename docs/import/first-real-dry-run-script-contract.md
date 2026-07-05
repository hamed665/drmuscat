# First real dry-run script contract

This document defines the contract for the first real dry-run script before any import is allowed to write data or publish public pages. It is documentation only and does not implement the script.

## Purpose

The script exists to turn a controlled first-batch input file into a dry-run report that operators can review. It must prove the batch is safe enough to continue, not secretly publish anything because apparently that clarification is necessary in software.

## Command shape

Expected CLI shape:

```bash
node scripts/import/run-first-batch-dry-run.mjs \
  --input ./data/import/first-batch.json \
  --output ./tmp/dry-run-report.json
```

The exact wrapper can be added later, but it must follow this contract.

## Input path

The script must accept an explicit `--input` path.

Recommended first-batch input location:

```text
./data/import/first-batch.json
```

The input file must be local. The script must not fetch remote data.

## Output path

The script must accept an explicit `--output` path.

Recommended output location:

```text
./tmp/dry-run-report.json
```

The output must be a JSON report using:

```text
drkhaleej.import.batchDryRun.v1
```

## Supported families

The first real dry-run supports only:

- `doctor`
- `pharmacy`
- `hospital`

Future families can appear in private review examples, but they must not become public output or public routes as part of this script.

## Expected columns and fields

For candidate/profile rows, the dry-run input must provide enough data to validate:

- family
- candidate key
- display name
- canonical path or slug inputs
- area
- governorate
- source name or URL
- last checked date
- contact or map signal
- QA status

For local suggestion rows, the expected field set is:

- `source_family`
- `source_key`
- `source_area`
- `source_governorate`
- `target_family`
- `target_key`
- `target_name`
- `target_area`
- `target_governorate`
- `public_visible`
- `confidence`
- `source_name`
- `source_url`
- `last_checked_at`
- `relation_status`
- `requires_review`

CamelCase aliases can be supported by the adapter, but the import template should prefer the snake_case headers above.

## Report requirements

The output report must include:

- `schemaVersion`
- `decision`
- `checks`
- `sitemap`
- `byFamily`
- `hospitalRelations`
- `localSuggestions`
- `notes`

A report with unsafe public rows must return:

```json
{ "decision": "no_go" }
```

## No side effects

The script must not perform any of these actions:

- database write
- database migration
- sitemap write
- route generation
- public profile publish
- schema markup generation
- future-family public page creation
- network fetch
- automatic merge, deploy, or release

A dry-run is a rehearsal. If it writes to the stage, it is not a rehearsal, it is just production wearing a fake mustache.

## Failure behavior

The script must:

- exit with code `0` when a report is generated successfully, even if `decision` is `no_go`
- exit with code `1` when input is missing, invalid, unreadable, or cannot be transformed into a report
- write clear error messages to stderr for invalid input
- avoid partial output when input parsing fails

## Local usage

Local usage should be documented as:

```bash
node scripts/import/run-first-batch-dry-run.mjs \
  --input ./data/import/first-batch.json \
  --output ./tmp/dry-run-report.json
```

## CI usage

CI usage should validate that:

- the script can read a fixture input
- the script can write a report to a temporary path
- the report uses the expected schema version
- unsafe fixture rows keep `decision: no_go`
- no route, sitemap, database, or network side effects are introduced

## Merge rule before real import

No real import PR should proceed until:

- the dry-run script contract exists
- the CLI wrapper follows this contract
- representative fixtures are green
- sample template integration is green
- go/no-go report behavior is covered
