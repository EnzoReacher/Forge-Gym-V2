# FORGE V2 — Core Invariants

These rules are stronger than UI behavior. A Test UI may help exercise them, but it cannot be the enforcement boundary.

| # | Invariant | Domain/Application enforcement | Database enforcement | Required evidence |
|---|---|---|---|---|
| 1 | Every private training record has exactly one valid owner. | Trusted `AuthenticatedAccount` context required. | Owner FK / non-null constraints prove ownership presence, not tenant isolation. | Isolation integration tests. |
| 2 | Client cannot assign/override/transfer ownership. | Canonical owner ID is absent from public mutation contracts; fake owner fields are rejected or ignored. | Writes use only trusted server-derived owner. | Malicious owner-payload test. |
| 3 | Account A cannot read, modify, delete, or enumerate B. | Every private use case and repository operation is explicitly owner-scoped; not-found behavior must not reveal another owner's record. | Owner-scoped queries; RLS is optional defense-in-depth and must never be claimed unless implemented and tested. | Two-account read/write/delete/enumeration tests. |
| 4 | A set belongs to a valid exercise occurrence in a valid session. | Aggregate/use-case guard. | Foreign keys. | Orphan-write rejection. |
| 5 | A set cannot be both Completed and Skipped. | State transition rules. | Check/representation constraint where practical. | Transition tests. |
| 6 | Retried completion/finish cannot create duplicates. | Idempotency contract. | Unique idempotency/record constraints where practical. | Duplicate/lost-response tests. |
| 7 | Multi-record operations are atomic. | Transaction boundary in application service. | Database transaction. | Failure-injection rollback test. |
| 8 | Correction must preserve historical meaning. | Explicit correction semantics. | Audit/revision data as accepted design requires. | Correction history test. |
| 9 | Workout totals derive from canonical set data. | Pure calculation rules. | No contradictory writable total source. | Recalculation tests. |
| 10 | Lost response after a successful write is reconcilable. | Idempotency + read-after-retry/reconciliation. | Durable idempotency state as required. | Lost-response test. |
| 11 | Template changes cannot rewrite completed history. | Session snapshot semantics. | Historical rows independent of mutable template identity. | Template-change regression test. |
| 12 | Deletion, retention, and export are explicit. | Deliberate use cases only. | FK/delete policy documented. | Export/deletion tests before certification. |
| 13 | Unit/time conversion cannot alter recorded meaning. | Canonical conversion utilities. | Canonical values + timezone metadata. | Round-trip tests. |
| 14 | Invalid state transitions are rejected. | Domain state machine/guards. | Constraints where useful. | Unit/integration transition tests. |

## Rule for new invariants

Every new invariant must name:

- canonical meaning
- trusted enforcement layer
- database support if applicable
- automated proof
- failure case

A comment or UI restriction alone is not enforcement.
