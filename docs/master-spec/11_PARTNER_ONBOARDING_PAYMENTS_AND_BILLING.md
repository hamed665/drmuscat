# 11_PARTNER_ONBOARDING_PAYMENTS_AND_BILLING.md

# DrMuscat V10.3 — Partner Onboarding, Provider Plans, Payments, Billing, and Revenue Operations

## 1. Purpose
This file defines the provider onboarding and billing operating model for DrMuscat. It supersedes any older vague billing notes. It must be read together with:

- `02_BUSINESS_MODEL.md`
- `33_CENTER_ACQUISITION_CLAIM_AND_SALES_CRM_SYSTEM.md`
- `43_PAYMENT_GATEWAYS_DYNAMIC_PLANS_AND_UPGRADE_NUDGES.md`
- `53_PROVIDER_DASHBOARD_AND_PLAN_ENTITLEMENTS.md`
- `59_DATABASE_CANONICAL_PATCH_V10_3.md`
- `62_PANEL_ROUTE_PERMISSION_MATRIX.md`

The launch model is **SEO-first free user discovery + paid provider subscriptions + transparent sponsored visibility**. Users must be able to browse anonymously. Paid providers must not buy organic ranking. Apparently this has to be written in stone because software agents enjoy inventing capitalism at the database layer.

---

## 2. Canonical Monetization Rules

### 2.1 User side
- Anonymous browsing is allowed.
- Free user registration is allowed.
- No Health Card.
- No card number.
- No paid consumer membership at launch.
- Patient offers replace the old card concept.
- Offer claims may be anonymous or authenticated depending on fraud-control rules, but browsing must never require login.

### 2.2 Provider side
Providers pay for:
- Subscription plan level.
- Profile enhancement features.
- Sponsored slots clearly labeled as ads.
- Optional content/media services.
- Optional SEO/content add-ons.
- Optional appointment/lead management features when enabled.

Providers must not pay to manipulate organic ranking.

### 2.3 Initial payment strategy for Oman
MVP payment order:
1. Manual bank transfer / receipt upload.
2. Thawani foundation.
3. Tap Payments foundation.
4. MyFatoorah future-ready.
5. Stripe only if business/legal conditions justify it later.

Only manual payment is required in the first sellable MVP. Gateway integrations are deferred unless explicitly approved.

---

## 3. Provider Onboarding Flow

### 3.1 Acquisition sources
A provider may enter the system through:
- Sales CRM lead.
- Public claim profile form.
- Admin-created provider account.
- Imported center data followed by outreach.
- Referral from another provider.
- Sponsored campaign inquiry.

### 3.2 Onboarding states
Canonical states:

```text
lead_created
contacted
interested
proposal_sent
negotiation
contract_pending
payment_pending
receipt_uploaded
payment_verified
onboarding_started
profile_setup
content_review
published
active
renewal_pending
expired
churned
rejected
```

### 3.3 Required onboarding checkpoints
Before a provider becomes active:
- Legal provider entity or responsible person captured.
- Center/doctor ownership or authority verified.
- Plan selected.
- Payment method selected.
- Receipt/payment approved if paid plan.
- Profile completeness minimum passed.
- Public listing checked for medical claim compliance.
- Arabic and English minimum data available where required.
- Admin approval logged.

---

## 4. Provider Plans

### 4.1 Canonical table
Use `public.provider_plans`, not legacy `public.plans`, for V10.3 provider subscription catalog.

Legacy `public.plans` may remain only for backward compatibility or migration history. New application logic must use `provider_plans`.

### 4.2 Initial plan levels
Four levels are required:

```text
free_basic
starter
growth
premium
```

Optional future level:

```text
enterprise
```

### 4.3 Plan fields
`provider_plans` must support:

```text
id
code
name_en
name_ar
description_en
description_ar
billing_periods_supported
price_monthly_omr
price_6_months_omr
price_yearly_omr
features_json
limits_json
entitlements_json
is_public
is_recommended
sort_order
status
created_at
updated_at
```

### 4.4 Plan entitlement examples
Entitlements must be enforced in backend and UI:

```json
{
  "max_centers": 1,
  "max_doctors": 5,
  "max_gallery_images": 8,
  "max_offers": 1,
  "analytics_level": "basic",
  "sponsored_slots_allowed": false,
  "profile_badge": "basic",
  "priority_support": false,
  "appointment_requests": true,
  "seo_enhanced_profile": false
}
```

### 4.5 MVP limits
MVP must support plan assignment and entitlement checks. It must not require real-time payment gateway integration.

---

## 5. Subscriptions

### 5.1 Subscription states
Canonical subscription states:

```text
trial_disabled
pending_payment
active
past_due
grace_period
paused
cancelled
expired
renewed
upgraded
downgraded
```

Trial is disabled for MVP unless explicitly re-enabled in a later approved document.

### 5.2 Subscription fields
Required subscription data:

```text
provider_workspace_id
provider_plan_id
billing_period
starts_at
ends_at
renewal_due_at
status
payment_status
source
sales_owner_id
notes
created_by
updated_by
created_at
updated_at
```

### 5.3 Renewal workflow
- Admin dashboard must show subscriptions expiring in 30, 14, 7, and 1 day.
- Sales panel must create follow-up tasks.
- Provider dashboard may show renewal warning.
- No automatic downgrade until admin-defined grace period expires.

---

## 6. Manual Payment and Receipt Upload

### 6.1 Manual payment flow
1. Provider selects or is assigned a plan.
2. System creates pending invoice/payment record.
3. Provider or sales/admin uploads receipt.
4. Finance/admin reviews receipt.
5. Admin approves or rejects.
6. On approval, subscription becomes active.
7. Audit log records the action.

### 6.2 Receipt upload rules
- Receipts are private files.
- Receipts must never be publicly accessible.
- Allowed types: PDF, JPG, PNG, WEBP.
- Maximum size must be configurable.
- Receipt storage bucket must be private.
- Virus/malware scanning is recommended for production hardening.

### 6.3 Payment statuses

```text
draft
pending_provider_action
receipt_uploaded
under_review
approved
rejected
cancelled
refunded
adjusted
```

### 6.4 Rejection reasons
Admin must choose or enter a reason:
- Unreadable receipt.
- Wrong amount.
- Duplicate receipt.
- Wrong beneficiary.
- Missing transfer reference.
- Payment not received.
- Other.

---

## 7. Invoices, Receipts, and Finance Records

### 7.1 Invoice requirements
Invoices must support:

```text
invoice_number
provider_workspace_id
subscription_id
currency
subtotal
discount
tax_amount
total
status
issued_at
due_at
paid_at
pdf_url_private
created_by
```

### 7.2 Oman VAT/tax note
Do not hard-code tax rules. Store tax configuration in `platform_settings` and render invoices according to the active setting. If tax treatment is uncertain, mark invoice tax as configurable and require admin review.

### 7.3 Credit notes and adjustments
Future-ready fields required:
- adjustment_type
- reason
- approved_by
- approved_at
- linked_invoice_id

Refunds and credit notes are not MVP unless manually handled by admin.

---

## 8. Payment Gateway Foundation

### 8.1 Gateway config table
Use `payment_gateways` from V10.2/V10.3. It must include:

```text
provider_code
country_code
currency
status
mode
config_json_encrypted
webhook_secret_reference
supports_refunds
supports_recurring
sort_order
created_at
updated_at
```

### 8.2 Provider codes
Allowed provider code strategy:

```text
manual_bank_transfer
thawani
tap
myfatoorah
stripe
```

If an existing enum lacks `myfatoorah`, the implementation must either:
- add it explicitly through a safe migration, or
- keep MyFatoorah as gateway config only until payment integration is approved.

Do not silently mismatch `payment_gateways.provider_code` and payment enum values.

### 8.3 Webhook logs
All gateway webhook payloads must be stored in private admin-only logs:

```text
payment_webhook_logs
```

Webhook payloads must never be exposed to provider users.

---

## 9. Billing Admin Panel

Admin/finance must be able to:

```text
- create provider plan
- edit plan pricing
- activate/deactivate plan
- assign plan to provider
- create invoice
- view payment status
- review receipt
- approve/reject manual payment
- extend subscription
- pause subscription
- cancel subscription
- mark as expired
- add internal finance note
- export finance report
- view renewal pipeline
```

Every finance action must be audit-logged.

---

## 10. Provider Billing Panel

Provider must be able to see:

```text
- current plan
- plan features
- plan limits
- renewal date
- invoice list
- payment instructions
- receipt upload
- payment status
- upgrade options
- support contact
```

Provider must not be able to:
- self-approve payment.
- change verified status.
- edit plan price.
- access other providers' invoices.
- see gateway secrets or webhook logs.

---

## 11. Sales Commission Foundation

MVP may track sales owner. Future commission support requires:

```text
sales_owner_id
commission_rate
commission_status
commission_period
commission_payout_id
```

Commission payout automation is deferred. Manual reporting is acceptable for first sellable version.

---

## 12. Acceptance Criteria

Before this module is considered complete:

```text
- Provider plan catalog exists using provider_plans.
- Legacy plans is not used for new provider logic.
- Admin can assign a plan to a provider workspace.
- Manual payment can be created.
- Receipt can be uploaded to private storage.
- Admin can approve/reject receipt.
- Subscription status updates after approval.
- Provider can see billing status but cannot self-approve.
- All finance actions create audit log entries.
- No payment/billing/receipt data is publicly exposed.
- npm run build, lint, and typecheck pass after implementation.
```
