# 14_PREMIUM_UI_UX_PERFORMANCE_AND_ACCESSIBILITY.md

# DrMuscat V10.3 — Premium UI, UX, Performance, and Accessibility Requirements

## 1. Purpose
This file defines the baseline UI/UX, accessibility, and performance rules for the public website, admin, provider dashboard, and mobile-first experience. It must be read with:

- `04_DESIGN_SYSTEM_TOKENS_AND_COMPONENTS.md`
- `28_SEO_PERFORMANCE_AND_CORE_WEB_VITALS_GUARDRAILS.md`
- `40_LUXURY_UI_POLISH_AND_PERFORMANCE_BUDGET.md`
- `50_ADMIN_OPERATING_SYSTEM_FULL_MODULES.md`
- `53_PROVIDER_DASHBOARD_AND_PLAN_ENTITLEMENTS.md`

The product must feel premium, but not at the cost of crawlability, speed, or basic human usability. Apparently this is controversial in web design, where a button sometimes needs three libraries and a therapist.

---

## 2. UI Principles

### 2.1 Public site
The public experience must be:

```text
fast
mobile-first
SEO-readable
Arabic/English polished
clear call-to-action focused
trust-first
medical-claim-safe
low-friction
```

### 2.2 Admin and provider dashboards
Dashboard UI must be:

```text
functional before decorative
search-first
bulk-action capable
auditable
permission-aware
status-driven
usable on laptop and tablet
```

### 2.3 Visual tone
DrMuscat should feel:

```text
clean
trustworthy
premium
calm
medical but not sterile
modern GCC-localized
```

Avoid gimmicks in MVP:
- no sound design.
- no custom cursor.
- no heavy animation libraries.
- no WebGL hero section.
- no dark mode in launch scope unless explicitly approved later.

---

## 3. Design System Requirements

### 3.1 Tokens
All UI must use design tokens from file 04 for:
- colors.
- typography.
- spacing.
- radius.
- shadows.
- borders.
- z-index.
- breakpoints.

Do not hard-code random colors in components.

### 3.2 Components required for MVP

```text
Button
IconButton
Input
Textarea
Select
Combobox
Checkbox
Radio
Switch
Badge
StatusBadge
PlanBadge
SponsoredBadge
Card
ProfileCard
CenterCard
DoctorCard
Skeleton
EmptyState
Alert
Toast
Modal
Drawer
Tabs
Table
DataTable
Pagination
Breadcrumbs
LanguageSwitcher
CountrySwitcherPlaceholder
SearchBar
FilterPanel
MapLinkButton
WhatsAppButton
PhoneButton
DirectionsButton
```

### 3.3 Dashboard components

```text
AdminShell
ProviderShell
Sidebar
Topbar
CommandSearch
EntityHeader
AuditTimeline
ApprovalPanel
BulkActionBar
ImportPreviewTable
QualityScoreBadge
EntitlementWarning
BillingStatusCard
```

---

## 4. Responsive Requirements

### 4.1 Breakpoints
Use a consistent breakpoint system:

```text
mobile: 0-639px
tablet: 640-1023px
desktop: 1024-1439px
wide: 1440px+
```

### 4.2 Public pages
Must work perfectly on:
- iPhone Safari.
- Android Chrome.
- desktop Chrome.
- small laptop width.

### 4.3 Dashboard pages
Dashboard must be usable on desktop first, but must not break on tablet. Full mobile dashboard management is not required for MVP, but critical actions must degrade safely.

---

## 5. Accessibility Requirements

### 5.1 Baseline
Target WCAG 2.1 AA for core interactions.

Required:

```text
semantic HTML
keyboard navigation
visible focus states
labels for inputs
aria-label only when semantic label is not possible
sufficient color contrast
no icon-only action without accessible name
no hover-only critical controls
reduced motion support
```

### 5.2 Forms
Every form must include:
- field labels.
- validation messages.
- error summary for longer forms.
- disabled/loading states.
- success state.

### 5.3 RTL accessibility
Arabic layout must preserve:
- logical reading order.
- correct form alignment.
- mirrored icons only when semantically directional.
- numerals and phone numbers readable.

---

## 6. Performance Budget

Public page targets:

```text
LCP target: < 1.5s
INP target: < 100ms
CLS target: < 0.05
Initial JS gzip target: < 200KB where practical
Public page weight target: < 1MB where practical
```

These are targets, not permission to ship a slow site and write poetry about optimization later.

### 6.1 Required performance tactics
- Prefer server components for public pages.
- Avoid client components unless interaction requires them.
- Use image optimization.
- Use responsive image sizes.
- Lazy-load below-the-fold media.
- Avoid large icon packs imported wholesale.
- Avoid global heavy animation libraries.
- Avoid client-side fetching for SEO-critical content.

---

## 7. Public Page UX Requirements

### 7.1 Center listing
Must include:
- search.
- specialty filter.
- area filter.
- language/support indicators.
- sponsored section separated from organic results.
- clear contact actions.
- empty state.

### 7.2 Doctor listing
Must include:
- specialty filter.
- area/practice location filter.
- language filter.
- experience where available.
- center affiliation.
- verified badge only when true.

### 7.3 Profiles
Every center/doctor profile must include:
- trust header.
- contact CTA block.
- location block.
- services block.
- doctors/locations relationship where applicable.
- last updated/verified signal where available.
- report wrong info flow.

---

## 8. Sponsored UI Rules

Sponsored content must be visually premium but clearly labeled:

```text
Sponsored
إعلان ممول
```

Sponsored cards must never be visually confused with organic ranking. The user must understand that it is paid placement. Sneaky ads are just trust bankruptcy wearing nice shoes.

---

## 9. Empty, Loading, and Error States

Every major public and dashboard area must have:
- loading state.
- skeleton where appropriate.
- empty state with next action.
- recoverable error state.
- permission-denied state.
- not-found state.

No blank white screen is allowed.

---

## 10. Acceptance Criteria

```text
- Public pages are mobile-first and readable in English and Arabic.
- RTL/LTR switching does not break cards, buttons, filters, or forms.
- Core components use design tokens.
- Sponsored UI is clearly labeled.
- No heavy decorative systems are included in MVP.
- Accessibility labels and keyboard navigation exist for core flows.
- Public SEO pages render critical content server-side.
- Build/lint/typecheck pass.
- Lighthouse/Core Web Vitals review is documented before production launch.
```
