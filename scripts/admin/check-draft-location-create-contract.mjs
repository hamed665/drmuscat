import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const targetPath = 'docs/admin/draft-location-create-contract.md';
const absolutePath = path.join(repoRoot, targetPath);

if (!fs.existsSync(absolutePath)) {
  throw new Error(`Missing required file: ${targetPath}`);
}

const content = fs.readFileSync(absolutePath, 'utf8');

const requiredTokens = [
  'Draft Location Create Contract',
  'Only draft or pending_review centers may receive location candidates.',
  'Created location candidates must default to private state.',
  'is_active: false',
  'public_primary_phone_visible: false',
  'public_whatsapp_phone_visible: false',
  'public_email_visible: false',
  'No publish, activate, verify, claim, billing, sponsor, sitemap, or public visibility side effect is allowed.',
  'Every successful create action must write an admin audit event.',
  'The create action must revalidate the draft center detail page only.',
];

for (const token of requiredTokens) {
  if (!content.includes(token)) {
    throw new Error(`${targetPath} is missing required token: ${token}`);
  }
}

console.log('Draft location create contract checks passed.');
