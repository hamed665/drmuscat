# 55_SUPPORT_TICKETS_AND_NOTIFICATION_TEMPLATES.md

# DrMuscat V10.3 — Support Tickets and Notification Template Manager

## 1. Purpose
Operational support and notification templates must be manageable without code changes.

## 2. Support Tickets
Tables:
- `support_tickets`
- `support_ticket_messages`
- `support_ticket_assignments`
- `support_ticket_status_logs`

Ticket categories:
- `wrong_information`
- `claim_issue`
- `payment_issue`
- `review_dispute`
- `technical_issue`
- `appointment_issue`
- `advertising_issue`
- `legal_privacy`
- `other`

Statuses:
- `new`
- `open`
- `waiting_on_user`
- `waiting_on_provider`
- `resolved`
- `closed`
- `spam`

## 3. Ticket Rules
- Anonymous users may report wrong information with rate limits.
- Providers can create and view tickets for their workspace.
- Admin can assign and resolve tickets.
- Sensitive legal/privacy tickets require restricted permissions.

## 4. Notification Templates
Create `notification_templates`.

Template fields:
- `id`
- `key`
- `channel`: `email`, `sms`, `whatsapp_future`, `in_app`, `push_future`
- `locale`
- `subject`
- `body`
- `variables_schema`
- `status`: `draft`, `active`, `archived`
- `created_at`
- `updated_at`

Required template keys:
- `claim_submitted`
- `claim_approved`
- `claim_rejected`
- `profile_edit_submitted`
- `profile_edit_approved`
- `payment_receipt_uploaded`
- `payment_approved`
- `subscription_expiring`
- `appointment_request_received`
- `appointment_confirmed_future`
- `offer_claimed`
- `review_submitted`
- `support_ticket_created`
- `support_ticket_updated`

## 5. Notification Rules
- Respect notification preferences.
- Do not ask for browser push permission on first visit.
- Frequency caps apply to promotional notifications.
- Transactional notifications may bypass promo caps where legally valid.
- Medical disclaimer must appear where relevant.

## 6. Admin Requirements
Admin must manage:
- Template content per locale.
- Active/draft status.
- Test send to internal address/number.
- Variable validation.
- Notification logs.
