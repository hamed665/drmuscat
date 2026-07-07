import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const report = JSON.parse(
  await readFile(path.join(root, 'fixtures/import/first-batch-dry-run.fixture.json'), 'utf8'),
);

function check(value, message) {
  if (!value) throw new Error(message);
}

const requiredChecks = new Set([
  'ci_green',
  'seo_check_green',
  'readiness_audit_zero_blockers',
  'sitemap_diff_frozen',
  'representative_profile_smoke_passed',
  'blocked_route_classes_absent',
]);

check(report.schemaVersion === 'drkhaleej.import.batchDryRun.v1', 'schema version must be dry-run v1');
check(report.rehearsalId === 'first-batch-real-fixture-v1', 'rehearsal id must be stable');
check(report.decision === 'no_go', 'fixture must stay no_go while hospitals are held');

for (const item of report.checks) requiredChecks.delete(item.key);
check(requiredChecks.size === 0, `missing checks: ${[...requiredChecks].join(', ')}`);

for (const family of ['doctor', 'pharmacy', 'hospital']) {
  check(Number.isInteger(report.caps[family]), `${family} cap missing`);
  check(report.byFamily[family], `${family} summary missing`);
}

check(report.byFamily.doctor.selectedCount > 0, 'doctor rows required');
check(report.byFamily.pharmacy.selectedCount > 0, 'pharmacy rows required');
check(report.byFamily.hospital.selectedCount > 0, 'hospital rows required');
check(report.byFamily.hospital.eligibleCount === 0, 'hospital rows must not be eligible yet');
check(report.byFamily.hospital.sitemapUrlCount === 0, 'hospital rows must not enter sitemap yet');
check(
  report.byFamily.hospital.blockedCount === report.byFamily.hospital.selectedCount,
  'all fixture hospitals must be blocked during hold',
);

for (const sample of [...report.byFamily.doctor.samples, ...report.byFamily.pharmacy.samples]) {
  check(sample.passed === true, `${sample.family} sample must pass`);
  check(sample.hasLocationEvidence === true, `${sample.family} sample needs location evidence`);
  check(sample.hasSourceEvidence === true, `${sample.family} sample needs source evidence`);
  check(sample.hasContactOrMapEvidence === true, `${sample.family} sample needs contact or map evidence`);
  check(sample.hasCanonical === true, `${sample.family} sample needs canonical evidence`);
  check(sample.hasLocaleAlternates === true, `${sample.family} sample needs locale alternates`);
}

check(report.sitemap.importedDeltaCount === 0, 'fixture must not add imported sitemap URLs');
check(report.sitemap.unexpectedUrlCount === 0, 'fixture must have no unexpected sitemap URLs');
check(report.hospitalRelations.unsafePublicCount === 0, 'hospital relations must have zero unsafe public rows');
check(report.hospitalRelations.publicVisibleCount === 0, 'hospital suggestions must not be public yet');
check(report.localSuggestions.unsafePublicCount === 0, 'local suggestions must have zero unsafe public rows');

console.log('first batch real fixture check passed.');
