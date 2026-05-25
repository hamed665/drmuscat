# 54_PATIENT_ACCOUNT_FAVORITES_AND_HISTORY.md

# DrMuscat V10.3 — Patient Account, Favorites, and History

## 1. Purpose
Public browsing remains anonymous and free. Patient accounts are optional and should add convenience, not create a wall.

## 2. MVP Principle
MVP must not require login for discovery. Patient account features may be added gradually.

## 3. Patient Features
Future user account modules:
- Saved centers.
- Saved doctors.
- Recently viewed profiles.
- Offer claim history.
- Appointment request history.
- Review history.
- Family members.
- Preferred language.
- Preferred area.
- Insurance preferences.
- Notification preferences.

## 4. Tables
- `saved_entities`
- `recently_viewed_entities`
- `patient_family_members`
- `patient_preferences`
- `patient_offer_claims`
- `patient_review_history`

## 5. Privacy Rules
- Public profiles must not expose patient account data.
- Providers must not see saved/favorite status.
- Providers may see appointment request details only for their own center/doctor and only for valid operational purpose.
- Family member data is sensitive and must be minimal.

## 6. UX Rules
Soft registration nudges may appear after:
- User saves a profile.
- User claims an offer.
- User submits appointment request.
- User wants appointment history.

Do not interrupt initial discovery with login walls.

## 7. Deferred Medical Record Scope
Do not build medical records, lab result storage, prescriptions, or diagnosis history in MVP unless explicitly approved. DrMuscat is not a patient medical record system in launch scope.
