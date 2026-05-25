# 56_DATA_QUALITY_DUPLICATE_MERGE_AND_AUDIT.md

# DrMuscat V10.3 — Data Quality, Duplicate Merge, and Audit System

## 1. Purpose
Healthcare directories fail when data is stale, duplicated, or untrusted. DrMuscat must treat data quality as a first-class operating system.

## 2. Profile Quality Score
Every public center/doctor should have a quality score.

Signals:
- Required names in English/Arabic.
- Clean slug.
- Verified contact.
- Map coordinates.
- Working hours.
- Photos.
- Services/specialties.
- Doctor-location relation.
- Insurance/payment info.
- Last verified date.
- No duplicate warning.
- SEO fields.

## 3. Data Freshness
Fields:
- `last_verified_at`
- `last_verified_by_profile_id`
- `verification_source`
- `needs_reverification_at`
- `data_quality_status`

Statuses:
- `complete`
- `needs_review`
- `stale`
- `duplicate_suspected`
- `incomplete`
- `blocked`

## 4. Duplicate Merge
Create:
- `duplicate_candidates`
- `merge_operations`
- `merge_operation_items`

Merge rules:
- Merges are admin-only.
- Merges must preserve redirects from old slugs.
- Merges must preserve reviews, media, events, offers, claims where safe.
- Merges must log before/after state.
- Destructive delete is forbidden in MVP; use archive/merge.

## 5. Audit Log Requirements
Every sensitive action must record:
- actor profile.
- action.
- entity type.
- entity id.
- before JSON.
- after JSON.
- reason.
- ip/user agent where available.
- timestamp.

Sensitive actions include:
- verification changes.
- billing changes.
- ownership changes.
- role/permission changes.
- published SEO changes.
- redirects.
- sponsored/ads changes.
- review moderation.
- license document changes.
- merge operations.

## 6. Admin Reports
Admin must see:
- Incomplete profiles.
- Duplicates.
- Stale listings.
- Profiles without Arabic content.
- Profiles without map.
- Profiles without contact.
- SEO thin pages.
- Broken media.
- Unverified insurance claims.

## 7. Public Trust Display
Public pages may show:
- Verified badge if approved.
- Last updated/verified date where useful.
- Report wrong information link.

Do not show internal quality score publicly unless explicitly approved.
