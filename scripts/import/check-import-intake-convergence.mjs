import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const modulePath = 'src/server/admin/import-intake-convergence.ts';
const testPath = 'src/server/admin/import-intake-convergence.test.ts';
const auditPath = 'scripts/import/check-import-publish-readiness-audit.mjs';

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const source = await readText(modulePath);
const tests = await readText(testPath);
const audit = await readText(auditPath);

for (const token of [
  'normalizeManualImport',
  'normalizeCsvImport',
  'normalizeExcelImport',
  'buildUnifiedDraftEntity',
  'getUnifiedDraftEntityBlockers',
  'directEntityWriteAllowed: false',
  'selectFirstPrivatePublishFamily',
  'family_evidence_missing',
  'family_score_tie',
  'no_family_ready',
]) {
  assert(source.includes(token), `intake convergence module must include ${token}.`);
}

for (const forbidden of [
  'createSupabaseServiceRoleClient',
  '.insert(',
  '.update(',
  '.delete(',
  '.upsert(',
  '.rpc(',
  'publishEntity',
  'sitemap',
]) {
  assert(!source.includes(forbidden), `intake convergence must not include mutation token ${forbidden}.`);
}

for (const sourceName of ['manual', 'csv', 'excel']) {
  assert(tests.includes(`toBe("${sourceName}")`), `tests must verify ${sourceName} source identity.`);
}

assert(tests.includes('toBe("pharmacy")'), 'family-selection test must document pharmacy as the current lowest-complexity canary candidate.');
assert(
  audit.includes("import './check-import-intake-convergence.mjs';"),
  'publish readiness audit must chain intake convergence validation.',
);

console.log('import intake convergence check passed.');
