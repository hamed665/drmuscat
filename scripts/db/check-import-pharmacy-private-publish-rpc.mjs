#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const migrationPath = path.resolve('supabase/migrations/0070_import_pharmacy_private_publish_rpc.sql');
if (!existsSync(migrationPath)) throw new Error('0070 pharmacy private publish migration is missing.');
const source = readFileSync(migrationPath, 'utf8');

const required = [
  /IMPORT-PUBLISH-U: atomic pharmacy private publish RPC/i,
  /create\s+or\s+replace\s+function\s+public\.import_publish_pharmacy_private/i,
  /security\s+invoker/i,
  /set\s+search_path\s*=\s*pg_catalog\s*,\s*public/i,
  /from\s+public\.import_publish_idempotency_records[\s\S]*for\s+update/i,
  /from\s+public\.import_publish_rollback_snapshots[\s\S]*for\s+update/i,
  /from\s+public\.centers[\s\S]*for\s+update/i,
  /center_type\s*<>\s*'pharmacy'::public\.center_type/i,
  /updated_at::text\s*<>\s*p_expected_version/i,
  /status\s*=\s*'draft'::public\.provider_status/i,
  /is_active\s*=\s*false/i,
  /is_featured\s*=\s*false/i,
  /public\.import_publish_persist_terminal_result\s*\(/i,
  /'succeeded'[\s\S]*v_actual_version[\s\S]*v_terminal_result/i,
  /terminal_persistence_failed/i,
  /revoke\s+all\s+on\s+function[\s\S]*from\s+public\s*,\s*anon\s*,\s*authenticated/i,
  /grant\s+execute\s+on\s+function[\s\S]*to\s+service_role/i,
];
for (const pattern of required) {
  if (!pattern.test(source)) throw new Error(`0070 missing required safety pattern: ${pattern}`);
}

const forbidden = [
  /security\s+definer/i,
  /\binsert\s+into\b/i,
  /\bcreate\s+policy\b/i,
  /\benable\s+row\s+level\s+security\b/i,
  /status\s*=\s*'active'/i,
  /is_active\s*=\s*true/i,
  /sitemap\s*=\s*true/i,
  /indexable\s*['"]?\s*,?\s*true/i,
];
for (const pattern of forbidden) {
  if (pattern.test(source)) throw new Error(`0070 contains forbidden pattern: ${pattern}`);
}

console.log('pharmacy private publish RPC validation passed.');
