import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

async function main() {
  const contract = await readText('docs/import/first-batch-write-path-contract.md');
  const workflow = await readText('.github/workflows/import-runner-checks.yml');
  const operatorGuide = await readText('docs/import/first-real-batch-operator-guide.md');

  for (const token of [
    '# First-batch import write-path contract',
    'documentation only',
    'No implementation PR for the import write path may be opened until',
    'validate-first-batch-dry-run-report.mjs --input ./tmp/first-batch.dry-run-report.json --expect go',
    'The first implementation may only support a draft or staging import.',
    'public profile publication',
    'sitemap URL promotion',
    'schema markup generation',
    'route generation',
    'network fetches during import execution',
    'first-batch:{family}:{candidate_key}',
    'rerunning the same approved input must not duplicate entities',
    'validate all rows before any write',
    'Every processed row must produce an internal audit entry.',
    'public profile visible: false',
    'sitemap eligible: false',
    'schema eligible: false',
    'search/listing eligible: false',
    'index eligible: false',
    'The implementation PR must define rollback before it defines writes.',
    'A write-path implementation may merge only when',
  ]) {
    assert(contract.includes(token), `write-path contract must include ${token}`);
  }

  assert(!workflow.includes('run-first-batch-write.mjs'), 'Import Runner Checks workflow must not run a write path before implementation is approved.');
  assert(operatorGuide.includes('The import write path must be a later PR with its own contract.'), 'operator guide must keep write path blocked behind its own contract.');

  console.log('first batch write path contract check passed.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
