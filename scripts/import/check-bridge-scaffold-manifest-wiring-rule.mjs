import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function requireText(source, token, label) {
  if (!source.includes(token)) throw new Error(`${label} missing required token: ${token}`);
}

function rejectText(source, token, label) {
  if (source.includes(token)) throw new Error(`${label} includes blocked token: ${token}`);
}

const rule = await read('docs/import/BRIDGE_SCAFFOLD_MANIFEST_WIRING_RULE.md');
const manifest = await read('fixtures/import/import-readiness-runner.manifest.json');
const packageJson = await read('package.json');

for (const token of [
  '# Bridge Scaffold Manifest Wiring Rule',
  'must be wired into the import-readiness manifest before the executable bridge smoke is wired',
  'scripts/import/check-first-batch-bridge-smoke-scaffold.mjs',
  'Only after `tsx` and the generated lockfile are added',
]) {
  requireText(rule, token, 'bridge scaffold manifest wiring rule');
}

rejectText(packageJson, '"tsx"', 'package json before runtime dependency');
rejectText(manifest, 'smoke-first-batch-dry-run-bridge.ts', 'manifest before runtime dependency');

console.log('bridge scaffold manifest wiring rule check passed.');
