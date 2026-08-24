# FORGE V2 — Initial Risk Register

| ID    | Risk                                                              | Impact   | Current response                                                                                         |
| ----- | ----------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| R-001 | Recreating V1 implementation coupling inside V2                   | High     | Requirements may transfer; implementation is not inherited automatically. ADR review before scaffold.    |
| R-002 | Over-engineering before product evidence                          | High     | Walking skeleton + Test UI + dogfood precede certification hardening. Architecture budget applies.       |
| R-003 | Under-engineering ownership/data integrity during experimentation | Critical | Core invariants apply from first persisted slice; no UI-only ownership.                                  |
| R-004 | Test UI becomes accidental final UI and distracts from core       | Medium   | UI work must justify itself as validation infrastructure until certification.                            |
| R-005 | Domain frozen before real usage                                   | High     | Experimental maturity explicitly permits evidence-driven semantic change. Stable requires real usage.    |
| R-006 | Multiple AI agents redefine architecture independently            | High     | AGENTS.md authority + Task Packets + ADR process.                                                        |
| R-007 | Production cannot be mapped to source                             | High     | Deployment ADR requires Git SHA/build/migration identity from first deployable slice.                    |
| R-008 | Retry/interruption causes duplicate or lost workout records       | Critical | Idempotency/reconciliation ADR + required failure tests.                                                 |
| R-009 | Schema churn destroys dogfood history                             | High     | Explicit migrations even during Experimental stage when persisted evidence matters.                      |
| R-010 | Public repository accidentally receives secrets                   | Critical | `.env.example`, secret exclusion, CI secret scan from walking skeleton.                                  |
| R-011 | Stack choice creates platform lock-in                             | High     | Container/relational/provider-portability criteria in ADR review.                                        |
| R-012 | Scope expands to Coach/Fuel before Training Core proves value     | High     | PROJECT/PRODUCT_SCOPE hard non-goals; owner approval required for scope change.                          |
| R-013 | “Stable” is declared by elapsed time                              | Medium   | Stable threshold must be defined before Milestone 4 and supported by dogfood evidence.                   |
| R-014 | Certification becomes infrastructure theater                      | Medium   | Only certify systems actually required by current core; recovery system must be demonstrably restorable. |

## Current execution risks — WSK-001

| ID    | Risk                                                                                | Impact | Current response                                                                                                                                        |
| ----- | ----------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-015 | GitHub integration still returns 403 on writes to the new repository                | High   | Preserve exact local Git history; do not claim remote checkpoint exists.                                                                                |
| R-016 | Sandbox cannot resolve npm registry, so pnpm install/lockfile generation cannot run | High   | Exact versions are pinned; do not fabricate a lockfile; WSK verification remains blocked until install can run in a connected environment.              |
| R-017 | No PostgreSQL/Docker service is available in this sandbox                           | High   | Migration/integration/E2E tests are implemented but remain unverified here; CI is configured to provide PostgreSQL once remote publication is possible. |
