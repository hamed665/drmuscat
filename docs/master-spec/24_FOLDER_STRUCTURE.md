# 24_FOLDER_STRUCTURE.md

## Purpose
This document defines the canonical folder structure for DrMuscat.

Claude Code must not invent a parallel structure. No `lib2`, no `utils-final`, no `components-new`, no “temporary” folders that become permanent because humanity loves technical debt.

## 1. Canonical Source Tree

```text
src/
  app/
    api/
      ads/
        event/
          route.ts
      ai-chat/
        sessions/
          route.ts
        messages/
          route.ts
      analytics/
        event/
          route.ts
      billing/
        manual-subscription/
          route.ts
      events/
        route.ts
      leads/
        route.ts
      onboarding/
        center/
          route.ts
        doctor/
          route.ts
      claim-profile/
        route.ts
      offers/
        claim/
          route.ts
        redeem/
          route.ts
      reviews/
        route.ts
        [reviewId]/
          vote/
            route.ts
          report/
            route.ts
      search/
        centers/
          route.ts
        doctors/
          route.ts
        nearby/
          route.ts
      storage/
        signed-upload-url/
          route.ts
      admin/
        approve/
          route.ts
        reject/
          route.ts
        publish-center/
          route.ts
        publish-doctor/
          route.ts
        mark-payment-paid/
          route.ts
    microsite/
      [subdomain_slug]/
        [locale]/
          page.tsx
    [locale]/
      layout.tsx
      (public)/
        page.tsx
        centers/
          page.tsx
          [slug]/
            page.tsx
            reviews/
              page.tsx
          [categorySlug]/
            [areaSlug]/
              page.tsx
        doctors/
          page.tsx
          [slug]/
            page.tsx
        offers/
          page.tsx
        services/
          [serviceSlug]/
            page.tsx
          [serviceSlug]/
            [areaSlug]/
              page.tsx
        areas/
          [areaSlug]/
            page.tsx
        compare/
          [slug]/
            page.tsx
        for-clinics/
          page.tsx
        claim-your-clinic/
          page.tsx
        find-dental-clinics-muscat/
          page.tsx
        for-partners/
          page.tsx
        for-doctors/
          page.tsx
        claim-profile/
          page.tsx
        contact/
          page.tsx
        privacy-policy/
          page.tsx
        terms/
          page.tsx
        medical-disclaimer/
          page.tsx
        partner-terms/
          page.tsx
        blog/
          page.tsx
          [slug]/
            page.tsx
      auth/
        login/
          page.tsx
        verify/
          page.tsx
        complete-profile/
          page.tsx
        logout/
          route.ts
      (dashboard)/
        dashboard/
          user/
            page.tsx
          center/
            page.tsx
            [organizationId]/
              page.tsx
              leads/
                page.tsx
              analytics/
                page.tsx
              reviews/
                page.tsx
              scorecard/
                page.tsx
              billing/
                page.tsx
              profile/
                page.tsx
              media/
                page.tsx
              offers/
                page.tsx
              qr-kit/
                page.tsx
              doctors/
                page.tsx
              microsite/
                page.tsx
              ads/
                page.tsx
              reports/
                page.tsx
              settings/
                page.tsx
          admin/
            page.tsx
            approvals/
              page.tsx
            organizations/
              page.tsx
            centers/
              page.tsx
            doctors/
              page.tsx
            users/
              page.tsx
            billing/
              page.tsx
            payments/
              page.tsx
            subscriptions/
              page.tsx
            media/
              page.tsx
            ads/
              page.tsx
            ledger/
              page.tsx
            settings/
              page.tsx
            reviews/
              page.tsx
            ai-chat/
              page.tsx
            sales/
              page.tsx
              center-pitch/
                [centerId]/
                  page.tsx
              proposals/
                page.tsx
            reports/
              page.tsx
            seo/
              page.tsx
          doctor/
            page.tsx
          marketer/
            page.tsx
  components/
    ui/
      Button.tsx
      Card.tsx
      Badge.tsx
      Input.tsx
      Select.tsx
      Textarea.tsx
      Checkbox.tsx
      RadioGroup.tsx
      FormField.tsx
      ErrorMessage.tsx
      ConfirmDialog.tsx
      Toast.tsx
      Breadcrumbs.tsx
      Pagination.tsx
      Tabs.tsx
      Modal.tsx
      Sheet.tsx
      Skeleton.tsx
      EmptyState.tsx
      MobileStickyCTA.tsx
      SectionHeader.tsx
      Container.tsx
      MetricCard.tsx
      CommandSearch.tsx
      DateRangePicker.tsx
      FileUploadDropzone.tsx
      ImageUploadDropzone.tsx
      OptimizedImagePreview.tsx
      LocalizedTabs.tsx
    common/
      Header.tsx
      Footer.tsx
      LanguageSwitcher.tsx
      LocalizedLink.tsx
      WorkspaceSelector.tsx
      OfferBadge.tsx
      PartnerBadge.tsx
    auth/
      AuthCard.tsx
      PhoneLoginForm.tsx
      OtpVerifyForm.tsx
      CompleteProfileForm.tsx
    centers/
      CenterCard.tsx
      CenterProfileHero.tsx
      CenterContactActions.tsx
      CenterContactBar.tsx
      CenterStatusBadges.tsx
      CenterFilters.tsx
      SimilarCenters.tsx
      CenterReviewSummary.tsx
      CenterReviewList.tsx
      CenterReviewForm.tsx
      CenterScorecard.tsx
      ClaimProfileCTA.tsx
    doctors/
      DoctorCard.tsx
      DoctorProfileHero.tsx
    dashboard/
      DashboardShell.tsx
      DashboardSidebar.tsx
      DashboardTopbar.tsx
      DashboardCard.tsx
      DashboardTable.tsx
      KanbanBoard.tsx
      StatusColumn.tsx
      ApprovalQueue.tsx
    seo/
      JsonLd.tsx
      MedicalDisclaimer.tsx
      BreadcrumbJsonLd.tsx
      LocalBusinessJsonLd.tsx
    reviews/
      RatingBreakdown.tsx
      HelpfulVote.tsx
      ReviewPolicyNotice.tsx
    ai-chat/
      AiChatWidget.tsx
      AiChatDisclaimer.tsx
    sales/
      ProposalPreview.tsx
      VisibilityScorecard.tsx
  features/
    auth/
      actions.ts
      guards.ts
      phone.ts
      return-to.ts
      schemas.ts
    approvals/
      actions.ts
      schemas.ts
    billing/
      actions.ts
      schemas.ts
    centers/
      queries.ts
      schemas.ts
    content/
      medical-claims.ts
      schemas.ts
    crm/
      transitions.ts
      schemas.ts
    doctors/
      queries.ts
      schemas.ts
    events/
      schemas.ts
      tracking.ts
    offers/
      actions.ts
      schemas.ts
    leads/
      actions.ts
      schemas.ts
    reviews/
      actions.ts
      schemas.ts
      moderation.ts
      scoring.ts
    ai-chat/
      actions.ts
      schemas.ts
      safety.ts
      retrieval.ts
    analytics/
      events.ts
      attribution.ts
      schemas.ts
    offers/
      claims.ts
      schemas.ts
    sales/
      crm.ts
      proposals.ts
      schemas.ts
    media/
      actions.ts
      schemas.ts
    microsites/
      queries.ts
      metadata.ts
    referrals/
      actions.ts
      schemas.ts
    search/
      queries.ts
      schemas.ts
    storage/
      paths.ts
      schemas.ts
  lib/
    api-response.ts
    env.ts
    rate-limit.ts
    turnstile.ts
    request-id.ts
    supabase/
      client.ts
      server.ts
      service.ts
      middleware.ts
    i18n/
      config.ts
      direction.ts
      translate-field.ts
      dictionaries/
        en.ts
        ar.ts
        fa.ts
  server/
    audit/
      log.ts
    queries/
      dashboard.ts
      public-directory.ts
      centers.ts
      doctors.ts
      microsites.ts
    mutations/
      approvals.ts
      billing.ts
      leads.ts
      media.ts
      referrals.ts
      admin.ts
  types/
    app.types.ts
    database.types.ts
```

## 2. App Router Rules

- `src/app/api/*` contains Route Handlers only.
- `src/app/[locale]/*` contains localized UI routes.
- Public SEO pages must be Server Components by default.
- Interactive components must live under `components/*` or `features/*`.
- Dashboard pages may use Client Components for Kanban, filters, modals, and forms.
- Do not put business logic directly inside page files.

## 3. Supabase Files

Required files:

```text
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/service.ts
src/lib/supabase/middleware.ts
```

Rules:

- Browser client lives only in `client.ts`.
- Server session client lives only in `server.ts`.
- Service-role client lives only in `service.ts`.
- `service.ts` must import `server-only`.
- Do not create `admin.ts` for service-role client because the name can confuse admin UI with service-role access.

## 4. Auth Structure

Auth logic must live in:

```text
src/features/auth/
```

Auth components must live in:

```text
src/components/auth/
```

Routes:

```text
/[locale]/auth/login
/[locale]/auth/verify
/[locale]/auth/complete-profile
/[locale]/auth/logout
```

Rules:

- Phone login forms can be Client Components.
- Auth page layout should remain Server Component where possible.
- Phone normalization must use `src/features/auth/phone.ts`.
- Return-to validation must use `src/features/auth/return-to.ts`.

## 5. i18n Structure

Required files:

```text
src/lib/i18n/config.ts
src/lib/i18n/direction.ts
src/lib/i18n/translate-field.ts
src/lib/i18n/dictionaries/en.ts
src/lib/i18n/dictionaries/ar.ts
src/components/common/LanguageSwitcher.tsx
```

Rules:

- No hardcoded English labels in shared components.
- No separate microsite i18n system.
- Arabic must use RTL direction.
- Missing UI dictionary keys are not allowed in production.
- Localized database fields must use `getLocalizedField`.

## 6. Route Handler Structure

Every Route Handler should follow this internal structure:

```text
route.ts
  1. imports
  2. Zod schema import
  3. POST/GET function
  4. request_id generation where critical
  5. parse body/query
  6. validation
  7. auth guard if needed
  8. permission guard if needed
  9. business logic
  10. audit log if critical
  11. standardized response
```

Do not put huge business workflows inside `route.ts`. Move reusable logic into `features/*` or `server/mutations/*`.

## 7. Server Queries Structure

Use:

```text
src/server/queries/
```

For:

- public directory queries
- center profile hydration
- doctor profile hydration
- microsite rendering
- dashboard metrics

Rules:

- Server queries must not expose cross-tenant data.
- Public queries must only return published/approved data.
- Dashboard queries must rely on RLS or explicit server-side permission checks.

## 8. Server Mutations Structure

Use:

```text
src/server/mutations/
```

For:

- approval mutations
- billing mutations
- media mutations
- referral mutations
- admin mutations

Rules:

- Validate with Zod.
- Check permissions.
- Use RPC for atomic financial workflows.
- Write audit logs for critical actions.
- Return stable errors.

## 9. UI Component Discipline

All generic UI must live under:

```text
src/components/ui/
```

Rules:

- Do not create duplicate Button/Card/Badge/Input components.
- Business components must compose UI primitives.
- Every component must support RTL where relevant.
- Every component must be responsive.

## 10. Feature Modules

Use `features/*` for domain-specific logic.

Examples:

```text
src/features/leads/schemas.ts
src/features/leads/actions.ts
src/features/crm/transitions.ts
src/features/search/queries.ts
src/features/storage/paths.ts
```

Rules:

- Zod schemas live in feature modules.
- Reusable server actions live in feature modules or `server/mutations`.
- Do not duplicate schemas inside route files.

## 11. Storage Path Module

File:

```text
src/features/storage/paths.ts
```

Purpose:

- Centralize all storage path generation.
- Prevent client-generated arbitrary paths.

Required functions:

```ts
buildOrganizationMediaPath()
buildDoctorMediaPath()
buildLicenseDocumentPath()
buildPaymentReceiptPath()
buildContractPath()
```

Rules:

- Server generates storage paths.
- Client never submits final path.

## 12. Dashboard Structure

Dashboard shell components:

```text
src/components/dashboard/DashboardShell.tsx
src/components/dashboard/DashboardSidebar.tsx
src/components/dashboard/DashboardTopbar.tsx
```

Rules:

- Dashboard sidebar collapses on mobile.
- Dashboard pages must not be raw database tables.
- Tables must use responsive patterns.
- Admin dashboard can be desktop-optimized but must not be broken on mobile.

## 13. Microsite Structure

Microsite route:

```text
src/app/microsite/[subdomain_slug]/[locale]/page.tsx
```

Rules:

- Microsites are public if approved.
- Microsites support `/en` and `/ar` only in MVP.
- Language switcher preserves subdomain.
- Microsites reuse global dictionaries and UI components.
- Microsites canonicalize to main localized center profile by default.
- No private dashboard, payment, CRM, or admin data may appear on microsites.

## 14. Forbidden Folders and Patterns

Do not create:

```text
src/utils2/
src/lib/temp/
src/components/new/
src/components/v2/
src/app2/
old/
tmp/
final-final/
```

Do not create multiple Supabase service clients.
Do not create duplicate i18n systems.
Do not create page-specific button/card variants when shared components exist.

## 15. File Naming Rules

- Components: PascalCase, e.g. `CenterCard.tsx`.
- Helpers/utilities: kebab-case or camelCase consistently, e.g. `translate-field.ts`.
- Route files: `route.ts` only.
- Page files: `page.tsx` only.
- Server actions: `actions.ts` or domain-specific mutation files.
- Schemas: `schemas.ts`.

## 16. Import Alias Rule

Use the `@/` alias for all imports from `src`.

Approved:

```ts
import { Button } from '@/components/ui/Button';
```

Avoid deep relative chains:

```ts
import { Button } from '../../../../components/ui/Button';
```

## 17. Phase 0 Folder Creation Rule

In Phase 0, Claude Code may create folder placeholders and minimal files for:

- `src/features/auth`
- `src/components/auth`
- `src/lib/i18n`
- `src/lib/supabase`
- `src/components/ui`

But Phase 0 must not fully implement dashboards, microsites, billing, SEO pages, or admin workflows.

## 18. Completion Rule

Before completing any implementation phase, Claude Code must confirm:

- No duplicate folder structures were created.
- All new files are in canonical paths.
- No service-role code is imported into client components.
- No public SEO page became a full Client Component.
- No i18n bypass or hardcoded labels were introduced.


## V10 Required Additional Folders

```text
src/
  components/
    admin-settings/
      AdminSettingsShell.tsx
      HomepageModuleEditor.tsx
      SeoSettingsForm.tsx
      MenuBuilder.tsx
      FeatureFlagTable.tsx
      TranslationEditor.tsx
      MediaOptimizationSettings.tsx
  features/
    admin-settings/
      actions.ts
      schemas.ts
      permissions.ts
    media/
      optimize-image.ts
      generate-derivatives.ts
      schemas.ts
      actions.ts
    seo/
      metadata.ts
      sitemap.ts
      hreflang.ts
      jsonld.ts
      robots.ts
```


## 12. V10 Growth/Reviews/AI Required Structure

Claude Code must add these modules when implementing the related phases:

```text
src/features/reviews/
src/features/ai-chat/
src/features/analytics/
src/features/offers/
src/features/sales/
src/components/reviews/
src/components/ai-chat/
src/components/sales/
```

Rules:
- Review submission/moderation/scoring logic must not live inside page files.
- AI chat safety/retrieval logic must be isolated from UI components.
- Analytics event names must use the canonical names from `34_GROWTH_ANALYTICS_ATTRIBUTION_AND_REPORTING.md`.
- Sales CRM/proposal logic must not be mixed with public center profile rendering.
- SEO JSON-LD helpers must be centralized under `components/seo` or `features/seo`, not duplicated per page.


## Advertising Folder Requirements

Claude Code must include folder placeholders for the internal advertising system when Phase 15 is approved:

```txt
src/app/[locale]/(center-dashboard)/dashboard/ads/page.tsx
src/app/[locale]/(center-dashboard)/dashboard/ads/new/page.tsx
src/app/[locale]/(center-dashboard)/dashboard/ads/[campaignId]/page.tsx
src/app/[locale]/(center-dashboard)/dashboard/ads/wallet/page.tsx
src/app/[locale]/(center-dashboard)/dashboard/ads/reports/page.tsx
src/app/[locale]/(admin)/admin/ads/page.tsx
src/app/[locale]/(admin)/admin/ads/placements/page.tsx
src/app/[locale]/(admin)/admin/ads/campaigns/page.tsx
src/app/[locale]/(admin)/admin/ads/creatives/page.tsx
src/app/[locale]/(admin)/admin/ads/wallets/page.tsx
src/app/[locale]/(admin)/admin/ads/pricing/page.tsx
src/app/[locale]/(admin)/admin/ads/events/page.tsx
src/app/api/ads/impression/route.ts
src/app/api/ads/click/route.ts
src/app/api/ads/wallet/topup-request/route.ts
src/components/ads/SponsoredLabel.tsx
src/components/ads/SponsoredCard.tsx
src/components/ads/AdBanner.tsx
src/components/ads/AdPlacementRenderer.tsx
src/lib/ads/placement-resolver.ts
src/lib/ads/event-tracking.ts
src/lib/ads/billing.ts
src/lib/ads/fraud-guards.ts
src/lib/ads/policy.ts
```

Do not create live advertising logic before Phase 15 approval.
```
