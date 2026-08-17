# FORGE V2 — Current State

Last updated: 2026-08-17

## Repository

Target remote: `EnzoReacher/Forge-Gym-V2`

Local working repository: `/mnt/data/forge-gym-v2`

## Current milestone

**Milestone 2 — Walking Skeleton**

Implementation exists locally. Required connected verification is blocked by the current execution environment.

## Current maturity

**Experimental**

The Training Core is **not Stable** and **not Certified**.

## Remote GitHub state

- Repository exists and remains empty (`size: 0` on the latest read).
- GitHub read access works.
- GitHub write access still fails with `403 Resource not accessible by integration`.
- The latest bootstrap `create_file` attempt failed; no partial remote write is claimed.

## Local Git baselines

### Project Control Plane

- Root Milestone 0 commit: `ada4d22407ade1e0d580999799115633f669aa85`
- Local annotated checkpoint tag: `v2.0-project-control`
- Local `main` state-recording commit: `7610ccdb62a9d3bafd1ed0e26cd41618918b7fc9`

### Walking Skeleton

- Task branch: `task/wsk-001-walking-skeleton`
- WSK-001 implementation commit: `9bf705882ad85314b968e363601bde80ba7b78ed`
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

Verified:

- `git diff --check` — PASS
- architecture dependency checker — PASS
- tracked/untracked source secret scan — PASS
- migration/seed/checker script JavaScript syntax — PASS
- limited global-TypeScript smoke compile of Training Domain, Shared Contracts, and Training Application — PASS, but this used TypeScript `5.8.3`, not the accepted `6.0.3`
- pure Training Domain transition smoke — PASS
- application-service in-memory smoke for owner isolation, idempotent start/set/finish, and stale conflict — PASS

Full evidence: `docs/evidence/walking-skeleton/9bf705882ad85314b968e363601bde80ba7b78ed/verification.md`

## Verification blocked in the current environment

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
