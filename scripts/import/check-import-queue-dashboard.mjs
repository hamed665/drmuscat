import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dashboardPath = 'src/server/admin/import-queue-dashboard.ts';
const readinessPath = 'src/server/admin/import-readiness-engine.ts';

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(source, token, message) {
  assert(source.includes(token), message);
}

function assertNotIncludes(source, token, message) {
  assert(!source.includes(token), message);
}

const dashboardSource = await readText(dashboardPath);
const readinessSource = await readText(readinessPath);

for (const token of [
  'export type ImportQueueBatchStatus',
  '"uploaded"',
  '"parsed"',
  '"validated"',
  '"blocked"',
  '"ready_for_review"',
  '"published"',
  '"archived"',
  'export type ImportQueueRowStatus',
  '"imported"',
  '"validation_failed"',
  '"needs_review"',
  '"ready_for_publish"',
  'export type ImportQueuePriority',
  'export type ImportQueueDashboardBatch',
  'batch_id: string',
  'source_filename: string | null',
  'uploaded_at: string | null',
  'total_rows: number',
  'blocked_rows: number',
  'ready_rows: number',
  'published_rows: number',
  'export type ImportQueueDashboardRow',
  'row_id: string',
  'entity_id: string | null',
  'entity_name: string | null',
  'entity_type: ImportEntityType | null',
  'entity_domain: ImportEntityDomain | null',
  'readiness: ImportEntityReadiness | null',
  'blockers: readonly string[]',
  'export type ImportQueueDashboardFilter',
  'ready_only?: boolean',
  'blocked_only?: boolean',
  'export type ImportQueueDashboardSummary',
  'totalBatches: number',
  'totalRows: number',
  'importedRows: number',
  'blockedRows: number',
  'readyRows: number',
  'publishedRows: number',
  'criticalRows: number',
  'highPriorityRows: number',
  'export type ImportQueueDashboardExportRow',
  'suggested_fix: string',
  'export function buildImportQueueDashboardSummary',
  'export function filterImportQueueDashboardRows',
  'export function buildImportQueueDashboardExportRows',
  'export function isImportQueueRowReady',
  'export function isImportQueueRowBlocked',
  'suggestedFixForQueueRow',
]) {
  assertIncludes(dashboardSource, token, `${dashboardPath} must include ${token}`);
}

for (const forbiddenToken of [
  'createSupabaseServiceRoleClient',
  '.insert(',
  '.update(',
  '.delete(',
  'publishEntity(',
  'publishImport',
  'runImport(',
  'executeImport(',
  'visibility: "public"',
  'index_policy: "index"',
  'sitemap_policy: "included"',
]) {
  assertNotIncludes(dashboardSource, forbiddenToken, `${dashboardPath} must not include mutation/execution shortcut ${forbiddenToken}.`);
}

for (const token of ['ImportEntityReadiness', 'nextAction', 'publishReady']) {
  assertIncludes(readinessSource, token, `${readinessPath} must include readiness token ${token}`);
}

console.log('import queue dashboard check passed.');
