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

const doc = await read('docs/import/TSX_DEPENDENCY_IMPLEMENTATION_PREFLIGHT.md');
const packageJson = await read('package.json');
const lockfile = await read('pnpm-lock.yaml');
const decision = await read('docs/import/FIRST_BATCH_BRIDGE_RUNTIME_PATH_DECISION.md');
const manifest = await read('fixtures/import/import-readiness-runner.manifest.json');

for (const token of [
  '# TSX Dependency Implementation Preflight',
  'package manager: `pnpm`',
  'lockfile: `pnpm-lock.yaml`',
  'selected bridge runtime path: `tsx`',
  '`dependency_status`: `pending`',
  '`runtime_path`: `tsx`',
  '`public_behavior_change`: `none`',
]) {
  requireText(doc, token, 'tsx dependency preflight doc');
}

requireText(packageJson, '"name": "drkhaleej"', 'package.json');
rejectText(packageJson, '"tsx"', 'package.json before dependency implementation');
requireText(lockfile, "lockfileVersion: '9.0'", 'pnpm lockfile');
requireText(decision, '`selected_runtime_path`: `tsx`', 'runtime path decision');
requireText(manifest, 'first batch bridge runtime path decision', 'import readiness manifest');

console.log('tsx dependency implementation preflight check passed.');
