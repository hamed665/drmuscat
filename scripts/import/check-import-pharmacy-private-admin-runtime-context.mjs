import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contextPath = 'src/server/admin/import-pharmacy-private-admin-runtime-context.ts';
const actionPath = 'src/app/admin/imports/readiness/actions.ts';
const persistencePath = 'src/server/admin/import-private-persistence-adapter.ts';

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const context = await readText(contextPath);
const action = await readText(actionPath);
const persistence = await readText(persistencePath);

for (const token of [
  'createSupabasePharmacyPrivateAdminContextReader',
  'loadPharmacyPrivateAdminRuntimeContext',
  'environment_not_preview',
  'actor_not_allowed',
  'entity_not_allowed',
  'approval_token_invalid',
  'center_type !== "pharmacy"',
  'center.status !== "draft"',
  'center.is_active',
  'center.is_featured',
  'center: buildCenterSnapshot(center)',
  'batchSize: 1',
  'expectedSnapshotHash: snapshotHash',
  'expectedEntityFingerprint: fingerprint',
]) {
  assert(context.includes(token), `${contextPath} must include ${token}`);
}

for (const token of [
  'ImportPublishRollbackSnapshot',
  'center?: Readonly<Record<string, unknown>>',
]) {
  assert(persistence.includes(token), `${persistencePath} must include ${token}`);
}

for (const token of [
  'IMPORT_PHARMACY_PRIVATE_ADMIN_ACTION_ENABLED = false as const',
  'createPharmacyPrivateAdminRuntimeContextReaderFromEnvironment()',
  'loadPharmacyPrivateAdminRuntimeContext(',
]) {
  assert(action.includes(token), `${actionPath} must include ${token}`);
}

for (const forbidden of [
  'is_active: true',
  'is_featured: true',
  'indexPolicy: "index"',
  'sitemapPolicy: "included"',
  'visibility: "public"',
  'Promise.all(',
]) {
  assert(!context.includes(forbidden), `${contextPath} must not include ${forbidden}`);
  assert(!action.includes(forbidden), `${actionPath} must not include ${forbidden}`);
}

console.log('import pharmacy private Admin runtime context check passed.');
