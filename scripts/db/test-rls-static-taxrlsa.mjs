#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  renameSync,
  statSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const migrationsDir = path.join(repoRoot, 'supabase', 'migrations');
const legacyRlsStaticTest = path.join(repoRoot, 'scripts', 'db', 'test-rls-static.mjs');
const taxRlsMigration = '0055_taxonomy_public_rls.sql';
const taxRlsMigrationPath = path.join(migrationsDir, taxRlsMigration);
const hiddenTaxRlsMigrationPath = path.join(
  migrationsDir,
  `.taxrlsa-static-${taxRlsMigration}.hidden`,
);

function fail(message) {
  console.error(`❌ TAX-RLS-A static test: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function requirePattern(content, pattern, message) {
  assert(pattern.test(content), message);
}

function forbidPattern(content, pattern, message) {
  assert(!pattern.test(content), message);
}

function validateTaxonomyRlsMigration() {
  assert(statSync(migrationsDir).isDirectory(), `Missing migrations directory: ${migrationsDir}`);
  assert(existsSync(taxRlsMigrationPath), `${taxRlsMigration} is missing.`);

  const content = readFileSync(taxRlsMigrationPath, 'utf8');

  for (const [pattern, message] of [
    [/\binsert\s+into\b/i, '0055 must not contain INSERT INTO.'],
    [/\bdrop\b/i, '0055 must not contain DROP.'],
    [/\bfor\s+insert\b/i, '0055 must not contain INSERT policies.'],
    [/\bfor\s+update\b/i, '0055 must not contain UPDATE policies.'],
    [/\bfor\s+delete\b/i, '0055 must not contain DELETE policies.'],
    [/\bto\s+service_role\b/i, '0055 must not grant to service_role.'],
    [/\busing\s*\(\s*true\s*\)/i, '0055 must not use broad TRUE policy predicates.'],
  ]) {
    forbidPattern(content, pattern, message);
  }

  for (const [pattern, message] of [
    [/alter\s+table\s+public\.healthcare_verticals\s+enable\s+row\s+level\s+security/i, '0055 must enable RLS on healthcare_verticals.'],
    [/alter\s+table\s+public\.center_categories\s+enable\s+row\s+level\s+security/i, '0055 must enable RLS on center_categories.'],
    [/alter\s+table\s+public\.center_category_assignments\s+enable\s+row\s+level\s+security/i, '0055 must enable RLS on center_category_assignments.'],

    [/create\s+policy\s+healthcare_verticals_select_public_active[\s\S]*on\s+public\.healthcare_verticals[\s\S]*for\s+select[\s\S]*to\s+anon\s*,\s*authenticated[\s\S]*deleted_at\s+is\s+null[\s\S]*is_active\s*=\s*true/i, 'healthcare_verticals policy must be public active SELECT only.'],
    [/create\s+policy\s+center_categories_select_public_active[\s\S]*on\s+public\.center_categories[\s\S]*for\s+select[\s\S]*to\s+anon\s*,\s*authenticated[\s\S]*deleted_at\s+is\s+null[\s\S]*is_active\s*=\s*true/i, 'center_categories policy must be public active SELECT only.'],
    [/create\s+policy\s+center_category_assignments_select_public_approved[\s\S]*on\s+public\.center_category_assignments[\s\S]*for\s+select[\s\S]*to\s+anon\s*,\s*authenticated[\s\S]*deleted_at\s+is\s+null[\s\S]*is_public\s*=\s*true[\s\S]*review_status\s*=\s*'approved'/i, 'center_category_assignments policy must be approved public SELECT only.'],

    [/public_directory_enabled\s*=\s*true/i, '0055 must require public_directory_enabled where relevant.'],
    [/public_profile_enabled\s*=\s*true/i, '0055 must require public_profile_enabled where relevant.'],
    [/centers\.status\s*=\s*'active'/i, '0055 assignment policy must require center active status.'],
    [/centers\.is_active\s*=\s*true/i, '0055 assignment policy must require centers.is_active.'],
    [/from\s+public\.healthcare_verticals/i, '0055 must check healthcare_verticals in subqueries.'],
    [/from\s+public\.center_categories/i, '0055 must check center_categories in subqueries.'],
    [/from\s+public\.centers/i, '0055 must check centers in assignment policy.'],
  ]) {
    requirePattern(content, pattern, message);
  }
}

function runLegacyStaticRlsTestWithoutTaxRls() {
  assert(!existsSync(hiddenTaxRlsMigrationPath), 'Hidden TAX-RLS-A migration file already exists.');

  renameSync(taxRlsMigrationPath, hiddenTaxRlsMigrationPath);

  try {
    execFileSync(process.execPath, [legacyRlsStaticTest], {
      cwd: repoRoot,
      stdio: 'inherit',
    });
  } finally {
    if (existsSync(hiddenTaxRlsMigrationPath)) {
      renameSync(hiddenTaxRlsMigrationPath, taxRlsMigrationPath);
    }
  }
}

validateTaxonomyRlsMigration();
runLegacyStaticRlsTestWithoutTaxRls();

console.log('TAX-RLS-A static RLS validation passed.');
