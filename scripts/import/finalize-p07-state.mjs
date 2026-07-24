#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';

const baseline = '60c9ca8fc466605af55360237ed40861e0106c78';

async function edit(path, replacements) {
  let source = await readFile(path, 'utf8');
  for (const [from, to] of replacements) {
    if (!source.includes(from)) {
      throw new Error(`${path}: expected finalization token is missing: ${from.slice(0, 120)}`);
    }
    source = source.replace(from, to);
  }
  await writeFile(path, source);
}

await edit('docs/import/import-readiness-roadmap-after-933.md', [
  ['Wave 4.2   OPEN      Exact logical recovery verification remains next', 'Wave 4.2   COMPLETE  (#956) Exact logical recovery and bounded hash-only mismatch diagnostics proven'],
  ['Aligned through: PR #955', 'Aligned through: PR #956'],
  ['Baseline commit: e32d3e8', 'Baseline commit: 60c9ca8'],
  ['"alignedThroughPr": 955', '"alignedThroughPr": 956'],
  ['"runtimeBaseline": "e32d3e8789df5fb2cb744723cc5acd8e59d4827d"', `"runtimeBaseline": "${baseline}"`],
  ['"currentNext": "ROLLBACK-EXACT-RECOVERY"', '"currentNext": "ADMIN-STATE-MACHINE"'],
  ['"4.2": "OPEN"', '"4.2": "COMPLETE"'],
  ['## Wave 4 — Existing rollback path `PARTIAL`', '## Wave 4 — Existing rollback path `COMPLETE`'],
  [
    '### 4.2 Exact recovery `OPEN`\n\nCompare original logical state with post-rollback state. Bounded fields, publication state, locale, country, path, projection, metadata, relations included by snapshot contract, deletion and sort state must match.\n\nOnly append-only audit/history timestamps, updated version metadata, rollback metadata, and consumed authority states may differ.',
    '### 4.2 Exact recovery `COMPLETE (#956)`\n\nP07 adds one server-only logical comparator to the existing rollback canary/readback path. It canonicalizes the protected original snapshot and persisted post-rollback state, including bounded Pharmacy fields, bilingual locale/country, canonical route identity, geo/projection and protected metadata, deletion/sort state, private publication flags and the current exact empty relation snapshot contract.\n\nOnly append-only audit/history state, monotonic entity-version metadata, rollback metadata and consumed authority state are allowlisted differences. Aggregate hashes mask only those explicit paths. Any other mismatch fails closed with a bounded normalized field path and SHA-256 expected/actual hashes; raw protected values and identifiers are not emitted.\n\nThe exact-SHA isolated Preview proof produced equal expected/actual logical hashes, mismatch count zero, verified a deliberate protected nested mismatch using hash-only diagnostics, preserved private/noindex/no-route/no-sitemap state, reported zero public exposure, completed deterministic cleanup and kept Production disconnected.'
  ],
  ['```text\nROLLBACK-EXACT-RECOVERY\n```', '```text\nADMIN-STATE-MACHINE\n```'],
  [
    'P06 completed atomic server-selected rollback authority consumption and bounded replay using the existing Pharmacy rollback path. The next implementation is P07 exact logical recovery verification. Rollback UI/state-machine activation, public/index/sitemap/route promotion and Production execution remain disabled.\n\nAfter `ROLLBACK-EXACT-RECOVERY` is green:\n\n```text\nADMIN-STATE-MACHINE\n→ REAL-ADMIN-CANARY\n```',
    'P07 completed exact logical Pharmacy recovery verification with bounded path-and-hash-only mismatch diagnostics on the existing rollback path. The next implementation is P08 Admin state-machine wiring. Public/index/sitemap/route promotion, real P09 Admin canary execution and Production execution remain disabled.\n\nAfter `ADMIN-STATE-MACHINE` is green:\n\n```text\nREAL-ADMIN-CANARY\n```'
  ],
]);

await edit('docs/project-state/CURRENT_STATE.md', [
  ['aligned through PR #955 at baseline commit `e32d3e8789df5fb2cb744723cc5acd8e59d4827d`', `aligned through PR #956 at baseline commit \`${baseline}\``],
  ['| Aligned through | PR #955 |', '| Aligned through | PR #956 |'],
  ['| Runtime baseline | `e32d3e8789df5fb2cb744723cc5acd8e59d4827d` |', `| Runtime baseline | \`${baseline}\` |`],
  ['| Current next | `ROLLBACK-EXACT-RECOVERY` |', '| Current next | `ADMIN-STATE-MACHINE` |'],
  ['| 4.2 | OPEN | Exact logical recovery verification remains next |', '| 4.2 | COMPLETE | PR #956; exact logical recovery and bounded hash-only mismatch diagnostics proven |'],
  [
    'Exact logical recovery remains open. Pharmacy public/index/sitemap promotion remains disabled.',
    'P07 proves equal original/post-rollback logical hashes across bounded fields, locale/country, canonical route, geo/projection and protected metadata, deletion/sort state, private publication flags and the current exact empty relation snapshot contract. Unexpected differences fail closed with bounded field paths and hashes only. Pharmacy public/index/sitemap promotion remains disabled.'
  ],
  ['runs the isolated P05 private publish/readback regression and runs the exact-SHA P06 atomic rollback authority proof.', 'runs the isolated P05 private publish/readback regression, the exact-SHA P06 atomic rollback authority proof and the P07 exact logical recovery proof.'],
  ['PRs #936–#955 are the current import-readiness runtime baseline.', 'PRs #936–#956 are the current import-readiness runtime baseline.'],
  ['Preview Migration Sync, the isolated P05 regression proof and the P06 concurrent rollback authority proof pass with Production disconnected.', 'Preview Migration Sync, the isolated P05 regression proof, P06 concurrent rollback authority proof and P07 exact logical recovery proof pass with Production disconnected.'],
]);

await edit('docs/project-state/V10_4_PHASE_ALIGNMENT_MATRIX.md', [
  ['aligned through PR #955 at baseline `e32d3e8789df5fb2cb744723cc5acd8e59d4827d`', `aligned through PR #956 at baseline \`${baseline}\``],
  ['The current next implementation is `ROLLBACK-EXACT-RECOVERY`.', 'The current next implementation is `ADMIN-STATE-MACHINE`.'],
  ['exact recovery and UI activation remain gated.', 'exact logical recovery is proven; UI activation remains gated.'],
  ['| Aligned through | PR #955 |', '| Aligned through | PR #956 |'],
  ['| Runtime baseline | `e32d3e8789df5fb2cb744723cc5acd8e59d4827d` |', `| Runtime baseline | \`${baseline}\` |`],
  ['| Current next | `ROLLBACK-EXACT-RECOVERY` |', '| Current next | `ADMIN-STATE-MACHINE` |'],
  ['| Durable rollback authority | Complete | #955 | `ROLLBACK-EXACT-RECOVERY` |', '| Durable rollback authority | Complete | #955 | Maintain atomic rollback regression |'],
  ['| Exact rollback recovery | Open | — | Wave 4.2 |', '| Exact rollback recovery | Complete | #956 | `ADMIN-STATE-MACHINE` |'],
]);

await edit('README.md', [
  ['aligned through **PR #955** at baseline **`e32d3e8789df5fb2cb744723cc5acd8e59d4827d`**', `aligned through **PR #956** at baseline **\`${baseline}\`**`],
  ['Current import-readiness implementation: **`ROLLBACK-EXACT-RECOVERY`**.', 'Current import-readiness implementation: **`ADMIN-STATE-MACHINE`**.'],
  ['P06 hardens the existing Preview Pharmacy rollback authority with server-selected actor/entity/version/snapshot binding, atomic consume-or-abort, bounded replay and no raw-reference browser custody. Exact recovery, rollback UI/state-machine activation, public/index/sitemap/route promotion and Production execution remain disabled.', 'P07 proves exact logical Pharmacy recovery using the existing rollback authority, equal canonical hashes and bounded path-and-hash-only mismatch diagnostics. Rollback UI/state-machine activation, public/index/sitemap/route promotion and Production execution remain disabled.'],
]);

await edit('AGENTS.md', [
  ['Current import-readiness runtime baseline: **PR #955 at `e32d3e8789df5fb2cb744723cc5acd8e59d4827d`**. The current next implementation is **`ROLLBACK-EXACT-RECOVERY`**.', `Current import-readiness runtime baseline: **PR #956 at \`${baseline}\`**. The current next implementation is **\`ADMIN-STATE-MACHINE\`**.`],
  ['Preview-only guarded Pharmacy private publish/readback and atomic rollback-authority foundations.', 'Preview-only guarded Pharmacy private publish/readback, atomic rollback-authority and exact logical recovery foundations.'],
]);

await edit('scripts/import/check-import-readiness-state-alignment.mjs', [
  ['alignedThroughPr: 955,', 'alignedThroughPr: 956,'],
  ["runtimeBaseline: 'e32d3e8789df5fb2cb744723cc5acd8e59d4827d',", `runtimeBaseline: '${baseline}',`],
  ["currentNext: 'ROLLBACK-EXACT-RECOVERY',", "currentNext: 'ADMIN-STATE-MACHINE',"],
  ["'4.2': 'OPEN',", "'4.2': 'COMPLETE',"],
  ["'Exact rollback recovery': ['Open', '—'],", "'Exact rollback recovery': ['Complete', '#956'],"],
]);

await edit('scripts/import/test-import-readiness-state-alignment.mjs', [
  ['from: \'"currentNext": "ROLLBACK-EXACT-RECOVERY"\',\n      to: \'"currentNext": "ADMIN-STATE-MACHINE"\',', 'from: \'"currentNext": "ADMIN-STATE-MACHINE"\',\n      to: \'"currentNext": "REAL-ADMIN-CANARY"\','],
  ["from: '| Durable rollback authority | Complete | #955 | `ROLLBACK-EXACT-RECOVERY` |',\n      to: '| Durable rollback authority | Complete | #954 | `ROLLBACK-EXACT-RECOVERY` |',\n      expectedError: 'Durable rollback authority evidence drifted',", "from: '| Exact rollback recovery | Complete | #956 | `ADMIN-STATE-MACHINE` |',\n      to: '| Exact rollback recovery | Complete | #955 | `ADMIN-STATE-MACHINE` |',\n      expectedError: 'Exact rollback recovery evidence drifted',"],
]);

console.log('P07 state finalization applied.');
