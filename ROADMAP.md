# FORGE V2 — Roadmap

## Milestone 0 — Project Control Plane

Status: **IN PROGRESS**

Deliver the governing documents, risk register, ADR process, task protocol, maturity model, gates, and authoritative current-state record.

Exit condition: control-plane artifacts are coherent and the architecture decisions required for the walking skeleton are reviewable.

## Milestone 1 — Architecture Foundation

Status: **PROPOSED**

Accept the minimum ADRs required for runtime, database, data access, auth boundary, authorization, API, local development, deployment, testing, retry/recovery, and time/units.

Do not accept unused future systems merely to complete an ADR list.

## Milestone 2 — Walking Skeleton

Status: **NOT STARTED**

Deliver one real end-to-end persisted slice through a minimal Test UI:

`Open → Today's workout → Start → Log one set → Persist → Refresh → Resume → Finish → View result`

Include migration, seed/dev identity, health check, basic CI, and a deployable test environment that identifies its Git SHA.

## Milestone 3 — Experimental Training Core

Status: **NOT STARTED**

Build in-scope active-workout capabilities incrementally. Domain, application, persistence, and Test UI evolve together while preserving layer boundaries.

## Milestone 4 — Dogfood and Core Iteration

Status: **NOT STARTED**

Use FORGE in real workouts. Record structured evidence. Classify findings before changing schema/domain semantics. Iterate until major semantic churn decreases.

## Milestone 5 — Stable Training Core

Status: **NOT STARTED**

Define exact evidence thresholds before requesting transition. Promote only when repeated real use supports the Stable Gate.

## Milestone 6 — Hardening and Certification

Status: **NOT STARTED**

Prove ownership isolation, authentication, authorization, transactions, idempotency, failure recovery, security controls, observability, backup/restore, CI enforcement, reproducible deployment, rollback, migrations, and build provenance.

Output an immutable scoped Training Core certification record.

## Milestone 7 — Product UI/UX

Status: **BLOCKED BY CERTIFICATION**

Build the real FORGE experience on top of the certified capability baseline. Raw Steel identity is intentionally deferred until this milestone except for validation-critical usability/accessibility.

## Milestone 8 — Controlled Product Expansion

Status: **BLOCKED**

Consider Progress, Coach, Fuel, Hydration, and other domains one validated vertical slice at a time.

## Hard ordering constraints

- No serious Product UI/UX before Training Core certification.
- Test UI is allowed during Experimental/Stable maturity only as validation infrastructure.
- No deferred product domain may silently enter Training Core scope.
- Stable requires real-workout evidence.
- Certified requires Stable first.
