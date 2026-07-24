#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';

const baseline = 'd9ba9059df05184d6e9576bc694642118cdecf07';

async function replaceExact(file, replacements) {
  let source = await readFile(file, 'utf8');
  for (const [from, to] of replacements) {
    if (!source.includes(from)) {
      throw new Error(`${file}: expected alignment token not found: ${from.slice(0, 160)}`);
    }
    source = source.replace(from, to);
  }
  await writeFile(file, source);
}

await replaceExact('docs/import/import-readiness-roadmap-after-933.md', [
  [
    'Wave 4.2   COMPLETE  (#956) Exact logical recovery and bounded hash-only mismatch diagnostics proven\n```',
    'Wave 4.2   COMPLETE  (#956) Exact logical recovery and bounded hash-only mismatch diagnostics proven\nWave 5     PARTIAL   (#957) Server-authoritative Admin state machine complete; real Admin canary and Post-P09 decision remain open\n```',
  ],
  ['Aligned through: PR #956\nBaseline commit: 60c9ca8', 'Aligned through: PR #957\nBaseline commit: d9ba9059'],
  ['"alignedThroughPr": 956,', '"alignedThroughPr": 957,'],
  ['"runtimeBaseline": "60c9ca8fc466605af55360237ed40861e0106c78",', `"runtimeBaseline": "${baseline}",`],
  ['"currentNext": "ADMIN-STATE-MACHINE",', '"currentNext": "REAL-ADMIN-CANARY",'],
  ['"4.2": "COMPLETE"\n  },', '"4.2": "COMPLETE",\n    "5": "PARTIAL"\n  },'],
  ['## Wave 5 — Admin state machine and canary `OPEN`', '## Wave 5 — Admin state machine and canary `PARTIAL (#957)`'],
  [
    'Add server-authoritative refresh, stale detection, expiry countdown, double-submit protection, replay/fresh display, multi-tab collision handling, and readback-only safe retry. Never auto-retry Reservation, mutation, or rollback.\n\nRun one real Preview Pharmacy through the complete Admin path.',
    'P08 extends the existing protected `/admin/imports/readiness` workflow with all ten stages above. Every visible stage is derived from persisted server readback. The UI provides explicit readback-only refresh, stale and expiry handling, countdown, client pending lock, server revision binding for multi-tab collisions, fresh/replayed receipts, bounded audit history, and manual Preview-only rollback through the existing atomic authority. Reservation, mutation, and rollback are never retried automatically. Raw durable references, protected values, and unrestricted payloads remain outside browser contracts.\n\nP08 changes no database schema or authority and keeps the workflow single-entity, Pharmacy-only, private/noindex/no-route/no-sitemap, actor/entity allowlisted, and unavailable in Production.\n\nP09 must run one real Preview Pharmacy through the complete Admin path.',
  ],
  ['```text\nADMIN-STATE-MACHINE\n```\n\nP07 completed exact logical Pharmacy recovery verification with bounded path-and-hash-only mismatch diagnostics on the existing rollback path. The next implementation is P08 Admin state-machine wiring. Public/index/sitemap/route promotion, real P09 Admin canary execution and Production execution remain disabled.\n\nAfter `ADMIN-STATE-MACHINE` is green:\n\n```text\nREAL-ADMIN-CANARY\n```', '```text\nREAL-ADMIN-CANARY\n```\n\nP08 completed the server-authoritative ten-stage Pharmacy Admin workflow with readback-only refresh, expiry/stale handling, replay/fresh receipts, multi-tab revision rejection, double-submit protection, bounded audit history, manual rollback, and P07 exact-recovery readback. The next implementation is P09 real Admin canary. Public/index/sitemap/route promotion, Production execution, Agent, Content, Hospital, Doctor, Registry, and Bulk remain disabled.'],
]);

await replaceExact('docs/project-state/CURRENT_STATE.md', [
  ['aligned through PR #956 at baseline commit `60c9ca8fc466605af55360237ed40861e0106c78`', `aligned through PR #957 at baseline commit \`${baseline}\``],
  ['| Aligned through | PR #956 |', '| Aligned through | PR #957 |'],
  ['| Runtime baseline | `60c9ca8fc466605af55360237ed40861e0106c78` |', `| Runtime baseline | \`${baseline}\` |`],
  ['| Current next | `ADMIN-STATE-MACHINE` |', '| Current next | `REAL-ADMIN-CANARY` |'],
  ['| 4.2 | COMPLETE | PR #956; exact logical recovery and bounded hash-only mismatch diagnostics proven |', '| 4.2 | COMPLETE | PR #956; exact logical recovery and bounded hash-only mismatch diagnostics proven |\n| 5 | PARTIAL | PR #957; server-authoritative Admin state machine complete, while P09 canary and Post-P09 Go/No-Go remain open |'],
  ['Unexpected differences fail closed with bounded field paths and hashes only. Pharmacy public/index/sitemap promotion remains disabled.', 'Unexpected differences fail closed with bounded field paths and hashes only. P08 now derives ten Admin stages from persisted server readback, provides readback-only refresh, expiry and stale handling, fresh/replayed receipts, server revision binding for multi-tab collisions, client pending lock, manual rollback, exact-recovery verification, and bounded audit history. Reservation, mutation, and rollback are never retried automatically. Pharmacy public/index/sitemap promotion and the P09 real Admin canary remain disabled.'],
  ['- Preview-only guarded Pharmacy `private_publish` exists after exact Review, Authorization, Reservation verification and entity-bound confirmation. It remains single-entity, private/noindex/no-route/no-sitemap, bounded by post-mutation readback, and unavailable in Production.', '- Preview-only guarded Pharmacy `private_publish` exists after exact Review, Authorization, Reservation verification and entity-bound confirmation. It remains single-entity, private/noindex/no-route/no-sitemap, bounded by post-mutation readback, and unavailable in Production.\n- The protected `/admin/imports/readiness` page implements the P08 ten-stage server-authoritative Pharmacy state machine. Only one allowlisted actor/entity can access manual Preview controls; every action is revision-bound and accepted only after persisted post-operation readback. Refresh is readback-only, stale/expired state fails closed, fresh/replay outcomes are explicit, and bounded audit/exact-recovery diagnostics expose no raw values or persistence identifiers.'],
  ['runs the isolated P05 private publish/readback regression, the exact-SHA P06 atomic rollback authority proof and the P07 exact logical recovery proof.', 'runs the isolated P05 private publish/readback regression, the exact-SHA P06 atomic rollback authority proof and the P07 exact logical recovery proof. P08 Admin state-machine changes trigger the same hosted regressions and the bounded Admin UI/static contracts.'],
  ['- PRs #936–#956 are the current import-readiness runtime baseline.', '- PRs #936–#957 are the current import-readiness runtime baseline.'],
  ['- Preview Migration Sync, the isolated P05 regression proof, P06 concurrent rollback authority proof and P07 exact logical recovery proof pass with Production disconnected.', '- Preview Migration Sync, the isolated P05 regression proof, P06 concurrent rollback authority proof and P07 exact logical recovery proof pass on the P08 runtime evidence baseline with Production disconnected. P08 lint, typecheck, unit, build, route, env, migration, seed, RLS, SEO and import-readiness gates pass.'],
]);

await replaceExact('docs/project-state/V10_4_PHASE_ALIGNMENT_MATRIX.md', [
  ['aligned through PR #956 at baseline `60c9ca8fc466605af55360237ed40861e0106c78`', `aligned through PR #957 at baseline \`${baseline}\``],
  ['The current next implementation is `ADMIN-STATE-MACHINE`.', 'The current next implementation is `REAL-ADMIN-CANARY`.'],
  ['exact logical recovery is proven; UI activation remains gated.', 'exact logical recovery and the server-authoritative P08 Admin UI are proven; P09 real canary remains gated.'],
  ['| Aligned through | PR #956 |', '| Aligned through | PR #957 |'],
  ['| Runtime baseline | `60c9ca8fc466605af55360237ed40861e0106c78` |', `| Runtime baseline | \`${baseline}\` |`],
  ['| Current next | `ADMIN-STATE-MACHINE` |', '| Current next | `REAL-ADMIN-CANARY` |'],
  ['| Exact rollback recovery | Complete | #956 | `ADMIN-STATE-MACHINE` |', '| Exact rollback recovery | Complete | #956 | Maintain exact-recovery regression |\n| Admin state machine | Complete | #957 | `REAL-ADMIN-CANARY` |'],
]);

await replaceExact('README.md', [
  ['aligned through **PR #956** at baseline **`60c9ca8fc466605af55360237ed40861e0106c78`**', `aligned through **PR #957** at baseline **\`${baseline}\`**`],
  ['Current import-readiness implementation: **`ADMIN-STATE-MACHINE`**.', 'Current import-readiness implementation: **`REAL-ADMIN-CANARY`**.'],
  ['P07 proves exact logical Pharmacy recovery using the existing rollback authority, equal canonical hashes and bounded path-and-hash-only mismatch diagnostics. Rollback UI/state-machine activation, public/index/sitemap/route promotion and Production execution remain disabled.', 'P08 implements the protected ten-stage server-authoritative Pharmacy Admin state machine with revision-bound forms, readback-only refresh, stale/expiry handling, replay/fresh receipts, double-submit protection, manual rollback, exact recovery, and bounded audit history. P09 real Admin canary, public/index/sitemap/route promotion and Production execution remain disabled.'],
]);

await replaceExact('AGENTS.md', [
  ['Current import-readiness runtime baseline: **PR #956 at `60c9ca8fc466605af55360237ed40861e0106c78`**. The current next implementation is **`ADMIN-STATE-MACHINE`**.', `Current import-readiness runtime baseline: **PR #957 at \`${baseline}\`**. The current next implementation is **\`REAL-ADMIN-CANARY\`**.`],
  ['the Preview-only guarded Pharmacy private publish/readback, atomic rollback-authority and exact logical recovery foundations.', 'the Preview-only guarded Pharmacy private publish/readback, atomic rollback-authority, exact logical recovery, and server-authoritative ten-stage Admin state-machine foundations.'],
]);

await replaceExact('scripts/import/check-import-readiness-state-alignment.mjs', [
  ['alignedThroughPr: 956,', 'alignedThroughPr: 957,'],
  ["runtimeBaseline: '60c9ca8fc466605af55360237ed40861e0106c78',", `runtimeBaseline: '${baseline}',`],
  ["currentNext: 'ADMIN-STATE-MACHINE',", "currentNext: 'REAL-ADMIN-CANARY',"],
  ["'4.2': 'COMPLETE',\n  },", "'4.2': 'COMPLETE',\n    5: 'PARTIAL',\n  },"],
  ['(0|1|2\\.1|2\\.2|3\\+|4\\.1|4\\.2)', '(0|1|2\\.1|2\\.2|3\\+|4\\.1|4\\.2|5)'],
  ["'Exact rollback recovery': ['Complete', '#956'],", "'Exact rollback recovery': ['Complete', '#956'],\n    'Admin state machine': ['Complete', '#957'],"],
]);

await replaceExact('scripts/import/test-import-readiness-state-alignment.mjs', [
  ['from: \'"currentNext": "ADMIN-STATE-MACHINE"\',\n      to: \'"currentNext": "REAL-ADMIN-CANARY"\'', 'from: \'"currentNext": "REAL-ADMIN-CANARY"\',\n      to: \'"currentNext": "REGISTRY-AUTHORITY-AUDIT"\''],
  ["from: '| Exact rollback recovery | Complete | #956 | `ADMIN-STATE-MACHINE` |',\n      to: '| Exact rollback recovery | Complete | #955 | `ADMIN-STATE-MACHINE` |',\n      expectedError: 'Exact rollback recovery evidence drifted',", "from: '| Admin state machine | Complete | #957 | `REAL-ADMIN-CANARY` |',\n      to: '| Admin state machine | Complete | #956 | `REAL-ADMIN-CANARY` |',\n      expectedError: 'Admin state machine evidence drifted',"],
]);

await replaceExact('docs/import/ADMIN_STATE_MACHINE_SCOPE.md', [
  ['# P08 ADMIN-STATE-MACHINE scope contract\n\nThis branch extends the existing protected `/admin/imports/readiness` Pharmacy workflow. The final implementation must derive every visible workflow stage from bounded server readback, provide explicit readback-only refresh, stale and expiry handling, replay/fresh receipts, double-submit and multi-tab collision protection, and bounded audit history.\n\nNo automatic retry of Reservation, private mutation, or rollback is allowed. P09 real Admin canary, Production access, public/index/sitemap/route promotion, new database authority, Agent, Content, Hospital, Doctor, and Bulk remain closed.', '# P08 ADMIN-STATE-MACHINE\n\nP08 extends the existing protected `/admin/imports/readiness` Pharmacy workflow without creating a parallel authority. The ten visible stages are derived only from persisted server readback: Dry Run, Exact Review, Authorization Ready, Reservation, Reservation Verified, Private Publish, Publish Verified, Rollback, Exact Recovery Verified, and Bounded Audit History.\n\nThe UI provides explicit readback-only refresh, server revision binding for stale and multi-tab submissions, expiry countdown, stale/expired fail-closed state, client pending lock for double-submit protection, bounded fresh/replayed receipts, manual Preview-only rollback through the existing atomic authority, P07 exact-recovery comparison, and at most ten bounded audit events.\n\nEvery write remains actor/entity allowlisted, single-entity, Pharmacy-only, private/noindex/no-route/no-sitemap, and accepted only after persisted post-operation readback. Reservation, private mutation, and rollback are never retried automatically. Raw durable references, protected values, persistence identifiers, and unrestricted payloads are not serialized to the browser.\n\nP08 adds no migration, RLS policy, RPC, snapshot authority, rollback authority, or public route. P09 real Admin canary, Production access, public/index/sitemap/route promotion, Agent, Content, Hospital, Doctor, Registry, and Bulk remain closed.'],
]);

console.log(`P08 state aligned to runtime evidence baseline ${baseline}.`);
