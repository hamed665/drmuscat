import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function mustContain(source, token, label) {
  if (!source.includes(token)) throw new Error(`${label} must include ${token}`);
}

function mustNotContain(source, token, label) {
  if (source.includes(token)) throw new Error(`${label} must not include ${token}`);
}

const doc = await readText('docs/import/FIRST_BATCH_BRIDGE_RUNTIME_PATH_DECISION.md');
const tsconfig = await readText('tsconfig.json');
const packageJson = await readText('package.json');
const runtimePreflight = await readText('docs/import/first-batch-bridge-runtime-preflight.md');
const manifest = await readText('fixtures/import/import-readiness-runner.manifest.json');

for (const token of [
  '# First Batch Bridge Runtime Path Decision',
  'Use `tsx` as the TypeScript execution path',
  'This PR does not add the dependency.',
  '`compilerOptions.noEmit` is enabled',
  '`moduleResolution` is `bundler`',
  'path aliases use `@/*`',
  'add a pinned `tsx` dev dependency',
  '`selected_runtime_path`: `tsx`',
  '`implementation_status`: `pending_dependency_pr`',
  '`public_behavior_change`: `none`',
]) {
  mustContain(doc, token, 'bridge runtime path decision doc');
}

for (const token of [
  '"noEmit": true',
  '"moduleResolution": "bundler"',
  '"@/*"',
]) {
  mustContain(tsconfig, token, 'tsconfig runtime decision context');
}

mustNotContain(packageJson, '"tsx"', 'package dependency state before implementation PR');
mustContain(runtimePreflight, 'generator must stay fixture-only', 'runtime preflight docs');
mustContain(manifest, 'first batch bridge runtime preflight', 'import readiness runner manifest');

console.log('first batch bridge runtime path decision check passed.');
