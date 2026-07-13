import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourcePath = "src/server/admin/import-pharmacy-publish-authorization-envelope.ts";
const testPath = "src/server/admin/import-pharmacy-publish-authorization-envelope.test.ts";
const actionPath = "src/app/admin/imports/readiness/actions.ts";
const panelPath = "src/components/admin/import-pharmacy-private-admin-control-panel.tsx";

const [source, tests, action, panel] = await Promise.all([
  readFile(path.join(root, sourcePath), "utf8"),
  readFile(path.join(root, testPath), "utf8"),
  readFile(path.join(root, actionPath), "utf8"),
  readFile(path.join(root, panelPath), "utf8"),
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const token of [
  "randomBytes(32)",
  "randomBytes(24)",
  "tokenHash",
  "nonceHash",
  "reviewSnapshotHash",
  "entityFingerprint",
  "consumedAt",
  "verifyAndConsume",
  "Date.parse(record.expiresAt)",
  "record.actorId !== input.actorId",
  "record.entityId !== input.entityId",
]) assert(source.includes(token), `${sourcePath} must include ${token}`);

for (const token of [
  "issues only opaque token and nonce while storing hashes and bounded identity",
  "verifies and consumes exactly once",
  "rejects expired, mismatched actor, entity, snapshot, fingerprint, token, and nonce",
  "fails closed for malformed hashes and storage failures",
]) assert(tests.includes(token), `${testPath} must cover ${token}`);

for (const forbidden of [
  'IMPORT_PHARMACY_PRIVATE_ADMIN_ENABLED_OPERATIONS = ["dry_run", "review", "private_publish"]',
  'readOnlyEnabled: true,\n    operation: "private_publish"',
  "verifyAndConsume(",
  "createPharmacyPublishAuthorizationEnvelopeService(",
]) {
  assert(!action.includes(forbidden), `${actionPath} must not enable authorization consumption: ${forbidden}`);
  assert(!panel.includes(forbidden), `${panelPath} must not enable authorization consumption: ${forbidden}`);
}

console.log("Pharmacy publish authorization envelope check passed.");
