# DrKhaleej Publish Executor Infrastructure

## Purpose

This phase defines the infrastructure contracts required before a controlled single-entity publish executor can exist.

It does not implement the executor and does not write to the database.

## Required infrastructure

### Audit storage

Every attempted publish must have durable audit storage available before execution. The audit event schema version must be explicit and non-empty.

### Idempotency persistence

The idempotency key must be persisted before any future mutation begins. Repeated requests with the same key must return the original terminal result rather than apply the transition twice.

The contract accepts a retention window between 24 and 168 hours. Shorter windows risk duplicate execution; unbounded windows turn operational storage into an archaeological site.

### Rollback snapshot storage

A rollback snapshot store must preserve the previous visibility, index policy, sitemap policy, publish status, projection version, canonical route, and public-ready state.

Rollback snapshots must be retained for 30 to 365 days.

### Transaction coordinator

The future executor must use one transaction coordinator for the entity state transition, idempotency record, rollback snapshot reference, and audit result.

Partial success is not an accepted state.

### Optimistic locking

The future executor must compare the expected entity version before mutation. A version mismatch must fail closed without changing public state.

## Readiness states

`infrastructureReady` means all required infrastructure contracts are satisfied except for the deliberately disabled executor switch.

`executionReady` remains false.

`mutationEnabled` remains false.

`bulkAllowed` remains false.

## Scope

- No executor implementation.
- No database writes.
- No migration.
- No server action.
- No Admin button.
- No public route change.
- No sitemap XML behavior.
- No bulk publish.

The objective is to make failure recovery and duplicate prevention boring before the first real state transition is allowed. Boring infrastructure is underrated, mostly by people who have never restored production data at 3 a.m.
