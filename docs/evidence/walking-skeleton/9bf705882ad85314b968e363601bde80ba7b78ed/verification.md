# WSK-001 Verification Evidence

Implementation SHA under test: `9bf705882ad85314b968e363601bde80ba7b78ed`

Date: 2026-08-17
Environment: OpenAI sandbox; Linux; local Git workspace only
Maturity: Experimental

This file records only checks that were actually attempted. A code path being implemented does not count as verified behavior.

## Repository publication

Status: **BLOCKED**

- GitHub repository: `EnzoReacher/Forge-Gym-V2`
- Read access: available
- GitHub write attempt: `create_file README.md`
- Result: `403 Resource not accessible by integration`
- Remote repository remains empty.
- Local Milestone 0 baseline is preserved in Git; WSK-001 is on `task/wsk-001-walking-skeleton`.

## Environment inventory

| Item                     | Required                                                              | Available here                             | Result                                    |
| ------------------------ | --------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------- |
| Node.js                  | `24.19.0`                                                             | `22.16.0`                                  | BLOCKED for target-toolchain verification |
| pnpm                     | `11.21.0`                                                             | not installed; Corepack cannot download it | BLOCKED                                   |
| TypeScript               | `6.0.3`                                                               | global `5.8.3`                             | target typecheck BLOCKED                  |
| npm registry             | reachable                                                             | DNS `EAI_AGAIN registry.npmjs.org`         | BLOCKED                                   |
| Docker                   | required for documented local PostgreSQL bootstrap / OCI verification | missing                                    | BLOCKED                                   |
| PostgreSQL client/server | required for real migration/integration verification                  | missing                                    | BLOCKED                                   |

## Checks executed successfully

### Source hygiene

- `git diff --check` — PASS
- `node scripts/check-architecture.mjs` — PASS
- `node scripts/scan-secrets.mjs` — PASS
- `node --check scripts/migrate.mjs` — PASS
- `node --check scripts/seed.mjs` — PASS
- `node --check scripts/scan-secrets.mjs` — PASS
- `node --check scripts/check-architecture.mjs` — PASS

The architecture checker currently verifies dependency restrictions for Training Domain, Training Application, Shared Contracts, Test UI, and database infrastructure.

### Limited compile smoke

These checks used the sandbox's global TypeScript `5.8.3`, **not** the accepted target TypeScript `6.0.3`, so they are smoke evidence only:

- `tsc -p packages/training-domain/tsconfig.json` — PASS
- `tsc -p packages/shared-contracts/tsconfig.json` — PASS
- `tsc -p packages/training-application/tsconfig.json` — PASS using a temporary ignored Node type stub because the real pinned dependency cannot be downloaded

No target-toolchain typecheck is claimed.

### Pure Training Domain smoke

Executed the compiled domain transitions:

`Planned -> Active -> complete one set -> Completed`

Observed result:

```json
{ "state": "completed", "version": 3, "loadGrams": 80000, "reps": 8 }
```

Result: PASS for this narrow pure-domain smoke.

### Application-service in-memory smoke

Executed `TrainingService` against a temporary in-memory implementation of the accepted repository/UoW contracts.

Observed result:

```json
{
  "ownerIsolation": true,
  "startIdempotent": true,
  "setIdempotent": true,
  "finishIdempotent": true,
  "staleConflict": true,
  "finalVersion": 3
}
```

Result: PASS for this narrow application-boundary smoke.

This is **not** a substitute for PostgreSQL integration tests. In particular, it does not prove PostgreSQL transaction behavior, advisory-lock behavior, schema constraints, or cross-account isolation in the real adapter.

## Checks attempted but blocked

### Dependency installation / lockfile

Attempted:

- `corepack pnpm --version`
- `npm view fastify version --fetch-timeout=3000 --fetch-retries=0`

Both failed because `registry.npmjs.org` could not resolve (`EAI_AGAIN`).

Consequences:

- no `pnpm-lock.yaml` can be generated honestly in this environment
- `pnpm install --frozen-lockfile` cannot run
- pinned package availability cannot be fully verified through installation
- Prettier, ESLint, Vitest, Playwright, Fastify, Kysely, React/Vite, and target TypeScript cannot be executed locally here

### PostgreSQL verification

BLOCKED because neither Docker nor PostgreSQL binaries/services are available.

Not verified:

- clean migration `001_initial.sql`
- deterministic seed
- Kysely/PostgreSQL adapter behavior
- composite ownership foreign keys
- transaction rollback semantics
- idempotency advisory locking
- two-account PostgreSQL isolation tests
- malicious owner payload API test against the real repository
- stale-version database compare-and-set behavior
- database-unavailable readiness behavior against a real connection

### Full API / browser / build verification

BLOCKED by unavailable dependencies and PostgreSQL.

Not verified:

- Fastify API contract suite under the pinned toolchain
- production build
- Vite Test UI build
- Playwright critical flow
- refresh/resume through a running browser
- OCI Docker image build
- build-info from a built artifact
- clean-machine bootstrap

## Verification conclusion

`WSK-001` is **IMPLEMENTED LOCALLY, VERIFICATION INCOMPLETE**.

The governing stop condition "required tests cannot be executed" applies to completion/promotion of this task. No merge to local `main`, no Foundation Gate PASS, and no Stable/Certified claim is authorized from this evidence.

The next task is verification-only: `docs/tasks/WSK-001V-connected-verification.md`.
