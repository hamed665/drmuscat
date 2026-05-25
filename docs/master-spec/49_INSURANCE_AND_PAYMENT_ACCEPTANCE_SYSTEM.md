# 49_INSURANCE_AND_PAYMENT_ACCEPTANCE_SYSTEM.md

# DrMuscat V10.3 — Insurance and Payment Acceptance System

## 1. Purpose
Insurance support is a core discovery and trust feature for healthcare platforms. DrMuscat must support insurance discovery, accepted-payment transparency, and future verification without pretending to provide insurance eligibility guarantees in MVP.

## 2. MVP Principle
MVP may show insurance acceptance as provider-claimed or admin-verified data. It must not claim real-time coverage verification unless an approved integration exists.

## 3. Canonical Tables
- `insurance_companies`
- `insurance_plans`
- `center_insurance_acceptance`
- `doctor_insurance_acceptance`
- `service_payment_options`
- `insurance_verification_logs`

## 4. Insurance Company Fields
- `id`
- `country_id`
- `name_en`
- `name_ar`
- `slug`
- `logo_url`
- `website_url`
- `support_phone`
- `status`: `active`, `hidden`, `archived`
- `created_at`
- `updated_at`

## 5. Acceptance Fields
For center and doctor acceptance:
- `insurance_company_id`
- `insurance_plan_id`
- `acceptance_type`: `direct_billing`, `reimbursement`, `discount_only`, `unknown`
- `notes_en`
- `notes_ar`
- `is_verified`
- `verified_by_profile_id`
- `verified_at`
- `last_checked_at`
- `source`: `admin`, `provider_claimed`, `website`, `phone_verified`, `future_api`

## 6. Public Display Rules
Public pages must say:
- "Insurance acceptance should be confirmed with the provider before visiting."
- Arabic equivalent must be shown on Arabic pages.

Do not display definitive eligibility statements unless verified by integration.

## 7. Admin Panel Requirements
Admin must be able to:
- Manage insurance companies.
- Add/disable insurance plans.
- Assign accepted insurance to centers/doctors.
- Mark acceptance as verified/unverified.
- Set last checked date.
- Bulk import insurance acceptance.
- Review stale insurance records.

## 8. Provider Panel Requirements
Provider may:
- Request adding insurance companies.
- Edit claimed insurance acceptance.
- Upload supporting document privately.
- Submit for admin verification.

Provider may not:
- Mark insurance as admin-verified.
- Change public disclaimers.

## 9. SEO Rules
Insurance landing pages may be created only when content quality gates pass:
- At least enough verified/listed providers.
- Unique intro text.
- FAQ reviewed.
- No thin pages.
- No query-parameter pages indexed.

Allowed future routes:
- `/[locale]/om/insurance`
- `/[locale]/om/insurance/[insuranceSlug]`
- `/[locale]/om/insurance/[insuranceSlug]/[specialtySlug]`

MVP may keep these routes disabled until content depth exists.

## 10. Payment Acceptance
Separate provider payment acceptance from DrMuscat subscription billing.

Provider payment acceptance options:
- `cash`
- `card`
- `bank_transfer`
- `insurance_direct_billing`
- `insurance_reimbursement`
- `tabby_future`
- `tamara_future`

Do not confuse provider patient-payment options with DrMuscat provider subscription payment gateways.
