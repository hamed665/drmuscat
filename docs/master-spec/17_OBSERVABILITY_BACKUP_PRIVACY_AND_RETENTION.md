# 17_OBSERVABILITY_BACKUP_PRIVACY_AND_RETENTION.md

# DrMuscat V10.3 — Observability, Backup, Privacy, Retention, and Operational Safety

## 1. Purpose
This file defines how DrMuscat must log, monitor, back up, retain, and protect operational data. It must be read with:

- `13_SECURITY_RLS_APPROVAL_AND_AUDIT.md`
- `42_CONSENT_COOKIES_NOTIFICATIONS_AND_LEGAL_ACCEPTANCE.md`
- `57_PRODUCTION_MONITORING_SECURITY_AND_SYSTEM_HEALTH.md`
- `59_DATABASE_CANONICAL_PATCH_V10_3.md`

The goal is simple: when something breaks, know what broke; when data is sensitive, do not casually throw it into logs like confetti at a security incident.

---

## 2. Observability Layers

### 2.1 Application logs
Must capture:

```text
request_id
user_id when authenticated
role/workspace context
route/action
status
latency
error code
safe message
timestamp
```

Must not capture:

```text
passwords
otp codes
full access tokens
service role keys
payment card data
private receipt URLs
license document URLs
raw medical records
private CRM notes in public logs
```

### 2.2 Audit logs
Audit logs are not the same as debug logs. Audit logs must record intentional business actions:

```text
admin creates/edits/deletes entity
admin approves/rejects claim
admin approves/rejects payment
provider edits profile
provider uploads media
SEO indexability changed
redirect changed
plan assignment changed
role/permission changed
legal document published
```

Audit logs must include before/after where practical.

### 2.3 Error tracking
Production must support error tracking with:

```text
error fingerprint
stack trace
route
release version
user role if authenticated
request id
severity
resolved status
```

PII must be scrubbed.

---

## 3. Metrics

Minimum metrics:

```text
page response time
public page error rate
admin action error rate
Supabase query failure count
auth failures
upload failures
payment webhook failures
sitemap generation failures
cron job status
```

Business metrics are defined separately in analytics files.

---

## 4. Backup Requirements

### 4.1 Database backup
Production must have:

```text
daily automated database backup
manual backup before major migration
restore test schedule
backup retention policy
```

### 4.2 Storage backup
Private buckets requiring protection:

```text
receipts
licenses
verification documents
private import files
support attachments
```

Public media should still have durability controls but does not need the same privacy treatment.

### 4.3 Pre-migration backup rule
Before applying migrations that alter canonical tables:

```text
- export schema
- run migration in staging
- backup production
- record rollback plan
```

---

## 5. Retention Policy

### 5.1 Suggested retention defaults

```text
application debug logs: 30-90 days
audit logs: 3-7 years depending legal/business needs
payment records: according to finance/legal requirements
payment webhook logs: 180-365 days, scrubbed where possible
consent logs: retain while legally required
support tickets: 2-5 years depending sensitivity
behavior events raw: 12-24 months
aggregated analytics: longer allowed
```

These are product defaults, not legal advice. Final policy must be reviewed for Oman/GCC compliance.

### 5.2 Deletion and anonymization
Where deletion is requested or required:
- delete or anonymize personal profile data.
- preserve legal/audit records where legally required.
- avoid orphaning business-critical records.
- record deletion request status.

---

## 6. Privacy Requirements

### 6.1 Data classification
Classify data as:

```text
public
internal
provider-private
user-private
finance-private
legal-private
security-private
```

### 6.2 Public-safe fields
Only approved public profile fields may appear in:
- SEO pages.
- structured data.
- llms.txt-related summaries.
- AI summary blocks.
- sitemap.

Never expose:
- CRM notes.
- receipts.
- license files.
- payment webhook payloads.
- support private attachments.
- unpublished provider details.
- user contact details except provider-approved public contacts.

---

## 7. Incident Response

Define incident categories:

```text
security_leak
data_loss
payment_failure
seo_deindexing_risk
public_outage
admin_outage
provider_data_corruption
```

Each incident must record:

```text
incident_id
severity
started_at
detected_at
resolved_at
owner
impact
root_cause
fix
prevention
```

---

## 8. System Health Panel Requirements

Admin system health must show:

```text
app version
build hash
last deployment
current migration version
last backup time
cron status
sitemap status
failed webhook count
error rate
storage usage
queue status if queues exist
```

---

## 9. Acceptance Criteria

```text
- Audit log table exists and is used for sensitive admin/provider actions.
- Application logs avoid sensitive values.
- Production error tracking is configured or explicitly deferred with documented alternative.
- Backup plan exists before production launch.
- Private files are stored in private buckets.
- Retention policy is documented.
- System health panel requirements are implemented or phase-marked.
- No private data appears in public SEO, structured data, or AI discovery outputs.
```
