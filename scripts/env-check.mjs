import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envExamplePath = resolve(process.cwd(), '.env.example');
const requiredKeys = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SITE_NAME',
  'NEXT_PUBLIC_DEFAULT_LOCALE',
  'NEXT_PUBLIC_SUPPORTED_LOCALES',
  'NEXT_PUBLIC_DEFAULT_COUNTRY',
  'NEXT_PUBLIC_ALLOWED_PUBLIC_LOCALES',
  'NEXT_PUBLIC_ALLOWED_PUBLIC_COUNTRIES',
  'NEXT_PUBLIC_ENABLE_INDEXING',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

if (!existsSync(envExamplePath)) {
  console.error('Missing .env.example file.');
  process.exit(1);
}

const content = readFileSync(envExamplePath, 'utf8');
let failed = false;

for (const key of requiredKeys) {
  const hasKey = new RegExp(`^${key}=`, 'm').test(content);
  if (hasKey) {
    console.log(`PASS: ${key} is present in .env.example`);
  } else {
    console.error(`FAIL: ${key} is missing in .env.example`);
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('.env.example Phase 1 contract validation passed.');
}
