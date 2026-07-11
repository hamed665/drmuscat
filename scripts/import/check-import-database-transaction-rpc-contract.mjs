import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePath = 'src/server/admin/import-database-transaction-rpc-contract.ts';
const fixturePath = 'fixtures/import/import-database-transaction-rpc-contract.fixture.json';
const docsPath = 'docs/platform/DRKHALEEJ_DATABASE_TRANSACTION_RPC_SECURITY.md';
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
  'ImportDatabaseTransactionRpcBlocker',
  'ImportDatabaseTransactionRpcSecurityInput',
  'ImportDatabaseTransactionRpcSecurityPlan',
  'getImportDatabaseTransactionRpcSecurityPlan',
  'isImportDatabaseTransactionRpcSecurityContractReady',
  'requiredSecurityMode: "invoker"',
  'requiredSearchPath: ["pg_catalog", "public"]',
  'allowedExecutorRole: "service_role"',
  'deniedExecutorRoles: ["anon", "authenticated", "public"]',
  'sqlObjects: []',
]) {
  assert(source.includes(token), `RPC contract must include ${token}.`);
}

for (const blocker of [
  'security_invoker_not_declared',
  'search_path_not_pinned',
  'public_execute_not_revoked',
  'authenticated_execute_present',
  'service_role_execute_missing',
  'single_transaction_missing',
  'idempotency_conflict_check_missing',
  'optimistic_lock_check_missing',
  'rollback_snapshot_write_missing',
  'audit_start_write_missing',
  'terminal_result_write_missing',
  'rpc_not_enabled',
]) {
  assert(source.includes(blocker), `RPC contract must include blocker ${blocker}.`);
}

for (const stage of [
  'validate_request',
  'check_idempotency_conflict',
  'check_optimistic_version',
  'reserve_idempotency_key',
  'capture_rollback_snapshot',
  'append_execution_started_audit',
  'persist_terminal_result',
]) {
  assert(source.includes(stage), `RPC contract must include ordered stage ${stage}.`);
}

for (const forbidden of [
  'createSupabaseServiceRoleClient',
  '.rpc(',
  '.from(',
  'SECURITY DEFINER',
  'GRANT EXECUTE',
  'CREATE FUNCTION',
]) {
  assert(!source.includes(forbidden), `RPC contract must not implement SQL/runtime token ${forbidden}.`);
}

assert(
  fixture.schemaVersion === 'drkhaleej.import.databaseTransactionRpcContract.v1',
  'RPC fixture schema version is invalid.',
);
assert(Array.isArray(fixture.cases) && fixture.cases.length >= 3, 'RPC fixture must include at least three cases.');

const readyCase = fixture.cases.find((testCase) => testCase.id === 'contract-ready-rpc-disabled');
assert(readyCase?.expected.contractReady === true, 'Ready case must be contract-ready.');
assert(readyCase?.expected.rpcReady === false, 'Ready case must keep RPC disabled.');
assert(readyCase?.expected.mutationEnabled === false, 'Ready case must keep mutation disabled.');
assert(readyCase?.expected.blockers.includes('rpc_not_enabled'), 'Ready case must retain rpc_not_enabled.');

for (const token of [
  'SECURITY INVOKER',
  'Pinned search path',
  'REVOKE EXECUTE FROM PUBLIC',
  'No authenticated execution',
  'Service-role only',
  'No SQL function is created in this phase',
  'No publish mutation',
]) {
  assert(docs.includes(token), `RPC security docs must include ${token}.`);
}

assert(
  audit.includes("import './check-import-database-transaction-rpc-contract.mjs';"),
  'Publish readiness audit must chain the RPC security validator.',
);

console.log('import database transaction RPC security contract check passed.');
