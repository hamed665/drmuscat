# 13_SECURITY_RLS_APPROVAL_AND_AUDIT.md

# Security, RLS, Approval and Audit

Default deny. RLS mandatory but not sufficient. Grants must be reviewed for anon/authenticated/service_role.

Helper functions: has_role, has_org_role, is_admin, is_org_member, owns_doctor_profile. SECURITY DEFINER, search_path public, null-safe.

Direct client writes forbidden for financial systems, roles, approvals, audit logs, settings, ledger, event/ad_event DB inserts.

Admin actions must be audit-logged with request_id, actor_id, action, entity, old/new values, created_at. Audit logs append-only.

Storage: private docs signed URLs only. Public assets only after approved media record.

Medical/commercial content review: banned claim regex + normalization + admin/manual review + medical reviewer for clinical content.


## V10 RLS Implementation Contract
- All 46 application tables must have RLS enabled in the first executable migration.
- Public read policies are allowed only for published/approved/indexable content.
- Admin/server actions must enforce role checks in code and in database helpers.
- Service role may be used only in server-only modules and never in Client Components.
- `settings`, `profile_roles`, `organization_members`, `audit_logs`, `payments`, `subscriptions`, `invoices`, `ledger_*`, `approval_requests`, `claim_requests`, `license_verifications`, private media and commission tables must never be writable directly from the browser.
- Audit logs are append-only. Do not build edit/delete audit UI.
