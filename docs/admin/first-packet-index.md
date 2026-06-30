# First Packet Index

This index defines the required order for the first controlled provider activation packet.

It is an index only. It does not replace the source documents, change database state, approve activation, approve public visibility, or approve bulk rollout.

## Required packet order

Complete these records in this exact order:

1. `docs/admin/readiness-bundle.md`
2. `docs/admin/candidate-selection-worksheet.md`
3. `docs/admin/first-provider-rehearsal.md`
4. `docs/admin/soft-launch-operator-checklist.md`
5. `docs/admin/go-no-go-decision-record.md`
6. `docs/admin/first-observation-report.md`

## Order rules

The readiness bundle must be reviewed before selecting the candidate.

The candidate worksheet must be completed before rehearsal.

The first provider rehearsal must pass before the operator checklist is finalized.

The operator checklist must pass before the go / no-go decision record is signed.

The go / no-go decision record must be Go before using the final gated admin control.

The first observation report must be completed immediately after the first controlled activation.

## Packet stop conditions

Stop the packet if any source document records:

- readiness blockers
- unresolved location evidence
- unapproved taxonomy evidence
- quality blockers
- unresolved contact visibility
- unsupported public claims
- missing audit expectation
- sitemap or indexability risk
- material operator risk
- No-Go decision

Do not continue by manually editing database rows, sitemap entries, or public route output.

## Packet completion criteria

The packet is complete only when:

- all six source documents exist
- the order has been followed
- every pre-action record is pass or Go
- the final gated admin control was the only activation path used
- the observation report confirms admin, audit, and public route behavior
- no unsupported public claim was observed
- no manual database or sitemap edit was performed

## Not approved by this index

This index does not approve:

- bulk rollout
- active provider editing
- claim workflows
- billing or subscription changes
- sponsored ranking
- reviews or ratings
- open-now claims
- booking claims
- insurance claims
- manual sitemap insertion
- manual rollback

Those require separate contracts, implementation, audit behavior, and validators.
