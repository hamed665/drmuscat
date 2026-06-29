import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();

function readFile(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function assertIncludes(content, token, label) {
  if (!content.includes(token)) {
    throw new Error(`${label} is missing required token: ${token}`);
  }
}

const actionPath = 'src/server/admin/draft-center-location-actions.ts';
const actionContent = readFile(actionPath);

const requiredActionTokens = [
  'export async function createDraftCenterLocationCandidate',
  'requireAdminPermission("draft_centers.update")',
  'const draftStatuses = ["draft", "pending_review"]',
  '.in("status", [...draftStatuses])',
  'is_active: false',
  'is_primary: false',
  'public_email_visible: false',
  'public_primary_phone_visible: false',
  'public_secondary_phone_visible: false',
  'public_whatsapp_phone_visible: false',
  'contact_review_status: "pending"',
  'writeAdminAuditEvent',
  'targetTable: "center_locations"',
  'revalidatePath(`/admin/draft-centers/${centerId}`)',
];

for (const token of requiredActionTokens) {
  assertIncludes(actionContent, token, actionPath);
}

const formPath = 'src/components/admin/draft-center-location-create-form.tsx';
const formContent = readFile(formPath);

const requiredFormTokens = [
  'createDraftCenterLocationCandidate',
  'Creates a private draft location candidate only.',
  'Saved locations stay inactive and private until a later review workflow.',
  'Save private location candidate',
];

for (const token of requiredFormTokens) {
  assertIncludes(formContent, token, formPath);
}

console.log('Draft location create runtime checks passed.');
