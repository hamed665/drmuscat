# 21_SEED_DATA_AND_CONTENT_BOOTSTRAP.md

# DrMuscat V10.3 — Seed Data and Content Bootstrap

## 1. Purpose
This file defines the minimum seed data required for DrMuscat to launch cleanly in Oman with English/Arabic SEO pages, testable dashboards, and realistic demo content.

Seed data must be deterministic, safe, and replaceable. Do not invent real doctor credentials unless verified. This is a healthcare platform, not fan fiction with appointment buttons.

---

## 2. Seed Data Principles

### 2.1 Allowed seed types

```text
system roles
permissions
feature flags
platform settings
Oman geo hierarchy
core specialties
common services
SEO page templates
legal document drafts
sample demo centers marked as demo
sample demo doctors marked as demo
admin user bootstrap placeholder
provider plan catalog
notification templates
redirect examples
```

### 2.2 Forbidden seed behavior
Seed must not:
- publish fake real doctors as verified.
- publish fake reviews as real.
- create Health Card objects.
- create Persian/Hindi launch SEO routes.
- expose private credentials.
- hard-code production secrets.

---

## 3. Oman Geo Seed

Minimum hierarchy:

```text
Country: Oman / سلطنة عمان / code: om
Region/Governorate: Muscat / محافظة مسقط
Cities: Muscat, Seeb, Bawshar, Muttrah, Al Amerat, Quriyat
Areas: Al Khuwair, Al Mouj, Bawshar, Azaiba, Ghubrah, Qurum, Ruwi, Muttrah, Seeb, Al Hail, Madinat Sultan Qaboos, Al Mawaleh
```

Canonical route country code is lowercase:

```text
om
```

---

## 4. Specialty Seed

Minimum specialties:

```text
Dentistry / طب الأسنان
Dermatology / الجلدية
General Medicine / الطب العام
Pediatrics / طب الأطفال
Gynecology / النساء والولادة
Orthopedics / العظام
ENT / الأنف والأذن والحنجرة
Ophthalmology / العيون
Cardiology / القلب
Physiotherapy / العلاج الطبيعي
Laboratory / المختبرات
Radiology / الأشعة
Beauty Clinic / عيادات التجميل
Pharmacy / الصيدلية
```

Each specialty requires:

```text
name_en
name_ar
slug
parent_id optional
is_active
sort_order
meta_title_en
meta_title_ar
meta_description_en
meta_description_ar
```

---

## 5. Services Seed

Examples:

```text
Dental Cleaning / تنظيف الأسنان
Teeth Whitening / تبييض الأسنان
Root Canal / علاج العصب
Skin Consultation / استشارة جلدية
Laser Hair Removal / إزالة الشعر بالليزر
General Consultation / استشارة عامة
Child Consultation / استشارة أطفال
Ultrasound / سونار
X-Ray / أشعة سينية
Blood Test / تحليل دم
Physiotherapy Session / جلسة علاج طبيعي
```

Services must map to specialties where appropriate.

---

## 6. Provider Plan Seed

Required provider plans:

```text
free_basic
starter
growth
premium
```

Seed prices may be placeholders and must be marked editable by admin. Do not hard-code final commercial pricing into code.

---

## 7. Feature Flags Seed

Minimum flags:

```text
appointments_enabled=false
live_booking_enabled=false
insurance_pages_enabled=false
payment_gateways_enabled=false
manual_payments_enabled=true
sponsored_slots_enabled=true
patient_accounts_enabled=false
reviews_enabled=false
ai_chat_enabled=false
meilisearch_enabled=false
web_push_enabled=false
```

Feature flags must not hide broken required MVP functionality. They are controlled rollout tools, not camouflage for unfinished work.

---

## 8. Platform Settings Seed

Minimum settings:

```text
site_name_en=DrMuscat
site_name_ar=دكتور مسقط
default_country=om
supported_locales=["en","ar"]
launch_locales=["en","ar"]
no_persian_hindi_launch_routes=true
public_browsing_requires_login=false
health_card_enabled=false
patient_offers_enabled=true
manual_payment_enabled=true
```

---

## 9. Legal Document Seed

Draft documents required:

```text
terms_of_service en/ar
privacy_policy en/ar
medical_disclaimer en/ar
cookie_policy en/ar
provider_terms en/ar
```

All seeded legal documents must be draft unless approved by the operator.

---

## 10. Demo Data Rules

Demo centers/doctors may be inserted only if:

```text
is_demo=true
verification_status='unverified'
listing_status='draft' or 'preview'
no fake reviews
no fake license claims
no fake “best doctor” claims
```

Demo data must never be confused with live real provider listings.

---

## 11. Example Seed SQL Pattern

Implementation should create seed files such as:

```text
supabase/seed/001_roles_permissions.sql
supabase/seed/002_geo_oman.sql
supabase/seed/003_taxonomy_specialties.sql
supabase/seed/004_services.sql
supabase/seed/005_provider_plans.sql
supabase/seed/006_feature_flags_settings.sql
supabase/seed/007_legal_documents_draft.sql
supabase/seed/008_demo_content_optional.sql
```

Example pattern:

```sql
INSERT INTO public.geo_countries (code, name_en, name_ar, is_active)
VALUES ('om', 'Oman', 'سلطنة عمان', true)
ON CONFLICT (code) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  is_active = EXCLUDED.is_active;
```

All seeds must be idempotent using `ON CONFLICT` or deterministic keys.

---

## 12. Import Bootstrap

For real data loading, use import batches:

```text
centers_csv
doctors_csv
services_csv
insurance_csv
```

Import must support:
- preview.
- validation.
- duplicate detection.
- row-level error reporting.
- rollback by import batch where practical.

---

## 13. Acceptance Criteria

```text
- Seed scripts are idempotent.
- Oman/Muscat geo hierarchy exists.
- English/Arabic specialties exist.
- Provider plans exist.
- Feature flags and settings exist.
- Legal draft documents exist.
- No Health Card seed exists.
- No Persian/Hindi public launch routes are seeded.
- Demo content is clearly marked and not verified.
- Build and migration can run on a fresh database.
```
