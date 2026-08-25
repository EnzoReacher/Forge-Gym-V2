# FORGE V2 — Current State

Last updated: 2026-08-25

## Repository

Target remote: `EnzoReacher/Forge-Gym-V2`

Local recovery repository: `/workspace/Forge-Gym-V2`

## Current milestone

**Milestone 2 — Walking Skeleton**

Implementation and the PR #2 recovery merge exist on
`task/wsk-001-walking-skeleton`. This WSK-001 verification-closure change makes
the remaining PostgreSQL evidence mandatory and machine-verifiable in GitHub
Actions. PR #1 remains a draft targeting `main` and is not authorized to merge.

## Current maturity

**Experimental**

The Training Core is **not Stable** and **not Certified**.

## Remote GitHub state

- PR #2 recovery is merged into `task/wsk-001-walking-skeleton`.
- PR #1 remains draft and targets `main`; it has not been merged.
- The verification-closure PR must target `task/wsk-001-walking-skeleton`.

## Local Git baselines

### Project Control Plane

- Root Milestone 0 commit: `ada4d22407ade1e0d580999799115633f669aa85`
- Local annotated checkpoint tag: `v2.0-project-control`
- Local `main` state-recording commit: `7610ccdb62a9d3bafd1ed0e26cd41618918b7fc9`

### Walking Skeleton

- Task branch: `task/wsk-001-walking-skeleton`
- WSK-001 implementation commit: `9bf705882ad85314b968e363601bde80ba7b78ed`
- PR #2 recovery merge commit used as the closure baseline:
  `24fb7989477a646413c91f149788094311c36d67`
- Merge to `main`: **NOT AUTHORIZED YET** because required verification is incomplete.

These identifiers are verified in the local Git repository only; they are not remote GitHub commits until publication succeeds.

## Milestone 0 result

**COMPLETE LOCALLY / REMOTE PUBLICATION BLOCKED**

The control plane includes the governing documents, scope, architecture, glossary, invariants, maturity model, dogfood protocol, test strategy, risk register, ADR process, Task Packet process, gates, ADR-001 through ADR-017, and WSK-001.

Accepted for the Walking Skeleton:

- TypeScript
- Node.js `24.19.0`
- Fastify
- PostgreSQL `18.4`
- Kysely
- React + Vite Test UI
- pnpm workspaces
- Vitest
- Playwright
- OCI container artifact
- provider-neutral `AuthenticatedAccount`
- strictly gated development identity
- online-first canonical state with idempotency/reconciliation
- explicit optimistic session versioning
- UTC timestamps + IANA timezone semantics

Deferred:

- production authentication provider
- production hosting vendor
- observability vendor
- AI provider
- background jobs
- object storage

## WSK-001 implementation present

The local task branch contains:

- pnpm monorepo/workspace structure
- pure Training Domain with only `Planned -> Active -> Completed`
- application-service and repository-port boundary
- Kysely/PostgreSQL adapter
- real SQL migration `db/migrations/001_initial.sql`
- deterministic development seed
- guarded development identity requiring both `NODE_ENV=development` and `ALLOW_DEV_IDENTITY=true`
- Fastify API for today/active/read/start/complete-set/finish
- account-scoped repository access and fake-owner payload rejection
- transaction-scoped idempotency keyed by account + operation + key
- optimistic workout-session version conflicts
- plain mobile-usable React/Vite Test UI
- liveness/readiness/build-info endpoints
- source verification CI definition
- OCI Dockerfile
- domain/API/integration/E2E test sources

No Product UI/UX, Raw Steel design work, Coach, Fuel, Hydration, billing, admin, social, production auth, observability vendor, background-job system, or object storage was added.

## Verification performed in the current environment

### WSK-001V PostgreSQL closure — 2026-08-25

The closure workflow is pinned to Node.js `24.19.0`, pnpm `11.21.0`, and
`postgres:18.4`, and reports the exact GitHub `github.sha` in its logs. It now
requires `TEST_DATABASE_URL`, waits with `pg_isready`, migrates, seeds, and then
asserts the PostgreSQL integration result is exactly **5 passed, 0 skipped**.
The full runner sequence also includes frozen install, secret scan, formatting,
lint/architecture, typecheck, the complete test suite, production build, Docker
build, and Playwright E2E.

At authoring time GitHub Actions has not yet run this change. Therefore the
closure-run PostgreSQL total, Docker result, and E2E result are all **UNVERIFIED**;
the last executed connected test total remains **6 passed and 5 PostgreSQL tests
skipped**. The exact baseline SHA is
`24fb7989477a646413c91f149788094311c36d67`; the closure commit SHA will be the
immutable `github.sha` printed by CI. Evidence is recorded in
`docs/evidence/walking-skeleton/24fb7989477a646413c91f149788094311c36d67/verification-closure.md`.

### WSK-001V recovery — 2026-08-20

Recovery started from remote `origin/task/wsk-001-walking-skeleton` at
`978892f66fcc9d47e9bb3ee9973ac8cb026657c3` as the sole source of truth.

Verified with exact Node.js `24.19.0`, pnpm `11.21.0`, and TypeScript `6.0.3`:

- genuine `pnpm-lock.yaml` generation and frozen install — PASS
- formatting — PASS after failure-driven formatting
- ESLint and architecture dependency check — PASS
- full workspace typecheck — PASS after adding the missing Node type context
- non-PostgreSQL tests — PASS (6 tests); PostgreSQL suite skipped (5 tests)
- production workspace build — PASS

Full evidence:
`docs/evidence/walking-skeleton/76c73c55555da45e36a02e4623892c70d6a94ea8/verification.md`

Still not executed: PostgreSQL 18.4 migration/seed/integration checks,
Playwright E2E, Docker/OCI build and runtime, GitHub Actions, and remote push.
The Foundation Gate remains **NOT YET PASSED**.

### Earlier disconnected verification — 2026-08-17

Verified:

- `git diff --check` — PASS
- architecture dependency checker — PASS
- tracked/untracked source secret scan — PASS
- migration/seed/checker script JavaScript syntax — PASS
- limited global-TypeScript smoke compile of Training Domain, Shared Contracts, and Training Application — PASS, but this used TypeScript `5.8.3`, not the accepted `6.0.3`
- pure Training Domain transition smoke — PASS
- application-service in-memory smoke for owner isolation, idempotent start/set/finish, and stale conflict — PASS

Full evidence: `docs/evidence/walking-skeleton/9bf705882ad85314b968e363601bde80ba7b78ed/verification.md`

## Verification blocked in the earlier 2026-08-17 environment

- target Node `24.19.0` is unavailable; sandbox Node is `22.16.0`
- pnpm `11.21.0` cannot be downloaded because `registry.npmjs.org` fails DNS with `EAI_AGAIN`
- no genuine `pnpm-lock.yaml` can be generated here
- Docker is unavailable
- PostgreSQL client/server is unavailable
- target TypeScript `6.0.3` and installed dependencies cannot be executed
- real migration/seed/integration/API-contract tests cannot run
- Playwright cannot run
- OCI build cannot run
- clean-machine bootstrap cannot be verified
- remote branch/PR/CI/protection cannot be established while GitHub writes return 403

The governing stop condition **required tests cannot be executed** therefore applies to WSK-001 completion and merge. It does not invalidate the safe local implementation work already completed.

## Foundation Gate

**NOT YET PASSED**

The walking-skeleton implementation exists, but executable evidence for real PostgreSQL persistence, target-toolchain build/test, browser refresh/resume, OCI build, and remote CI is still missing.

## Active risks

See `RISK_REGISTER.md`, especially R-015 through R-017.

## Next authorized task

`docs/tasks/WSK-001V-connected-verification.md`

This task is verification/fix-only. It may install the approved toolchain, publish preserved Git history when access exists, generate the real lockfile, run PostgreSQL/browser/OCI/CI verification, and fix defects revealed by those checks. It may not add new product capabilities.
