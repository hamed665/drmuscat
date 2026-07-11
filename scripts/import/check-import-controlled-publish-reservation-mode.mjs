#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePath = 'src/server/admin/import-controlled-publish-reservation-mode.ts';
const fixturePath = 'fixtures/import/import-controlled-publish-reservation-mode.fixture.json';
const docsPath = 'docs/platform/DRKHALEEJ_CONTROLLED_PUBLISH_RESERVATION_MODE.md';
const auditPath = 'scripts/import/check-import-publish-readiness-audit.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

const source = await readText(sourcePath);
const fixture = JSON.parse(await readText(fixturePath));
const docs = await readText(docsPath);
const audit = await readText(auditPath);

for (const token of [
  'IMPORT_RESERVATION_ONLY_MODE_ENABLED = false as const',
  'runImportReservationOnlyMode',
  'runReservationSnapshotAuditTransaction',
  'mode: "reservation_only_disabled"',
  'reservationAttempted: false',
  'executionReady: false',
  'mutationEnabled: false',
  'terminalPersistenceAllowed: false',
  'entityMutationAllowed: false',
  'routeMutationAllowed: false',
  'sitemapMutationAllowed: false',
  'bulkAllowed: false',
  'reserve_idempotency_key',
  'capture_rollback_snapshot',
  'append_execution_started_audit',
]) {
  assert(source.includes(token), `${sourcePath} must include ${token}.`);
}

for (const blocker of [
  'orchestration_not_ready',
  'environment_not_allowed',
  'canary_entity_missing',
  'canary_entity_mismatch',
  'actor_not_allowed',
  'approval_token_missing',
  'reservation_only_mode_disabled',
]) {
  assert(source.includes(blocker), `${sourcePath} must include blocker ${blocker}.`);
}

for (const forbidden of [
  'persistTerminalResult(',
  '.from(',
  'publishEntity(',
  'executePublishMutation(',
  'bulkPublish(',
  '"use server"',
  'IMPORT_RESERVATION_ONLY_MODE_ENABLED = true',
]) {
  assert(!source.includes(forbidden), `${sourcePath} must not include ${forbidden}.`);
}

assert(
  fixture.schemaVersion === 'drkhaleej.import.controlledPublishReservationMode.v1',
  'reservation-only fixture schema version is invalid.',
);
assert(Array.isArray(fixture.cases) && fixture.cases.length >= 5, 'fixture must include at least five cases.');

const readyCase = fixture.cases.find((testCase) => testCase.id === 'canary-ready-mode-disabled');
assert(readyCase?.expected.reservationOnlyReady === true, 'fixture must include a reservation-ready case.');
assert(readyCase?.expected.reservationAttempted === false, 'disabled mode must not attempt reservation.');
assert(readyCase?.expected.executionReady === false, 'execution must remain disabled.');
assert(readyCase?.expected.mutationEnabled === false, 'mutation must remain disabled.');
assert(readyCase?.expected.entityMutationAllowed === false, 'entity mutation must remain disabled.');
assert(readyCase?.expected.bulkAllowed === false, 'bulk publish must remain disabled.');

for (const token of [
  'Hard disable',
  'Preview environment only',
  'explicitly configured canary entity',
  'No imported-entity mutation',
  'No terminal-result persistence',
  'No server action or Admin button',
  'No bulk publish',
]) {
  assert(docs.includes(token), `${docsPath} must include ${token}.`);
}

assert(
  audit.includes("import './check-import-controlled-publish-reservation-mode.mjs';"),
  'publish readiness audit must chain the reservation-only validator.',
);

console.log('import controlled publish reservation-only mode check passed.');
