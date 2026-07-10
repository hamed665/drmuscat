import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const manifestPath = 'fixtures/import/import-readiness-runner.manifest.json';

const manifest = JSON.parse(await readFile(path.join(root, manifestPath), 'utf8'));

if (manifest.schemaVersion !== 'drkhaleej.import.readinessRunnerManifest.v1') {
  throw new Error('Unsupported import readiness runner manifest schema.');
}

for (const check of manifest.checks) {
  const [script, ...scriptArgs] = check.command;

  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [script, ...scriptArgs], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 20,
    });

    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);

    console.log(`passed: ${check.label}`);
  } catch (error) {
    console.error(`failed: ${check.label}`);
    console.error(`command: node ${[script, ...scriptArgs].join(' ')}`);

    if (error.stdout) {
      console.error('\n--- stdout ---');
      console.error(error.stdout);
    }

    if (error.stderr) {
      console.error('\n--- stderr ---');
      console.error(error.stderr);
    }

    throw error;
  }
}

console.log('import readiness runner passed.');
