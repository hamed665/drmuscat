# First-batch import write-path contract

This document defines the minimum contract for any future first-batch import write path. It is documentation only. It does not authorize implementation, add database writes, add migrations, publish profiles, generate routes, alter sitemap output, emit schema markup, deploy anything, or make imported rows public.

## Hard prerequisite

No implementation PR for the import write path may be opened until a reviewed first-batch dry-run report satisfies all of these conditions:

- `decision` is `go`
- `node scripts/import/validate-first-batch-dry-run-report.mjs --input ./tmp/first-batch.dry-run-report.json --expect go` passes
- `Import Runner Checks` is green
- `DrKhaleej CI` is green
- the review evidence uses `docs/import/first-batch-dry-run-pr-template.md`
- no real provider CSV or generated dry-run report is committed

Until then, this contract is a locked door, not a treasure map. Software teams keep confusing those, and then everyone acts surprised when production starts doing improv.

## Allowed first implementation scope

The first implementation may only support a draft or staging import. It must not publish public profiles.

Allowed behavior:

- read a local reviewed import input
- validate that a matching `go` dry-run report exists
- create or update internal draft/staging records only
- write audit records for each processed row
- return a machine-readable import summary
- leave public eligibility, sitemap eligibility, schema output, and public rendering unchanged

Forbidden behavior:

- public profile publication
- sitemap URL promotion
- schema markup generation
- route generation
- public search/listing exposure
- provider detail indexability changes
- automatic deployment or release
- network fetches during import execution
- importing rows without a matching reviewed `go` report

## Required command shape

The future write path must use explicit input and report paths:

```bash
node scripts/import/run-first-batch-write.mjs \
  --input ./tmp/first-batch.dry-run-input.json \
  --report ./tmp/first-batch.dry-run-report.json \
  --mode draft
```

The command name is reserved by this contract. It must not exist until the implementation PR is ready and reviewed.

## Dry-run report binding

The write path must verify that the report matches the input and current code context.

Minimum binding rules:

- report schema version is `drkhaleej.import.batchDryRun.v1`
- report decision is `go`
- report validation with `--expect go` passes
- report family selected counts match the import input
- report candidate keys match the import input
- report generated timestamp and commit SHA are recorded in the import audit summary
- unsafe public blocker counts are zero

If any binding rule fails, the command must exit non-zero and must not write partial records.

## Idempotency

Every import row must have a stable idempotency key.

Minimum idempotency key shape:

```text
first-batch:{family}:{candidate_key}
```

Rules:

- rerunning the same approved input must not duplicate entities
- a changed row with the same idempotency key must be detected and reported
- destructive overwrites are forbidden in the first implementation
- duplicate candidate keys in the same input must fail before any write

## Transaction boundary

The first implementation must fail closed.

Minimum transaction rules:

- validate all rows before any write
- reject unsupported families before any write
- reject missing source evidence before any write
- reject missing checked dates before any write
- reject canonical or slug safety failures before any write
- reject public unsafe local suggestions before any write
- reject public unsafe hospital relations before any write
- if the database supports transaction boundaries for the touched records, use one transaction per batch
- if a full batch transaction is not possible, write an explicit compensating rollback plan before implementation

## Audit log requirements

Every processed row must produce an internal audit entry.

Minimum audit fields:

- import run id
- dry-run rehearsal id
- dry-run report commit SHA
- family
- candidate key
- idempotency key
- action: created, updated, skipped, rejected
- source evidence summary
- QA status
- created by operator id or system actor
- timestamp
- reason for rejected or skipped rows

Audit output is internal only. It must not become public copy, public schema, or sitemap metadata.

## Draft/staging visibility

The first implementation must default to non-public visibility.

Required defaults:

- public profile visible: false
- sitemap eligible: false
- schema eligible: false
- search/listing eligible: false
- index eligible: false
- booking/contact CTA exposure unchanged

Any future public promotion must be a separate publish-gate PR after import write path validation.

## Rollback requirements

The implementation PR must define rollback before it defines writes.

Minimum rollback rules:

- list all records created by import run id
- support reverting the whole import run in staging/draft state
- do not delete unrelated existing records
- do not rollback public routes, because first implementation must not create public routes
- rollback must create audit entries

## Required validation before implementation merge

The implementation PR must include static and runtime checks for:

- missing report fails
- `no_go` report fails
- report/input mismatch fails
- duplicate candidate key fails
- unsupported family fails
- rerun does not duplicate records
- unsafe public relation fails before write
- rollback plan is documented
- public route/sitemap/schema files are unchanged

## Merge rule

A write-path implementation may merge only when:

- a reviewed real dry-run report has passed with `--expect go`
- this contract is still satisfied
- import writes are draft/staging only
- no public publication behavior is added
- CI is green

Anything else is not an import pipeline. It is a spreadsheet wearing a lab coat.
