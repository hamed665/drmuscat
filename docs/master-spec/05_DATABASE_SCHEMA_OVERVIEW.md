# 05_DATABASE_SCHEMA_OVERVIEW.md

# Database Schema Overview

## 1. Canonical SQL
The executable schema is in:
- `05b_DATABASE_FULL_DDL_V10.sql.md`
- `05c_DATABASE_EXECUTION_PATCH_AND_VALIDATION_V10.md`
- `05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md`

Claude must not infer tables from prose.

## 2. Core Modules
- profiles and roles
- organizations and members
- areas, categories, services
- centers with own slug and localized names
- doctors
- doctor_organizations
- doctor_centers for exact branch mapping
- claims, licenses, approvals
- audit logs with request_id
- plans, subscriptions, invoices, payments
- ledger transactions/entries
- referrals, commission rules, payouts
- leads, sales deals, notes
- media assets, videos, subtitles
- microsites
- ad placements, campaigns, ad_events
- patient offers and offer claims/redemptions
- articles
- general events
- notifications
- settings

## 3. Important Rules
- centers have their own slug. Do not route center pages from organization.slug.
- centers have localized name fields. Do not rely only on organization names.
- doctor_centers maps doctors to exact branches.
- events and ad_events are separate.
- payment/invoice/claim numbers are DB-generated.
- status fields use enums/checks.
- private documents are not public.
- RLS is mandatory but grants must also be reviewed.


## V10 database notes
Use `05b_DATABASE_FULL_DDL_V10.sql.md`, `05c_DATABASE_EXECUTION_PATCH_AND_VALIDATION_V10.md`, and `05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md` only. Older V5/V6 database files are deprecated.

## V10.3 Canonical Override Notice
Older references to `doctor_centers` and `areas` are legacy context. V10.3 canonical tables are `public.doctor_practice_locations` for doctor practice mapping and `public.geo_areas` within the full geo hierarchy. New code must not create two writable sources of truth.
