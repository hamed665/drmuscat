import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const requiredGitignoreTokens = [
  'data/import/private/',
  'tmp/first-batch*.json',
  'tmp/first-batch*.csv',
  '.tmp/import-first-batch-*',
];

const requiredDocTokens = [
  './data/import/private/first-batch.csv',
  './tmp/first-batch.dry-run-input.json',
  './tmp/first-batch.dry-run-report.json',
  'A real import write path must not be built until a reviewed dry-run report returns `decision: go`.',
];

const forbiddenTrackedPathPrefixes = [
  'data/import/private/',
  'tmp/first-batch',
];

const forbiddenTrackedPathSuffixes = [
  '.dry-run-report.json',
  '.dry-run-input.json',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

async function pathExists(relativePath) {
  try {
    await stat(path.join(root, relativePath));
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw error;
  }
}

async function listWorkspaceFiles(relativeDirectory) {
  if (!(await pathExists(relativeDirectory))) return [];
  const absoluteDirectory = path.join(root, relativeDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listWorkspaceFiles(relativePath)));
      continue;
    }
    files.push(relativePath);
  }

  return files;
}

async function main() {
  const gitignore = await readText('.gitignore');
  const workspaceReadme = await readText('data/import/README.md');
  const operatorGuide = await readText('docs/import/first-real-batch-operator-guide.md');
  const workflow = await readText('.github/workflows/import-runner-checks.yml');

  for (const token of requiredGitignoreTokens) {
    assert(gitignore.includes(token), `.gitignore must include ${token}`);
  }

  for (const token of requiredDocTokens) {
    assert(workspaceReadme.includes(token) || operatorGuide.includes(token), `first-batch private data docs must include ${token}`);
  }

  assert(workflow.includes('node scripts/import/check-first-batch-private-data-guard.mjs'), 'Import Runner Checks workflow must run the private data guard.');

  const workspaceFiles = [
    ...(await listWorkspaceFiles('data/import')),
    ...(await listWorkspaceFiles('tmp')),
  ];

  for (const filePath of workspaceFiles) {
    if (filePath === 'data/import/README.md') continue;
    const blockedByPrefix = forbiddenTrackedPathPrefixes.some((prefix) => filePath.startsWith(prefix));
    const blockedBySuffix = forbiddenTrackedPathSuffixes.some((suffix) => filePath.endsWith(suffix));
    assert(!blockedByPrefix && !blockedBySuffix, `Real first-batch data or generated dry-run output must not be committed: ${filePath}`);
  }

  console.log('first batch private data guard passed.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
