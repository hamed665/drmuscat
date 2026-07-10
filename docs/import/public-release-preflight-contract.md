import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const root = process.cwd();
const manifestPath =
  process.env.IMPORT_READINESS_MANIFEST_PATH ??
  'fixtures/import/import-readiness-runner.manifest.json';

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertCommand(command, label) {
  if (!Array.isArray(command) || command.length === 0) {
    throw new Error(`${label} command must be a non-empty array.`);
  }

  for (const [index, part] of command.entries()) {
    assertString(part, `${label} command[${index}]`);
  }
}

function normalizeCommand(command) {
  const [first, ...rest] = command;

  if (
    first === 'node' ||
    first === process.execPath ||
    first.endsWith('/node') ||
    first.endsWith('\\node.exe')
  ) {
    return rest;
  }

  return command;
}

function formatCommand(command) {
  return ['node', ...command].join(' ');
}

function formatOutputBlock(label, value) {
  if (!value || String(value).trim() === '') return '';

  return [
    '',
    `--- ${label} ---`,
    String(value).trimEnd(),
    `--- end ${label} ---`,
  ].join('\n');
}

async function runCheck(check, index) {
  const label = check.label ?? `check #${index + 1}`;

  assertString(label, `manifest.checks[${index}].label`);
  assertCommand(check.command, label);

  const command = normalizeCommand(check.command);

  if (command.length === 0) {
    throw new Error(`${label} command must include a script path.`);
  }

  const [script, ...scriptArgs] = command;
  const commandText = formatCommand(command);

  console.log(`running: ${label}`);
  console.log(`command: ${commandText}`);

  try {
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [script, ...scriptArgs],
      {
        cwd: root,
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 20,
      },
    );

    if (stdout?.trim()) {
      console.log(stdout.trimEnd());
    }

    if (stderr?.trim()) {
      console.error(stderr.trimEnd());
    }

    console.log(`passed: ${label}`);
  } catch (error) {
    const stdout =
      typeof error.stdout === 'string' ? error.stdout : '';
    const stderr =
      typeof error.stderr === 'string' ? error.stderr : '';
    const exitCode =
      typeof error.code === 'number' || typeof error.code === 'string'
        ? error.code
        : 'unknown';
    const signal = error.signal ?? 'none';

    throw new Error(
      [
        'import readiness runner failed.',
        `check: ${label}`,
        `command: ${commandText}`,
        `exitCode: ${exitCode}`,
        `signal: ${signal}`,
        formatOutputBlock('stdout', stdout),
        formatOutputBlock('stderr', stderr),
        error.message ? `error: ${error.message}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }
}

async function main() {
  const manifestAbsolutePath = path.join(root, manifestPath);
  const manifest = JSON.parse(
    await readFile(manifestAbsolutePath, 'utf8'),
  );

  if (
    manifest.schemaVersion !==
    'drkhaleej.import.readinessRunnerManifest.v1'
  ) {
    throw new Error('Unsupported import readiness runner manifest schema.');
  }

  if (!Array.isArray(manifest.checks)) {
    throw new Error('Import readiness runner manifest checks must be an array.');
  }

  for (const [index, check] of manifest.checks.entries()) {
    await runCheck(check, index);
  }

  console.log('import readiness runner passed.');
}

main().catch((error) => {
  console.error(error?.message ?? error);
  process.exitCode = 1;
});
