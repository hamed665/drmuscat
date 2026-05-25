# 48_APPOINTMENT_AND_AVAILABILITY_ENGINE.md

# DrMuscat V10.3 — Appointment and Availability Engine

## 1. Purpose
DrMuscat must not remain only a healthcare directory. The long-term platform must support appointment demand capture, manual confirmation, provider-side scheduling, no-show management, and future live booking. This file defines the canonical appointment system that can be implemented in phases without rewriting the public SEO foundation.

## 2. Launch Principle
Do not build full live-slot booking in Phase 1 unless explicitly approved. The initial launch may use appointment requests, WhatsApp conversion, and manual provider/admin confirmation. The schema and route boundaries must still be compatible with live availability later.

## 3. Phased Appointment Scope

### Phase A — MVP Request Capture
Implement:
- Public appointment request form on center and doctor profiles.
- Preferred date, preferred time window, patient name, phone, reason, language.
- Entity target: center, doctor, service, or offer.
- Admin view for requests.
- Provider view after claim approval.
- Status pipeline.
- WhatsApp fallback link.

Do not implement:
- Real-time slot locking.
- Calendar sync.
- Online payment for appointment.
- Medical triage automation.

### Phase B — Manual Confirmation
Add:
- Provider/admin confirmation.
- Reschedule/cancel.
- Reminder queue.
- No-show marking.
- Staff notes.

### Phase C — Availability Calendar
Add:
- Doctor schedule templates.
- Branch-specific practice schedules.
- Exceptions/holidays/Ramadan hours.
- Generated slots.
- Slot locking.

### Phase D — Integrations
Add only after explicit approval:
- Google Calendar sync.
- HIS/EMR integration.
- SMS/WhatsApp reminder provider integration.
- Video consultation integration.

## 4. Canonical Statuses

`appointment_request_status`:
- `new`
- `contacted`
- `pending_provider_confirmation`
- `confirmed`
- `rescheduled`
- `cancelled_by_patient`
- `cancelled_by_provider`
- `completed`
- `no_show`
- `spam`
- `archived`

`appointment_channel`:
- `website_form`
- `whatsapp_click`
- `phone_click`
- `admin_created`
- `provider_created`
- `future_api`

`time_window`:
- `morning`
- `afternoon`
- `evening`
- `anytime`

## 5. Database Tables

Canonical future tables:
- `appointment_requests`
- `appointments`
- `appointment_status_logs`
- `appointment_reminders`
- `doctor_schedule_templates`
- `doctor_schedule_exceptions`
- `appointment_slots`
- `appointment_sources`
- `no_show_records`

For Launch MVP, only `appointment_requests`, `appointment_status_logs`, and `appointment_sources` are required.

## 6. Required Fields

### appointment_requests
- `id`
- `country_id`
- `center_id`
- `doctor_id`
- `service_id`
- `offer_id`
- `patient_user_id`
- `patient_name`
- `patient_phone_e164`
- `patient_email`
- `preferred_locale`
- `preferred_date`
- `preferred_time_window`
- `reason_text`
- `channel`
- `source_path`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `status`
- `provider_notes`
- `admin_notes`
- `assigned_to_profile_id`
- `created_at`
- `updated_at`

### appointment_status_logs
- `id`
- `appointment_request_id`
- `from_status`
- `to_status`
- `changed_by_profile_id`
- `note`
- `created_at`

## 7. Admin Requirements
Admin must be able to:
- See all appointment requests.
- Filter by status, center, doctor, area, source, date.
- Assign request to provider, staff, or admin.
- Change status with required note for cancellation/no-show/spam.
- Export appointment requests.
- See source attribution.
- View duplicate requests from the same phone.

## 8. Provider Requirements
Claimed provider must be able to:
- See only appointment requests for owned centers/doctors.
- Contact patient outside platform in MVP.
- Mark contacted/confirmed/completed/no-show.
- Add staff notes.
- Never see admin-only notes.

## 9. Public UX Rules
- Appointment request form must not ask for medical records in MVP.
- Medical emergency disclaimer must appear near the form.
- If the request is urgent, show emergency guidance text and recommend contacting emergency services directly.
- Phone number must be normalized to E.164.
- User account is optional; anonymous request is allowed.

## 10. SEO Rule
Appointment forms must not block public discovery or crawling. Center and doctor pages remain publicly accessible without login.

## 11. RLS Rules
- Anonymous users may insert appointment requests with rate limits/server validation.
- Anonymous users cannot read appointment requests.
- Authenticated patients can read their own requests if linked to `patient_user_id`.
- Providers can read requests for owned centers/doctors only.
- Admin/super_admin can read/write all.
- Status changes must be logged.

## 12. Deferred Features
Deferred until after traction:
- Real-time slot inventory.
- Payment during booking.
- Insurance eligibility check.
- Teleconsultation link generation.
- SMS/WhatsApp automation.
- Calendar sync.
