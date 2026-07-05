#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const schemaVersion = 'drkhaleej.import.batchDryRun.v1';
const families = ['doctor', 'pharmacy', 'hospital'];
const requiredChecks = [
  'ci_green',
  'seo_check_green',
  'readiness_audit_zero_blockers',
  'sitemap_diff_frozen',
  'representative_profile_smoke_passed',
  'blocked_route_classes_absent',
];

function usage() {
  return [
    'Usage:',
    '  node scripts/import/validate-first-batch-dry-run-report.mjs --input <report.json> [--expect go|no_go|any]',
    '',
    'Validates a generated first-batch dry-run report before review or merge.',
    'This validator reads a local JSON file only. It performs no database, network, route, sitemap, schema, migration, or public-rendering writes.',
  ].join('\n');
}

function parseArgs(argv) {
  const result = { expect: 'any' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }
    if (arg === '--input' || arg === '--expect') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value.`);
      result[arg.slice(2)] = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!['go', 'no_go', 'any'].includes(result.expect)) throw new Error('--expect must be go, no_go, or any.');
  return result;
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertStringOrNull(value, label) {
  assert(typeof value === 'string' || value === null, `${label} must be a string or null.`);
}

function assertNumber(value, label) {
  assert(typeof value === 'number' && Number.isFinite(value), `${label} must be a finite number.`);
}

function assertArray(value, label) {
  assert(Array.isArray(value), `${label} must be an array.`);
}

function assertRecord(value, label) {
  assert(isRecord(value), `${label} must be an object.`);
}

function assertCheck(check, index) {
  assertRecord(check, `checks[${index}]`);
  assert(typeof check.key === 'string', `checks[${index}].key must be a string.`);
  assert(typeof check.passed === 'boolean', `checks[${index}].passed must be a boolean.`);
  assertStringOrNull(check.notes, `checks[${index}].notes`);
}

function assertSitemap(sitemap) {
  assertRecord(sitemap, 'sitemap');
  for (const key of ['beforeUrlCount', 'afterUrlCount', 'importedDeltaCount', 'unexpectedUrlCount']) {
    assertNumber(sitemap[key], `sitemap.${key}`);
  }
  assertArray(sitemap.unexpectedUrls, 'sitemap.unexpectedUrls');
  sitemap.unexpectedUrls.forEach((url, index) => assert(typeof url === 'string', `sitemap.unexpectedUrls[${index}] must be a string.`));
}

function assertBlocker(blocker, label) {
  assertRecord(blocker, label);
  assert(typeof blocker.reason === 'string', `${label}.reason must be a string.`);
}

function assertFamilySummary(summary, family) {
  assertRecord(summary, `byFamily.${family}`);
  for (const key of ['selectedCount', 'eligibleCount', 'blockedCount', 'sitemapUrlCount', 'sampledUrlCount']) {
    assertNumber(summary[key], `byFamily.${family}.${key}`);
  }
  assertArray(summary.blockers, `byFamily.${family}.blockers`);
  summary.blockers.forEach((blocker, index) => assertBlocker(blocker, `byFamily.${family}.blockers[${index}]`));
  assertArray(summary.samples, `byFamily.${family}.samples`);
  summary.samples.forEach((sample, index) => {
    assertRecord(sample, `byFamily.${family}.samples[${index}]`);
    assert(typeof sample.passed === 'boolean', `byFamily.${family}.samples[${index}].passed must be a boolean.`);
  });
}

function assertRelationSummary(summary, label) {
  assertRecord(summary, label);
  const numericKeys = label === 'hospitalRelations'
    ? ['totalRows', 'candidateHospitalCount', 'publicVisibleCount', 'blockedFromPublicCount', 'privateReviewCount', 'hospitalSuggestionCount', 'unsafePublicCount']
    : ['totalRows', 'publicVisibleCount', 'blockedFromPublicCount', 'privateReviewCount', 'sourceEntitySuggestionCount', 'locationClusterCount', 'unsafePublicCount'];

  for (const key of numericKeys) assertNumber(summary[key], `${label}.${key}`);
  assertArray(summary.unsafePublicBlockers, `${label}.unsafePublicBlockers`);
  assertArray(summary.blockedFromPublicReasons, `${label}.blockedFromPublicReasons`);
  summary.unsafePublicBlockers.forEach((blocker, index) => assertBlocker(blocker, `${label}.unsafePublicBlockers[${index}]`));
  summary.blockedFromPublicReasons.forEach((blocker, index) => assertBlocker(blocker, `${label}.blockedFromPublicReasons[${index}]`));
}

function requiredChecksPassed(checks) {
  return requiredChecks.every((key) => checks.some((check) => check.key === key && check.passed === true));
}

function assertGoSafe(report) {
  assert(requiredChecksPassed(report.checks), 'go report must have every required check passed.');
  assert(report.sitemap.unexpectedUrlCount === 0, 'go report must have sitemap.unexpectedUrlCount === 0.');
  assert(report.sitemap.unexpectedUrls.length === 0, 'go report must have no unexpected sitemap URLs.');

  for (const family of families) {
    const summary = report.byFamily[family];
    const cap = report.caps[family];
    assert(summary.selectedCount <= cap, `go report ${family} selectedCount must be within cap.`);
    assert(summary.sitemapUrlCount <= cap, `go report ${family} sitemapUrlCount must be within cap.`);
    assert(summary.blockedCount === 0, `go report ${family} blockedCount must be 0.`);
    assert(summary.blockers.length === 0, `go report ${family} blockers must be empty.`);
    assert(summary.samples.every((sample) => sample.passed === true), `go report ${family} samples must all pass.`);
  }

  assert(report.hospitalRelations.unsafePublicCount === 0, 'go report hospitalRelations.unsafePublicCount must be 0.');
  assert(report.hospitalRelations.unsafePublicBlockers.length === 0, 'go report hospitalRelations.unsafePublicBlockers must be empty.');
  assert(report.localSuggestions.unsafePublicCount === 0, 'go report localSuggestions.unsafePublicCount must be 0.');
  assert(report.localSuggestions.unsafePublicBlockers.length === 0, 'go report localSuggestions.unsafePublicBlockers must be empty.');
}

function validateReport(report, expectedDecision) {
  assertRecord(report, 'report');
  assert(report.schemaVersion === schemaVersion, `report.schemaVersion must be ${schemaVersion}.`);
  assert(typeof report.rehearsalId === 'string' && report.rehearsalId.length > 0, 'report.rehearsalId must be a non-empty string.');
  assert(typeof report.generatedAt === 'string' && report.generatedAt.length > 0, 'report.generatedAt must be a non-empty string.');
  assertStringOrNull(report.commitSha, 'report.commitSha');
  assert(report.decision === 'go' || report.decision === 'no_go', 'report.decision must be go or no_go.');
  if (expectedDecision !== 'any') assert(report.decision === expectedDecision, `report.decision must be ${expectedDecision}.`);

  assertRecord(report.caps, 'caps');
  for (const family of families) assertNumber(report.caps[family], `caps.${family}`);

  assertArray(report.checks, 'checks');
  report.checks.forEach(assertCheck);
  for (const key of requiredChecks) {
    assert(report.checks.some((check) => check.key === key), `checks must include ${key}.`);
  }

  assertSitemap(report.sitemap);
  assertRecord(report.byFamily, 'byFamily');
  for (const family of families) assertFamilySummary(report.byFamily[family], family);
  assertRelationSummary(report.hospitalRelations, 'hospitalRelations');
  assertRelationSummary(report.localSuggestions, 'localSuggestions');
  assertArray(report.notes, 'notes');
  report.notes.forEach((note, index) => assert(typeof note === 'string', `notes[${index}] must be a string.`));

  if (report.decision === 'go' || expectedDecision === 'go') assertGoSafe(report);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }
  if (!args.input) throw new Error(`--input is required.\n\n${usage()}`);

  const inputPath = path.resolve(process.cwd(), args.input);
  const parsed = JSON.parse(await readFile(inputPath, 'utf8'));
  validateReport(parsed, args.expect);
  console.log(`first batch dry-run report validation passed: ${inputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
