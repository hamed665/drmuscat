# Draft Location Create Contract

This document defines the safe create contract for draft center location candidates.

## Eligibility

Only draft or pending_review centers may receive location candidates.

## Private defaults

Created location candidates must default to private state.

Required defaults:

- is_active: false
- public_primary_phone_visible: false
- public_whatsapp_phone_visible: false
- public_email_visible: false

## Side effects

No publish, activate, verify, claim, billing, sponsor, sitemap, or public visibility side effect is allowed.

## Audit

Every successful create action must write an admin audit event.

## Revalidation

The create action must revalidate the draft center detail page only.

## Later workflows

Editing, activation, contact review, and public promotion must be separate workflows.
