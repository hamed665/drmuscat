#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs';

const PHASE = 'SEO-D3H4-C-IMPL-A';

const required = [
  '0001_extensions.sql',
  '0002_enums.sql',
  '0003_profiles_auth.sql',
  '0004_geo.sql',
  '0005_taxonomy.sql',
  '0006_centers.sql',
  '0007_center_locations.sql',
  '0008_center_services.sql',
  '0009_center_ownership_claims.sql',
  '0010_doctors.sql',
  '0011_doctor_practice_locations.sql',
  '0012_doctor_services.sql',
  '0013_doctor_schedules.sql',
  '0014_doctor_schedule_exceptions.sql',
  '0015_appointment_slots.sql',
  '0016_patient_contacts.sql',
  '0017_appointments.sql',
  '0018_appointment_status_history.sql',
  '0019_appointment_cancellations.sql',
  '0020_reviews.sql',
  '0021_review_reports.sql',
  '0022_center_type_expansion.sql',
  '0023_media_assets.sql',
  '0024_entity_media.sql',
  '0025_subscription_plans.sql',
  '0026_center_subscriptions.sql',
  '0027_sponsored_campaigns.sql',
  '0028_legal_documents.sql',
  '0029_consent_logs.sql',
  '0030_audit_logs.sql',
  '0031_rls_auth_helpers.sql',
  '0032_rls_public_catalog_read_policies.sql',
  '0033_profiles_rls.sql',
  '0034_center_access_helpers.sql',
  '0035_center_claims_memberships_rls.sql',
  '0036_patient_contacts_profile_link.sql',
  '0037_patient_appointment_access_helpers.sql',
  '0038_patient_contacts_appointments_rls.sql',
  '0039_review_media_access_helpers.sql',
  '0040_reviews_reports_media_private_rls.sql',
  '0041_monetization_access_helpers.sql',
  '0042_monetization_sponsored_rls.sql',
  '0043_legal_consent_audit_access_helpers.sql',
  '0044_legal_consent_audit_rls.sql',
  '0045_contact_visibility_foundation.sql',
  '0046_callback_request_foundation.sql',
  '0047_provider_license_verification_foundation.sql',
  '0048_media_public_visibility_hardening.sql',
  '0049_media_public_rls_hardening.sql',
  '0050_provider_onboarding_leads.sql',
  '0051_landing_page_contents.sql',
  '0052_review_companion_tables.sql',
  '0053_provider_onboarding_lead_events.sql'
];

const dir = 'supabase/migrations';

function fail(message) {
  console.error(`ERROR: Phase ${PHASE}: ${message}`);
  process.exit(1);
}

function requireCondition(condition, message) {
  if (!condition) fail(message);
}

const requiredEnumChecks = [
  { file: '0002_enums.sql', regex: /create\s+type\s+center_type\s+as\s+enum/i, message: `Phase ${PHASE} requires create type center_type as enum in 0002_enums.sql.` },
  { file: '0009_center_ownership_claims.sql', regex: /create\s+type\s+center_member_role\s+as\s+enum/i, message: `Phase ${PHASE} requires create type center_member_role as enum in 0009_center_ownership_claims.sql.` },
  { file: '0009_center_ownership_claims.sql', regex: /create\s+type\s+center_membership_status\s+as\s+enum/i, message: `Phase ${PHASE} requires create type center_membership_status as enum in 0009_center_ownership_claims.sql.` },
  { file: '0010_doctors.sql', regex: /create\s+type\s+doctor_title\s+as\s+enum/i, message: `Phase ${PHASE} requires create type doctor_title as enum in 0010_doctors.sql.` },
  { file: '0010_doctors.sql', regex: /create\s+type\s+doctor_gender\s+as\s+enum/i, message: `Phase ${PHASE} requires create type doctor_gender as enum in 0010_doctors.sql.` }
];

const forbiddenPatterns = [
  { regex: /\bpostgis\b/i, message: `postgis is deferred and forbidden in Phase ${PHASE}.` },
  { regex: /\bgeometry\b/i, message: `geometry is forbidden in Phase ${PHASE}.` },
  { regex: /\bgeography\b/i, message: `geography is forbidden in Phase ${PHASE}.` },
  { regex: /\binsert\s+into\b/i, message: `INSERT INTO is forbidden in Phase ${PHASE}.` },
  { regex: /\bdrop\b/i, message: `DROP statements are forbidden in Phase ${PHASE}.` }
];

const forbiddenTables = [
  'center_owners',
  'provider_locations',
  'center_location_mappings',
  'providers',
  'doctor_centers',
  'doctor_memberships',
  'bookings',
  'patients',
  'payments',
  'appointment_payments',
  'payment_transactions',
  'invoices',
  'invoice_items',
  'refunds',
  'checkout_sessions',
  'payment_gateway_customers',
  'taxes',
  'coupons',
  'insurance',
  'pricing',
  'ratings',
  'lab_results',
  'prescriptions',
  'diagnoses',
  'medical_records',
  'reminders',
  'notifications',
  'behavior_events',
  'sponsored_slots',
  'review_aggregates',
  'review_summaries',
  'ai_moderation',
  'storage_buckets',
  'upload_jobs',
  'image_processing_jobs'
  ,
  'appointment_reminders',
  'provider_wallets',
  'payouts',
  'webhook_events'
];

const allowedGeoTables = ['geo_countries', 'geo_regions', 'geo_cities', 'geo_areas'];
const allowedTaxonomyTables = ['taxonomy_groups', 'service_categories', 'services', 'specialties'];
const allowedOwnershipTables = ['center_claims', 'center_memberships'];
const allowedDoctorTables = ['doctors', 'doctor_services', 'doctor_schedules', 'doctor_schedule_exceptions', 'appointment_slots'];

const rlsPolicyFiles = new Set([
  '0032_rls_public_catalog_read_policies.sql',
  '0033_profiles_rls.sql',
  '0035_center_claims_memberships_rls.sql',
  '0038_patient_contacts_appointments_rls.sql',
  '0040_reviews_reports_media_private_rls.sql',
  '0042_monetization_sponsored_rls.sql',
  '0044_legal_consent_audit_rls.sql',
  '0046_callback_request_foundation.sql',
  '0047_provider_license_verification_foundation.sql',
  '0049_media_public_rls_hardening.sql',
  '0050_provider_onboarding_leads.sql',
  '0051_landing_page_contents.sql',
  '0052_review_companion_tables.sql',
  '0053_provider_onboarding_lead_events.sql'
]);

console.error('ERROR: PLAN-A migration validator restore marker reached unexpectedly.');
console.error('This temporary branch is superseded and must not be merged.');
process.exit(1);
