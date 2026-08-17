# WSK-001V — Connected Verification and Walking-Skeleton Closure

Status: **AUTHORIZED / NOT STARTED**

## Task ID

`WSK-001V`

## Goal

Verify the existing WSK-001 implementation in an environment that has the accepted Node/pnpm toolchain, npm-registry access, PostgreSQL 18.4, browser support, Docker, and GitHub publication access. Fix only defects that prevent an existing WSK-001 acceptance criterion from passing.

## Why this task exists

WSK-001 has been implemented locally, but the current sandbox cannot execute the required dependency, PostgreSQL, browser, OCI, and remote-Git verification. The task must not be declared done based on source inspection or partial smoke tests.

## Current maturity state

Experimental.

## Allowed scope

- publish the preserved local Git history to `EnzoReacher/Forge-Gym-V2` when write access exists
- generate and commit the genuine `pnpm-lock.yaml` from the pinned dependency graph
- install the accepted exact toolchain/dependencies
- run/fix formatting, lint, target TypeScript typecheck, unit tests, integration tests, API contract tests, and Playwright flow
- run/fix clean PostgreSQL migration and deterministic seed
- verify database-unavailable readiness behavior
- verify idempotency, concurrent duplicate handling, stale-version conflict, fake-owner rejection, and two-account isolation using real PostgreSQL
- build and run the OCI image
- verify build/Git/migration identity emitted by the built artifact
- update evidence, WSK-001 status, ROADMAP, CURRENT_STATE, and risk register to actual results
- configure/protect `main` only after the remote baseline exists and required checks are available

## Forbidden scope

- new Training Core capabilities
- corrections, skip/restore, replacement, advanced previous performance
- Product UI/UX or Raw Steel polish
- Fuel, Hydration, Coach, billing, admin, social, mobile
- production auth provider
- observability vendor
- background jobs or object storage
- architectural redesign unless an accepted ADR is disproven by executable evidence

## Architecture constraints

All WSK-001 architecture boundaries and accepted ADRs remain in force. Fixes must preserve:

- UI -> HTTP -> Application -> Domain / Repository Ports
- PostgreSQL/Kysely adapter implements repository ports
- trusted `AuthenticatedAccount` ownership only
- no public canonical owner ID in mutation contracts
- owner-scoped private repository operations
- idempotency namespace = account + operation + key
- same transaction for canonical mutation and idempotency result
- numeric optimistic session version / explicit stale conflict
- development identity hard-disabled outside development

## Acceptance criteria

- [ ] GitHub V2 repository contains the preserved project-control baseline and WSK task branch history.
- [ ] Target Node `24.19.0` and pnpm `11.21.0` are used.
- [ ] Real `pnpm-lock.yaml` is generated and frozen install succeeds.
- [ ] Formatting check passes.
- [ ] ESLint + architecture check pass.
- [ ] TypeScript `6.0.3` full workspace typecheck passes.
- [ ] Domain unit tests pass.
- [ ] Clean PostgreSQL 18.4 migration passes from an empty database.
- [ ] Deterministic seed passes and is repeatable.
- [ ] PostgreSQL repository/API integration tests pass.
- [ ] Account A cannot read, modify, delete, or enumerate Account B within implemented WSK capabilities.
- [ ] Fake canonical owner payload is rejected/ignored without redirecting ownership.
- [ ] `startWorkout`, `completeSet`, and `finishWorkout` pass same-key idempotency and changed-payload conflict tests.
- [ ] Concurrent duplicate start requests do not create duplicate canonical effects.
- [ ] Stale session version returns conflict without overwriting canonical state.
- [ ] Database-unavailable readiness returns not-ready while liveness remains non-sensitive.
- [ ] Production workspace build passes.
- [ ] OCI image builds and starts.
- [ ] `/build-info` from built artifact reports actual version/Git SHA/build ID/build timestamp/environment/migration version.
- [ ] Playwright phone-sized critical flow passes: open -> start -> complete -> refresh -> resume -> finish -> result.
- [ ] No forbidden scope entered during fixes.
- [ ] Evidence is archived under the verified implementation/build SHA.

## Required tests

Exactly the verification categories listed in the governing authorization: dependency installation, formatting/linting, typecheck, domain tests, PostgreSQL integration, API contracts, ownership/isolation, malicious owner payload, idempotency, concurrency, stale-version conflict, migration/seed, production build, Playwright, refresh/resume, DB-down readiness, OCI/build-info.

## Failure cases

Any failed required check must remain visible in evidence. Fix only within WSK scope, then rerun the affected check and its dependent checks.

## Files likely affected

- `pnpm-lock.yaml`
- WSK implementation files only when executable verification exposes a defect
- `.github/workflows/verify.yml` if CI execution exposes a configuration defect
- `docs/evidence/walking-skeleton/...`
- `CURRENT_STATE.md`
- `ROADMAP.md`
- `RISK_REGISTER.md`
- `docs/tasks/WSK-001-walking-skeleton.md`

## Documentation updates

Record exact commands, environment versions, test counts/results, migration result, OCI artifact/build identity, remote commit SHA, and any residual limitations.

## Evidence to record

`docs/evidence/walking-skeleton/<verified-git-sha>/`

## Definition of done

All WSK-001 acceptance criteria and required tests have executable evidence in the connected environment. Only then may WSK-001 be merged to `main` and the Foundation Gate be evaluated. Passing WSK-001 does not make the Training Core Stable or Certified.
