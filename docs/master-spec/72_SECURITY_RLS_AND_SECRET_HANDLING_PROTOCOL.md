# 72_SECURITY_RLS_AND_SECRET_HANDLING_PROTOCOL.md — Security, RLS, and Secret Handling Protocol

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
This file protects user data, provider data, admin controls, and platform trust.

## 2. Secret Rules
- Never commit `.env.local`.
- Never hardcode service role keys.
- Never expose service role key in client bundles.
- Never log tokens, payment secrets, webhook secrets, or auth cookies.
- If a secret-like string appears in repo, stop and report.

## 3. RLS Defaults
All non-public tables must have RLS enabled.
Public read tables must still have explicit policies.
Admin write must be explicit.
Provider write must be ownership-scoped.
Anonymous writes must be limited to safe forms and rate-limited where possible.

## 4. Table Policy Categories
### Public read, admin write
- countries/regions/cities/areas
- public centers
- public doctors
- public specialties
- published legal documents

### User-owned
- notification preferences
- saved doctors/centers
- user legal acceptances
- patient account data

### Provider-owned after claim
- center profile edits
- provider media drafts
- services/prices for owned center subject to moderation rules

### Admin-only
- payment webhook logs
- audit logs
- import batches raw errors
- system settings not public
- private verification documents

### Insert-only events
- click events
- behavior events
- search logs
Read access admin only.

## 5. Provider Ownership Rules
A provider can edit an entity only if:
- claim is approved,
- ownership mapping exists,
- entity is active or editable draft,
- specific permission exists,
- field is allowed for provider editing.

Providers must not self-edit:
- verified badge
- sponsored status
- organic ranking score
- plan entitlement
- payment status
- license verification status

## 6. Admin Audit Rules
Audit these actions:
- approve/reject claim
- edit verification status
- change plan
- approve receipt
- publish legal document
- change SEO indexability
- create redirect
- merge duplicate
- delete/deactivate listing

## 7. Input Validation
All server mutations must validate inputs with schemas. Recommended: Zod.

## 8. Medical Trust Guardrail
No UI may display guaranteed medical outcomes. Any medical content must be informational and include disclaimers where required by product spec.
