import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const targetPath = 'docs/admin/draft-location-review-contract.md';
const absolutePath = path.join(repoRoot, targetPath);

if (!fs.existsSync(absolutePath)) {
  throw new Error(`Missing required file: ${targetPath}`);
}

const content = fs.readFileSync(absolutePath, 'utf8');

const requiredTokens = [
  'Draft Location Review Contract',
  'Create, edit, and selection flows must remain private candidate flows.',
  'the center exists and is still in a draft review state',
  'the location belongs to that center',
  'required geography is present: country, governorate or region, and city or wilayat',
  'contact fields remain internal unless a later contact visibility workflow approves them',
  'must keep public contact visibility disabled by default',
  'must not publish provider pages, verify the center, claim the center, change billing, change sponsorship, expose contact fields, update sitemap eligibility, or revalidate public routes',
  'Every successful review action must write an admin audit event.',
  'The review action must revalidate the draft center detail page only.',
  'rounded premium surfaces',
  'soft cyan and slate accents',
  'calm amber warning blocks',
  'dark primary CTA with cyan hover treatment',
  'pill badges with uppercase tracking',
];

for (const token of requiredTokens) {
  if (!content.includes(token)) {
    throw new Error(`${targetPath} is missing required token: ${token}`);
  }
}

console.log('Draft location review contract checks passed.');
