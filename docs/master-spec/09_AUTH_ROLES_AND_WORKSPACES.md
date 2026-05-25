# 09_AUTH_ROLES_AND_WORKSPACES.md

# Auth Roles and Workspaces

## Roles
`super_admin`, `admin`, `finance_manager`, `content_manager`, `center_owner`, `center_staff`, `doctor`, `marketer`, `user`.

Default public signup gets only `user`.

Admin/super_admin never via public signup.

Center owner requires approved onboarding/claim.
Doctor requires approved verification.
Marketer requires manual approval.

## Workspace Selector
If a user has multiple approved roles, show workspace selector. Never guess.

## Guards
Create requireUser, requireProfile, requireRole, requireAdmin, requireOrgMember, requireOrgOwnerOrManager.

Frontend hiding is not security. Backend and RLS enforce.

# V10 CANONICAL ADDITION — Exact Role Assignment Rules

## Role Assignment Source of Truth

Roles are stored only in:

```text
public.profile_roles
```

Allowed roles are controlled by:

```text
public.profile_role_type
```

Claude Code must not use arbitrary role strings.

## Default Signup Role

Every public signup receives only:

```text
user
```

Default phone-created users must never automatically receive:

- `admin`
- `super_admin`
- `finance_manager`
- `content_manager`
- `center_owner`
- `center_staff`
- `doctor`
- `marketer`

## center_owner Assignment

`center_owner` may be assigned only after:

1. user verifies phone
2. user completes profile
3. user submits center onboarding or claim request
4. request creates `claim_requests` and/or `approval_requests`
5. admin verifies ownership and required documents
6. admin approves the request
7. server-side admin workflow inserts `profile_roles(profile_id, 'center_owner')`
8. audit log is written

Do not allow client-side role insertion.

## center_staff Assignment

`center_staff` may be assigned only by:

- approved center owner within their organization, if the feature is enabled
- admin or super_admin

Server must verify the actor is allowed to manage that organization.

## doctor Assignment

`doctor` role may be assigned only after:

1. user verifies phone
2. user completes profile
3. user submits doctor onboarding/interest flow if enabled
4. license or identity verification is reviewed
5. admin approves doctor verification
6. server-side admin workflow inserts role
7. audit log is written

Doctor intent in profile completion does not create a doctor role.

## marketer Assignment

`marketer` role may be assigned only after:

1. user verifies phone
2. user submits marketer interest form
3. admin reviews candidate
4. admin approves marketer access
5. referral code is created server-side
6. server-side admin workflow inserts marketer role
7. audit log is written

Public users cannot self-assign marketer role.

## admin and super_admin Assignment

Admin roles must never be assigned through public signup.

Admin roles require:

- manual secure backend assignment
- super_admin approval
- audit log
- preferably verified email and stronger authentication flow

## Role Assignment Implementation Rule

All business/admin role assignment must happen through controlled server-side functions or admin-only route handlers.

Never expose a public API that accepts:

```json
{ "role_name": "admin" }
```

or any equivalent direct role mutation from the client.
