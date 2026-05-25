# 74_UI_COMPONENT_CONTRACT_AND_DESIGN_SYSTEM.md — UI Component Contract and Design System

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
This file prevents inconsistent UI generated page by page.

## 2. Design Principles
- Medical trust first.
- Luxury but fast.
- Mobile-first.
- Arabic RTL and English LTR equal quality.
- No heavy animation in MVP.
- No custom cursor.
- No sound design.
- No decorative bloat that harms Core Web Vitals.

## 3. Required Base UI Components
Create reusable components before page-specific styling:
```txt
Button
Card
Badge
Input
Textarea
Select
Tabs
Modal
Drawer
Table
Skeleton
EmptyState
PageHeader
Breadcrumbs
Pagination
FormField
Toast/Alert
```

## 4. Medical/Public Components
```txt
CenterCard
DoctorCard
SpecialtyCard
AreaCard
SponsoredSlot
ContactActions
TrustBadges
WorkingHours
InsuranceBadges
ServicePriceRange
ProfileCompletenessBar
ReviewSummary
ClaimProfileCTA
```

## 5. Admin Components
```txt
AdminShell
AdminSidebar
AdminTopbar
DataTable
FilterBar
StatusBadge
ApprovalQueueCard
AuditDiffViewer
EntitySearchBox
BulkActionBar
```

## 6. Provider Components
```txt
ProviderShell
ProfileCompletenessPanel
EditableSectionCard
PlanLimitNotice
UpgradeNudge
LeadStatsCard
MediaUploader
```

## 7. Accessibility
- Buttons must be keyboard accessible.
- Inputs must have labels.
- Color alone must not communicate status.
- Focus states must be visible.
- Arabic text must not break layout.
- Interactive cards need accessible names.

## 8. Performance
- Use optimized images.
- Avoid unnecessary client components.
- Avoid large icon libraries imported wholesale.
- Skeletons must not cause layout shift.
- Public pages should prefer server rendering.

## 9. Styling Rules
- Use design tokens from the spec.
- Do not inline random one-off colors unless token does not exist.
- If a new token is needed, add it intentionally.
- Do not duplicate component variants page by page.
