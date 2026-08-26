# FORGE V2 — Test Strategy

Testing is risk-based. Percentage coverage is not a substitute for proving important claims.

## Test layers

1. **Domain unit tests** — state transitions, calculations, comparison rules.
2. **Database/repository integration tests** — schema constraints, queries, transactions, ownership.
3. **API contract tests** — validation, status/outcome semantics, identity boundary.
4. **E2E Test UI tests** — critical real-user journeys only.
5. **Failure/recovery tests** — duplicate request, timeout, lost response, interruption, concurrency.
6. **Migration tests** — clean apply, representative upgrade, restore/rollback strategy as maturity requires.
7. **Security/isolation tests** — two-account access and mutation denial.
8. **Deployment evidence** — health, build identity, migration identity, rollback before certification.

## Initial capability matrix

| Capability           | Unit | Integration | E2E |      Failure/recovery | Isolation |
| -------------------- | ---: | ----------: | --: | --------------------: | --------: |
| Start workout        |  Yes |         Yes | Yes |             duplicate |       Yes |
| Active workout       |  Yes |         Yes | Yes |         timeout/stale |       Yes |
| Complete set         |  Yes |         Yes | Yes |   lost response/retry |       Yes |
| Correct set          |  Yes |         Yes | Yes |       concurrent edit |       Yes |
| Skip/restore         |  Yes |         Yes | Yes |                 retry |       Yes |
| Replace exercise     |  Yes |         Yes | Yes |       partial failure |       Yes |
| Resume               |  Yes |         Yes | Yes |       refresh/network |       Yes |
| Finish               |  Yes |         Yes | Yes | duplicate/transaction |       Yes |
| History              |  Yes |         Yes | Yes |       incomplete data |       Yes |
| Previous performance |  Yes |         Yes | Yes |       comparison edge |       Yes |

## CI by maturity

### Milestone 0/1

Document validation/manual review; no application CI claim before application code exists.

### Walking skeleton

At minimum: install, format/lint, typecheck, unit/integration tests, build, migration apply.

### Experimental Core

Add E2E critical flow, ownership checks, idempotency/failure cases as capabilities appear.

### Stable/Certification

Add full gate evidence: migration/recovery, security, backup/restore, deployment/rollback, provenance.

## Rule

A green suite proves only what it exercised. Every important claim must map to a named test or other reviewable evidence.
