# 62_PANEL_ROUTE_PERMISSION_MATRIX.md

# DrMuscat V10.3 — Panel Route and Permission Matrix

## 1. Purpose
This file maps panels to route prefixes and required roles/permissions.

## 2. Public Routes
Prefix:
- `/[locale]/[country]`

Access:
- anonymous read.
- no login required.

Allowed locales:
- `en`
- `ar`

Allowed launch country:
- `om`

## 3. Admin Routes
Prefix:
- `/admin`

Roles:
- `admin`
- `super_admin`
- module-specific internal roles.

Required permission examples:
- `admin.centers.view`
- `admin.centers.edit`
- `admin.centers.approve`
- `admin.seo.publish`
- `admin.billing.approve_payment`
- `admin.roles.manage`

## 4. Provider Routes
Prefix:
- `/dashboard`

Roles:
- `center_owner`
- `center_staff`
- doctor-owned workspace role if implemented.

Ownership required:
- Provider can access only assigned workspace entities.

## 5. Sales Routes
Prefix:
- `/sales`

Roles:
- `marketer`
- `admin`
- `super_admin`

Limitations:
- No billing approval unless finance permission exists.
- No SEO publishing.
- No verification badge approval.

## 6. Finance Routes
Prefix:
- `/finance`

Roles:
- `finance_manager`
- `admin`
- `super_admin`

Allowed:
- Subscriptions.
- Invoices.
- Manual receipts.
- Renewals.
- Revenue reports.

Forbidden unless additional permission:
- Public profile content approval.
- SEO publishing.
- Role management.

## 7. Content/SEO Routes
Prefix:
- `/content`
- `/seo`

Roles:
- `content_manager`
- `admin`
- `super_admin`

Allowed:
- Articles.
- SEO pages.
- Meta fields.
- FAQ.
- Schema preview.
- Redirect drafts if permitted.

Publish may require `admin.seo.publish`.

## 8. Permission Model
Use explicit permissions rather than role-only checks for sensitive actions.

Required tables if not already present:
- `permissions`
- `role_permissions`
- `workspace_memberships`
- `module_permissions`

## 9. Global Rule
UI hiding is not security. Every route and mutation must enforce permissions on the server.
