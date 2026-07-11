#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePath = 'src/server/admin/import-controlled-publish-orchestrator.ts';
const fixturePath = 'fixtures/import/import-controlled-publish-orchestrator.fixture.json';
const docsPath = 'docs/platform/DRKHALEEJ_CONTROLLED_PUBLISH_ORCHESTRATOR.md';
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
  'IMPORT_CONTROLLED_PUBLISH_EXECUTOR_ENABLED = false as const',
  'orchestrateControlledSinglePublish',
  'getImportControlledPublishDryRunPlan',
  'runReservationSnapshotAuditTransaction',
  'mode: "disabled_orchestration"',
  'reservationAttempted: false',
  'executionReady: false',
  'mutationEnabled: false',
  'terminalPersistenceAllowed: false',
  'bulkAllowed: false',
  'entityOperations: []',
]) {
  assert(source.includes(token), `${sourcePath} must include ${token}.`);
}

for (const blocker of [
  'dry_run_plan_not_ready',
  'executor_disabled',
  'reservation_expiry_missing',
  'rollback_expiry_missing',
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
  'IMPORT_CONTROLLED_PUBLISH_EXECUTOR_ENABLED = true',
]) {
  assert(!source.includes(forbidden), `${sourcePath} must not include ${forbidden}.`);
}

assert(
  fixture.schemaVersion === 'drkhaleej.import.controlledPublishOrchestrator.v1',
  'controlled publish orchestrator fixture schema version is invalid.',
);
assert(Array.isArray(fixture.cases) && fixture.cases.length >= 4, 'fixture must include at least four cases.');

const readyCase = fixture.cases.find((testCase) => testCase.id === 'ready-plan-executor-disabled');
assert(readyCase?.expected.orchestrationReady === true, 'fixture must include an orchestration-ready case.');
assert(readyCase?.expected.reservationAttempted === false, 'disabled executor must not attempt reservation.');
assert(readyCase?.expected.executionReady === false, 'disabled executor must keep execution false.');
assert(readyCase?.expected.mutationEnabled === false, 'disabled executor must keep mutation false.');
assert(readyCase?.expected.terminalPersistenceAllowed === false, 'terminal persistence must remain disabled.');
assert(readyCase?.expected.bulkAllowed === false, 'bulk publish must remain disabled.');

for (const token of [
  'Build and validate the dry-run plan',
  'Hard disable',
  'No imported-entity mutation',
  'No terminal-result persistence',
  'No server action or Admin button',
  'No bulk publish',
]) {
  assert(docs.includes(token), `${docsPath} must include ${token}.`);
}

assert(
  audit.includes("import './check-import-controlled-publish-orchestrator.mjs';"),
  'publish readiness audit must chain the controlled publish orchestrator validator.',
);

console.log('import controlled publish orchestrator check passed.');
