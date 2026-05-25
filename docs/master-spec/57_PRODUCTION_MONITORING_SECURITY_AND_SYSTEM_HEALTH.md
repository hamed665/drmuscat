# 57_PRODUCTION_MONITORING_SECURITY_AND_SYSTEM_HEALTH.md

# DrMuscat V10.3 — Production Monitoring, Security, and System Health

## 1. Purpose
A production healthcare discovery platform needs operational visibility. "It works on my laptop" is not a deployment strategy; it is a cry for help wearing a hoodie.

## 2. System Health Panel
Admin system health must show:
- App version.
- Git commit/build version.
- Deployment environment.
- Database migration version.
- Last successful deployment.
- Last failed deployment.
- Supabase connectivity.
- Storage bucket status.
- Sitemap generation status.
- Cron job status.
- Failed webhook count.
- Failed notification count.
- Error logs summary.
- Rate limit events.
- Disk/storage usage if available.

## 3. Security Requirements
- RLS must be enabled on all user/provider/admin data tables.
- Service role key must never be exposed to client.
- Public pages may use safe server-side queries only.
- Admin routes must require admin role.
- Provider routes must require ownership/membership.
- File uploads must validate type, size, and target bucket.
- Private documents must never be publicly served.
- Payment receipts and license files must use private buckets.

## 4. Rate Limiting
Apply rate limits to:
- Appointment request form.
- Claim form.
- Support form.
- Review submission.
- Search endpoint.
- Login/OTP flows.
- Upload endpoints.

## 5. Backups and Recovery
Document:
- Database backup schedule.
- Storage backup approach.
- Migration rollback policy.
- Manual recovery steps.
- Export process for critical business data.

## 6. Error Handling
- Public users see friendly localized errors.
- Admin sees useful error references.
- Sensitive stack traces must not be exposed publicly.
- Errors must be logged with context.

## 7. Performance Budgets
Keep V10.2 targets:
- LCP target under 1.5s.
- INP target under 100ms.
- CLS target under 0.05.
- Initial JS under 200KB gzip target.
- Public page weight under 1MB target where realistic.

Admin dashboards may be heavier, but public SEO pages must stay fast.

## 8. Launch Checklist
Before production launch:
- `npm run build` passes.
- Lint passes.
- Type check passes.
- Migration validation passes.
- RLS test suite passes.
- Sitemap generated.
- Robots checked.
- No `/fa` or `/hi` sitemap URLs.
- No old `/[locale]/centers` canonical URLs.
- No Health Card public feature.
- No private data in public pages.
- Basic backup policy documented.
