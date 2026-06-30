# Candidate Selection Worksheet

Use this worksheet to record the first provider candidate before running the first controlled activation rehearsal.

This worksheet is a manual evidence record. It does not change database state, publish anything, revalidate routes, or approve activation by itself.

## Candidate identity

- Center id:
- Slug:
- English name:
- Arabic name:
- Center type:
- Current workflow status:
- Current verification status:
- Current `is_active` value:
- Current `is_claimable` value:

## Location evidence

- Active location count:
- Primary location id:
- Primary location name:
- City or wilayat:
- Area or neighborhood:
- Map or directions status:
- Location review notes:

The candidate should not proceed if no active location exists or if the location data cannot be explained clearly.

## Taxonomy evidence

- Primary taxonomy id:
- Primary taxonomy label:
- Taxonomy review status:
- Secondary taxonomy notes:

The candidate should not proceed unless the primary taxonomy exists and the taxonomy review status is approved.

## Quality evidence

- Quality blocker count:
- Missing English name:
- Missing Arabic name:
- Missing description:
- Unsupported public claim found:
- Quality review notes:

The candidate should not proceed if blocker count is greater than zero.

## Contact review evidence

- Primary phone saved:
- Primary phone public flag:
- WhatsApp phone saved:
- WhatsApp phone public flag:
- Email saved:
- Email public flag:
- Contact review status:
- Contact review notes:

Do not make contact visibility changes after activation during the first controlled rollout.

## Public copy evidence

Confirm the candidate does not claim:

- best or top provider
- rating or review score
- open-now availability
- booking availability
- insurance acceptance
- unsupported MOH approval
- guaranteed provider availability
- sponsored ranking
- medical advice, diagnosis, or emergency guidance

Public copy notes:

## Expected route outcome before activation

- English public route expected result:
- Arabic public route expected result:
- Public listing expected result:
- Public search expected result:

Before activation, the provider should not be visible publicly.

## Expected route outcome after activation

- English public route expected path:
- Arabic public route expected path:
- Public listing expected behavior:
- Public search expected behavior:
- Contact action expected behavior:
- Safe fallback expected behavior:

Public route loading must depend on the public eligibility wrapper.

## Expected admin outcome after activation

- Draft list expected behavior:
- Active centers expected behavior:
- Audit log expected action:
- Audit entity id:
- Audit public paths:
- Audit sitemap evidence:

Expected audit action: `draft_center.public_profile_activated`

## Operator decision

- Candidate selected by:
- Review date:
- Ready for rehearsal: yes / no
- Ready for final gated control later: yes / no
- Reason if no:

The operator must complete the first provider rehearsal and soft launch operator checklist before using the final gated control.
