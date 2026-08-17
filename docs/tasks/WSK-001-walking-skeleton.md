# WSK-001 — First Persisted Training Walking Skeleton

Status: **IMPLEMENTED LOCALLY — REQUIRED ENVIRONMENT VERIFICATION BLOCKED**


## Execution note — 2026-08-17

The WSK-001 code path has been implemented on the local task branch. No acceptance checkbox is considered passed merely because code exists. Full dependency installation, PostgreSQL migration/integration tests, Playwright E2E, OCI build, and clean-machine verification remain blocked in the current sandbox because npm registry/Docker/PostgreSQL are unavailable. Remote publication is separately blocked by GitHub integration write access.

## Goal

Implement the smallest end-to-end Training Core slice that proves local reproducibility, trusted ownership, real PostgreSQL persistence, refresh/resume behavior, API/domain boundaries, and a minimal mobile-usable Test UI.

## Why this task exists

The project must prove the whole pipe before broadening domain scope or investing in Product UI/UX.

## Current maturity state

Experimental.

## Preconditions

ADR-001 through ADR-008, ADR-013 through ADR-017 are Accepted for WSK-001. ADR-009 through ADR-012 remain Deferred.

## Allowed scope

- application scaffold required by accepted ADRs
- one development account/identity adapter
- minimal `WorkoutSession`, `ExerciseOccurrence`, and `ExerciseSet` semantics required for the slice
- PostgreSQL schema/migration for those concepts
- repository interfaces + PostgreSQL implementation
- application services/API for start, active read, complete one set, finish
- one plain Test UI route/screen
- health/readiness and build identity
- deterministic development seed containing one today's workout
- basic CI required to install, typecheck/lint, migrate, test, and build
- `.env.example` and clean local bootstrap instructions

## Forbidden scope

- final design system/Raw Steel polish
- Fuel/Hydration/Coach
- billing/admin/social/mobile
- automatic training-plan generation
- exercise replacement, corrections, skip/restore, sophisticated previous performance beyond what the one-set slice needs
- offline-first synchronization engine
- production auth provider integration
- observability vendor integration
- speculative generic abstractions

## Architecture constraints

- UI has no database access and no business rules
- domain imports no Fastify/Kysely/PostgreSQL/provider SDK
- owner comes from trusted authenticated account context
- mutation contracts do not accept canonical owner ID
- migration is reviewable and repeatable
- `startWorkout`, `completeSet`, and `finishWorkout` use idempotency keyed by authenticated account + operation + idempotency key; same key/different material payload is an explicit conflict
- mutable Workout Session state uses an explicit monotonically increasing version; stale writes return conflict instead of overwriting
- deployed/test artifact can report Git SHA/build/migration identity

## Acceptance criteria

- [ ] Fresh documented checkout can start required local dependencies.
- [ ] Database migration creates the minimal canonical schema.
- [ ] Development seed creates one account and one planned today's workout without production-only shortcuts.
- [ ] Test UI shows the seeded workout.
- [ ] User can start it.
- [ ] User can complete one set with valid load/reps.
- [ ] Canonical record is persisted under the trusted account.
- [ ] Browser refresh reloads the same active workout and completed set.
- [ ] User can finish the workout.
- [ ] Completed result can be retrieved and displayed.
- [ ] `startWorkout`, `completeSet`, and `finishWorkout` are idempotent for same account + operation + key + equivalent payload.
- [ ] Reusing a key for a materially different payload returns an explicit conflict.
- [ ] Idempotency result and canonical mutation commit in one transaction.
- [ ] A stale expected Workout Session version returns an explicit conflict and preserves newer canonical state.
- [ ] A client-supplied fake owner field cannot redirect a write.
- [ ] `/health` reports non-sensitive application liveness and `/ready` reports database/migration readiness.
- [ ] build-info endpoint or equivalent exposes version/Git SHA/build/migration metadata.
- [ ] no Product UI polish beyond usable Test UI basics is introduced.

## Required tests

- [ ] domain state-transition unit test
- [ ] repository integration test against real PostgreSQL
- [ ] owner-isolation/malicious owner payload integration test
- [ ] start/complete/read/finish API contract tests
- [ ] idempotency tests for startWorkout, completeSet, and finishWorkout, including same-key/different-payload conflict
- [ ] stale-version optimistic-concurrency conflict test
- [ ] critical browser E2E: open → start → log → refresh → resume → finish → result
- [ ] clean migration from empty database
- [ ] build/typecheck/lint

## Failure cases

- invalid load/reps
- duplicate complete request
- lost/ambiguous response simulated at application boundary where practical
- database unavailable for health/readiness
- wrong/nonexistent session owner
- refresh after successful set persistence

## Files likely affected

To be determined by accepted ADR scaffold. Expected categories:
- package/toolchain config
- `src/training/...`
- `src/identity/...`
- `src/api/...`
- `src/test-ui/...`
- `db/migrations/...`
- tests
- `.env.example`
- CI workflow
- README/CURRENT_STATE

## Documentation updates

- DOMAIN_GLOSSARY.md with semantics actually implemented
- CORE_INVARIANTS.md enforcement/test mapping
- ARCHITECTURE.md concrete runtime topology
- CURRENT_STATE.md
- accepted ADRs with exact versions/choices

## Evidence to record

`docs/evidence/walking-skeleton/<git-sha>/`

Include:
- clean bootstrap commands/result
- migration result
- test command/result
- E2E result
- build identity sample
- known limitations

## Definition of done

All acceptance criteria and required tests are actually verified. No forbidden scope is added. Evidence is reviewable. `CURRENT_STATE.md` identifies the resulting SHA and Foundation Gate status.
