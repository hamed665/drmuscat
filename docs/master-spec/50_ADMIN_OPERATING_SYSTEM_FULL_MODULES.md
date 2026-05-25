# 50_ADMIN_OPERATING_SYSTEM_FULL_MODULES.md

# DrMuscat V10.3 — Full Admin Operating System

## 1. Purpose
The admin panel must be the control tower for DrMuscat. If an operational object can affect SEO, billing, public trust, provider visibility, legal exposure, or data quality, it must be manageable by admin. Humanity has already suffered enough from hardcoded dashboards.

## 2. Admin Philosophy
- No critical production behavior should require code changes after launch.
- Admin UI must not bypass RLS/business rules.
- Dangerous changes require audit logs.
- Sensitive actions require confirmation and reason.
- Every module must have permission boundaries.

## 3. Required Admin Modules

### 3.1 Command Center
Must show:
- Pending claims.
- Pending profile edits.
- Pending media reviews.
- Pending payments/receipts.
- Expiring subscriptions.
- Profiles with low quality score.
- Broken SEO pages.
- Duplicate candidates.
- Recent risky admin actions.

### 3.2 Centers Manager
Manage:
- Center profile.
- Branch/location.
- SEO fields.
- Contact details.
- WhatsApp/phone/maps.
- Working hours/Ramadan hours.
- Specialties/services.
- Images.
- Verification status.
- Sponsored eligibility.
- Ownership.
- Listing status.

### 3.3 Doctors Manager
Manage:
- Doctor identity.
- Photo/cover.
- Bio and short bio.
- Specialty/subspecialty.
- Conditions/procedures.
- Education.
- Experience.
- Languages.
- Nationality.
- License and verification.
- Practice locations.
- Services/pricing.
- Insurance.
- Media/before-after consent.
- SEO fields.

### 3.4 Organizations Manager
Manage provider groups that own multiple centers/branches.

### 3.5 Claims Manager
Manage:
- Claim requests.
- Proof documents.
- Approval/rejection.
- Ownership mapping.
- Claim history.
- Conflict resolution.

### 3.6 Users and Roles
Manage:
- Profiles.
- Roles.
- Workspace memberships.
- Suspensions.
- Permission assignments.
- Staff invitation.

### 3.7 Permission Matrix
Must support role/module/action permissions.
Actions:
- `view`
- `create`
- `edit`
- `submit_for_review`
- `approve`
- `reject`
- `publish`
- `archive`
- `delete_soft`
- `export`
- `billing_approve`

### 3.8 SEO Operations
See file 51.

### 3.9 Taxonomy Manager
See file 52.

### 3.10 Geo Manager
See file 52.

### 3.11 Import and Duplicate Management
See files 52 and 56.

### 3.12 Reviews and Trust
Manage:
- Review moderation.
- Abuse reports.
- Provider replies.
- Verified review status.
- Review schema eligibility.

### 3.13 Offers Manager
Manage:
- Offer terms.
- Offer claim codes.
- Redemption status.
- Offer expiry.
- Provider accountability.
- Medical disclaimers.

### 3.14 Appointments Manager
See file 48.

### 3.15 Insurance Manager
See file 49.

### 3.16 Sales CRM
Manage:
- Leads.
- Pipeline.
- Follow-ups.
- Proposal status.
- Objections.
- Sales owner.
- Contract status.
- Renewal reminders.
- Commission attribution.

### 3.17 Ads and Sponsored Manager
Manage:
- Sponsored slots.
- Ad placements.
- Campaigns.
- Wallet/credits if enabled.
- Label compliance.
- Inventory limits.
- Sponsored vs organic separation.

### 3.18 Billing and Finance
Manage:
- Plans.
- Subscriptions.
- Invoices.
- Manual payment receipts.
- Payment approval.
- Refund/credit notes.
- Renewals.
- Outstanding payments.

### 3.19 Support Tickets
See file 55.

### 3.20 Notification Templates
See file 55.

### 3.21 Legal and Consent
Manage:
- Terms.
- Privacy.
- Medical disclaimer.
- Cookie policy.
- Versioning.
- Forced re-acceptance.

### 3.22 Settings and Feature Flags
Manage:
- Public feature flags.
- Admin-only flags.
- Country/locale settings.
- Module visibility.
- Runtime config.

### 3.23 Analytics and Reports
Manage/view:
- Public traffic.
- Clicks.
- Leads.
- Search logs.
- Profile views.
- Offer claims.
- Sponsored performance.
- Provider reports.

### 3.24 System Health
See file 57.

## 4. Admin UI Routes
Canonical admin route prefix:
- `/admin`

Required route groups:
- `/admin/command-center`
- `/admin/centers`
- `/admin/doctors`
- `/admin/organizations`
- `/admin/claims`
- `/admin/users`
- `/admin/roles-permissions`
- `/admin/seo`
- `/admin/redirects`
- `/admin/taxonomy`
- `/admin/geo`
- `/admin/imports`
- `/admin/duplicates`
- `/admin/reviews`
- `/admin/offers`
- `/admin/appointments`
- `/admin/insurance`
- `/admin/sales-crm`
- `/admin/ads`
- `/admin/billing`
- `/admin/support`
- `/admin/notifications`
- `/admin/legal`
- `/admin/settings`
- `/admin/audit-logs`
- `/admin/system-health`

## 5. Acceptance Criteria
- A super_admin can manage all public profile data without code changes.
- A content_manager can edit content but not billing or permissions.
- A finance_manager can manage payments but not SEO canonical rules.
- A marketer can manage sales CRM but not admin settings.
- Every sensitive update writes an audit log.
- Admin cannot silently change organic ranking to favor paid providers.
