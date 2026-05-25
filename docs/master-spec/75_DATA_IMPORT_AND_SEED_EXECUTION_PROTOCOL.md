# 75_DATA_IMPORT_AND_SEED_EXECUTION_PROTOCOL.md — Data Import and Seed Execution Protocol

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
DrMuscat depends on high-quality directory data. This file defines seed and import behavior.

## 2. Launch Seed Scope
Minimum launch seed:
```txt
Country: Oman / om
Region: Muscat Governorate
City: Muscat
Areas: Al Khuwair, Bawshar, Al Mouj, Azaiba, Qurum, Ruwi, Seeb
Specialties: Dentistry, Dermatology, Pediatrics, General Practice, Gynecology, Orthopedics, ENT, Ophthalmology
Demo centers: 10
Demo doctors: 10
Demo services: 20
Doctor practice locations: at least 5 examples, including multi-location doctors
```

## 3. Bilingual Data Requirements
Every public entity must support:
- `name_en`
- `name_ar`
- canonical slug
- localized description when indexable
- locale-safe display fallback

Arabic content must be UTF-8 clean.

## 4. Import System Requirements
By Phase 10, admin import must support:
- CSV upload/parse
- preview before commit
- validation errors per row
- duplicate detection
- import batch ID
- rollback/deactivate batch where safe
- source attribution
- status tracking

## 5. Import Tables
Recommended:
```txt
import_batches
import_rows
data_source_records
duplicate_candidates
merge_logs
```

## 6. Duplicate Detection
Compare:
- normalized English name
- normalized Arabic name
- phone
- WhatsApp
- website
- map URL
- area/city
- doctor license number where available

No automatic destructive merge without admin approval.

## 7. Seed Idempotency
Seed scripts should use deterministic slugs and `ON CONFLICT` where safe. Running seeds twice must not create duplicates.

## 8. Data Quality Score
Each center/doctor should have a completeness score based on:
- name EN/AR
- photo/logo
- specialty
- area
- phone/WhatsApp
- map link
- working hours
- services
- description
- verification status

Admin panels must surface missing fields.

## 9. Import Validation Report
Every import must produce:
```md
- rows parsed
- rows valid
- rows invalid
- duplicates suspected
- rows inserted
- rows skipped
- rollback option
```
