# First-batch import template sample

This sample is fictional. It does not describe real doctors, pharmacies, hospitals, clinics, locations, phone numbers, licenses, or operating entities in Oman. It exists only to show import shape and dry-run behavior.

Use this file with:

```text
docs/import/examples/first-batch-import-template.sample.csv
```

## Included sample rows

The CSV includes:

- 2 fictional doctor candidate rows
- 2 fictional pharmacy candidate rows
- 1 fictional hospital candidate row
- 2 public-safe local suggestion rows
- 2 unsafe local suggestion rows

## Safe local suggestion examples

The safe examples demonstrate:

- doctor to pharmacy in the same area and governorate
- pharmacy to doctor in the same area and governorate
- `source_name` or `source_url`
- `last_checked_at`
- supported target family
- `confidence` set to `high` or `medium`
- `relation_status` set to `active` or `approved`

## Unsafe local suggestion examples

The unsafe examples intentionally demonstrate:

- wrong location: target area differs from source area
- unsupported future family: `clinic`

Those rows must remain unsafe or private-review in dry-run output. They are included because a sample that only shows happy paths is just a brochure with a keyboard.

## What this sample must not do

This sample must not be used as real provider data. It must not trigger:

- database writes
- public route generation
- sitemap changes
- schema markup generation
- public profile rendering
- future-family public pages
- network fetching

## How to use it

Use it as a template reference for column shape, not as truth. A real first batch should replace every fictional value with reviewed provider data, source evidence, checked dates, and QA status.
