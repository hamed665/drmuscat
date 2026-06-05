# DrMuscat Claude Visual Reference Audit

## 1. Primary visual reference

Primary Claude visual reference directory:

`docs/prototype-reference/drmuscat-ui-kit-2026-v2/`

Primary files:

`docs/prototype-reference/drmuscat-ui-kit-2026-v2/DrMuscat Design System (2).zip`

`docs/prototype-reference/drmuscat-ui-kit-2026-v2/DrMuscat Web UI Kit (1).html`

These are the approved visual reference files for the DrMuscat 2026 public UI rebuild.

## 2. Reference role

These files are visual/design references only.

They define:

* preferred Arabic typography feeling
* preferred English typography feeling
* green/teal brand direction
* premium search-first homepage feeling
* card style
* spacing style
* calm healthcare visual tone
* modern 2026 UI feeling
* article magazine feeling
* provider profile visual direction

They do not define:

* final routes
* final backend behavior
* final auth behavior
* final payment behavior
* final database schema
* final dashboard behavior

Claude UI Kit is the visual reference. DrMuscat architecture remains the technical and product source of truth.

## 3. Secondary references

PR #153 can be used only as:

* lesson source
* screenshot/reference source
* warning source
* example of over-large PR risk
* possible idea reference

PR #153 must not be used as:

* source of truth
* merge target for the new rebuild
* base for further large patches
* final implementation reference

PR #153 is frozen/reference only. It must not be copied forward as the base for the 2026 public UI rebuild.

## 4. What to extract visually

Future PRs should extract only:

* Arabic font and typography feel
* green/teal color direction
* premium search hero
* rounded and calm forms
* modern provider cards
* article/magazine style
* premium profile style
* spacing and layout rhythm
* mobile-first polish
* trust-focused medical tone

## 5. What NOT to copy

Future PRs must NOT blindly copy:

* route patterns
* dead links
* fake data
* fake ratings
* fake reviews
* fake payment
* fake auth
* fake dashboards
* CSS chaos
* duplicated components
* broken layouts
* backend assumptions

## 6. Mandatory future instruction

Every future implementation PR starting from PR #155 must explicitly reference:

`docs/prototype-reference/drmuscat-ui-kit-2026-v2/`

as the visual source of truth.
