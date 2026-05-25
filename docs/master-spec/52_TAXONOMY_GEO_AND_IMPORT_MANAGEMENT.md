# 52_TAXONOMY_GEO_AND_IMPORT_MANAGEMENT.md

# DrMuscat V10.3 — Taxonomy, Geo, Bulk Import, and Source Management

## 1. Purpose
Healthcare SEO depends on clean taxonomy and clean geography. DrMuscat must manage specialties, services, symptoms, procedures, conditions, areas, and aliases without hardcoding them into code.

## 2. Canonical Taxonomy Objects
- `specialties`
- `sub_specialties`
- `medical_services`
- `procedures`
- `conditions`
- `symptoms`
- `service_categories`
- `taxonomy_aliases`
- `search_synonyms`

## 3. Required Taxonomy Fields
Every taxonomy item must support:
- English name.
- Arabic name.
- Slug.
- Parent relationship where applicable.
- Icon key.
- SEO title/meta.
- Intro text.
- Status: `active`, `hidden`, `archived`.
- Sort order.
- Country applicability.
- Related aliases/synonyms.

## 4. Canonical Geo Objects
V10.3 confirms:
- `geo_countries`
- `geo_regions`
- `geo_cities`
- `geo_areas`

Legacy `areas` must not be a second writable source of truth. If kept, it must be a compatibility view or migrated into `geo_areas`.

## 5. Geo Admin Requirements
Admin must manage:
- Country.
- Region/governorate.
- City.
- Area/neighborhood.
- Coordinates.
- Map bounds.
- Arabic/English names.
- Slugs.
- Aliases.
- Active/coming soon/hidden status.
- SEO intro and FAQ.

## 6. Bulk Import System
Manual entry alone is not enough. DrMuscat must support controlled bulk import.

Tables:
- `import_batches`
- `import_rows`
- `data_source_records`
- `duplicate_candidates`

Importable entities:
- centers.
- doctors.
- services.
- specialties.
- geo areas.
- insurance acceptance.
- doctor practice locations.

## 7. Import Batch Fields
- `id`
- `entity_type`
- `source_name`
- `uploaded_file_url`
- `status`: `uploaded`, `parsed`, `validated`, `partially_imported`, `imported`, `failed`, `rolled_back`
- `total_rows`
- `valid_rows`
- `invalid_rows`
- `duplicate_rows`
- `created_by_profile_id`
- `created_at`
- `completed_at`

## 8. Import Requirements
Admin must be able to:
- Upload CSV/XLSX.
- Preview parsed rows.
- See validation errors.
- Map columns.
- Detect duplicates before import.
- Import selected valid rows.
- Roll back batch where safe.
- Preserve source attribution.

## 9. Duplicate Detection Signals
For centers:
- Similar name.
- Same phone.
- Same map location.
- Same website.
- Same area and specialty.

For doctors:
- Similar name.
- License number.
- Same phone.
- Same practice location.
- Same specialty/language profile.

## 10. Source Attribution
Every imported or scraped/manual record should store source metadata:
- source name.
- source URL if public.
- imported by.
- imported date.
- confidence score.
- verification status.

Do not expose source metadata publicly unless approved.
