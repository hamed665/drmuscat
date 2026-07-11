import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contractPath = 'src/server/admin/import-publish-executor-infrastructure.ts';
const fixturePath = 'fixtures/import/import-publish-executor-infrastructure.fixture.json';
const docsPath = 'docs/platform/DRKHALEEJ_PUBLISH_EXECUTOR_INFRASTRUCTURE.md';
const auditPath = 'scripts/import/check-import-publish-readiness-audit.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

const source = await readText(contractPath);
const fixture = JSON.parse(await readText(fixturePath));
const docs = await readText(docsPath);
const audit = await readText(auditPath);

for (const token of [
  'ImportPublishExecutorInfrastructureBlocker',
  'ImportPublishExecutorInfrastructureInput',
  'ImportPublishExecutorInfrastructurePlan',
  'IMPORT_PUBLISH_IDEMPOTENCY_TTL_MIN_HOURS',
  'IMPORT_PUBLISH_IDEMPOTENCY_TTL_MAX_HOURS',
  'IMPORT_PUBLISH_ROLLBACK_RETENTION_MIN_DAYS',
  'IMPORT_PUBLISH_ROLLBACK_RETENTION_MAX_DAYS',
  'getImportPublishExecutorInfrastructureBlockers',
  'getImportPublishExecutorInfrastructurePlan',
  'isImportPublishExecutorInfrastructureReady',
  'mode: "infrastructure_contract_only"',
  'executionReady: false',
  'mutationEnabled: false',
  'bulkAllowed: false',
]) {
  assert(source.includes(token), `${contractPath} must include ${token}.`);
}

for (const blocker of [
  'controlled_publish_contract_not_ready',
  'audit_store_unavailable',
  'idempotency_store_unavailable',
  'rollback_store_unavailable',
  'transaction_coordinator_unavailable',
  'optimistic_lock_unavailable',
  'audit_event_schema_missing',
  'idempotency_ttl_invalid',
  'rollback_retention_invalid',
  'executor_not_enabled',
]) {
  assert(source.includes(blocker), `${contractPath} must include blocker ${blocker}.`);
}

for (const forbidden of [
  'createSupabaseServiceRoleClient',
  'insert(',
  'update(',
  'delete(',
  'rpc(',
  'publishEntity(',
  'executePublish(',
  'bulkPublish(',
  '"use server"',
]) {
  assert(!source.includes(forbidden), `${contractPath} must not include runtime mutation token ${forbidden}.`);
}

assert(
  fixture.schemaVersion === 'drkhaleej.import.publishExecutorInfrastructure.v1',
  'publish executor infrastructure fixture schema version is invalid.',
);
assert(Array.isArray(fixture.cases) && fixture.cases.length >= 4, 'fixture must include at least four cases.');

const readyCase = fixture.cases.find((testCase) => testCase.id === 'infrastructure-ready-executor-disabled');
assert(readyCase, 'fixture must include infrastructure-ready-executor-disabled.');
assert(readyCase.expected.infrastructureReady === true, 'ready case must be infrastructure-ready.');
assert(readyCase.expected.executionReady === false, 'ready case must remain execution-disabled.');
assert(readyCase.expected.mutationEnabled === false, 'mutation must remain disabled.');
assert(readyCase.expected.bulkAllowed === false, 'bulk must remain disabled.');
assert(readyCase.expected.blockers.includes('executor_not_enabled'), 'ready case must retain executor_not_enabled.');

for (const token of [
  'Audit storage',
  'Idempotency persistence',
  'Rollback snapshot storage',
  'Transaction coordinator',
  'Optimistic locking',
  'No executor implementation',
  'No database writes',
  'No bulk publish',
]) {
  assert(docs.includes(token), `${docsPath} must include ${token}.`);
}

assert(
  audit.includes("import './check-import-publish-executor-infrastructure.mjs';"),
  'publish readiness audit must chain the executor infrastructure validator.',
);

console.log('import publish executor infrastructure check passed.');
