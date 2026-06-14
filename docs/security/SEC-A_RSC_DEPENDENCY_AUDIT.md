# SEC-A — React Server Components dependency/security audit

Date: 2026-06-14
Mode: PHASED_BUILD_ONLY

## Phase mapping

- Execution Phase: Production hardening / dependency security audit
- Lock Scope: Documentation-only security audit note, with package files inspected
- Product Module: Platform dependency/security baseline
- Subphase ID: PROD-SEC-A

## Scope

This audit reviewed the repository dependency state after PR #203 was merged and PR #201/#202 were closed as superseded. It specifically checks whether stale/draft Vercel React Server Components security PRs #140 and #141 should be merged, replaced, or closed as superseded.

No product features, routes, UI, migrations, RLS policies, admin/provider/dashboard/billing/AI/SEO pages, or seed data were changed.

## Files inspected

- `package.json`
- `pnpm-lock.yaml`

## Dependency findings

`package.json` currently declares:

- `next`: `16.2.7`
- `react`: `19.2.0`
- `react-dom`: `19.2.0`

`package.json` does not directly declare any of the following React Server Components packages:

- `react-server-dom-webpack`
- `react-server-dom-turbopack`
- `react-server-dom-parcel`

`pnpm-lock.yaml` currently resolves:

- `next`: `16.2.7(@babel/core@7.29.7)(react-dom@19.2.0(react@19.2.0))(react@19.2.0)`
- `react`: `19.2.0`
- `react-dom`: `19.2.0(react@19.2.0)`

The lockfile search found no resolved entries for:

- `react-server-dom-webpack`
- `react-server-dom-turbopack`
- `react-server-dom-parcel`

## RSC CVE assessment

The stale Vercel PRs #140 and #141 target older Next.js versions and should not be blindly merged into the current dependency baseline.

The current repository already resolves `next` to `16.2.7`, which is newer than the fixed `16.2.6` security-release baseline identified for the later Next.js 16.x security advisories. The lockfile also contains no standalone `react-server-dom-*` package resolutions at vulnerable versions.

Because no vulnerable `react-server-dom-webpack`, `react-server-dom-turbopack`, or `react-server-dom-parcel` lockfile entries are present, this audit does not require package changes.

## Recommendation

Close PR #140 and PR #141 as stale/superseded by the current dependency baseline, rather than merging them.

No replacement dependency PR is needed from this audit unless a future security advisory specifically requires a newer `next`, `react`, `react-dom`, or standalone `react-server-dom-*` version.

## Validation notes

Required validation for this SEC-A audit:

- `pnpm install --frozen-lockfile`
- `pnpm typecheck`
- `pnpm build`
- `pnpm lint`
- `pnpm routes:check`

An additional informational `pnpm audit --prod --json` attempt was made during audit triage, but the npm audit endpoint returned HTTP 403 in this environment. This was not part of the required validation gate and did not change the lockfile conclusion above.
