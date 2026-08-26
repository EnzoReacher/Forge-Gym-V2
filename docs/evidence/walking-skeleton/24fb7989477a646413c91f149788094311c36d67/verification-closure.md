# WSK-001V PostgreSQL Verification Closure Evidence

Date: 2026-08-25  
Maturity: Experimental  
Exact PR #2 recovery baseline SHA:
`24fb7989477a646413c91f149788094311c36d67`

## Immutable CI inputs

- Node.js: `24.19.0`
- pnpm: `11.21.0`
- PostgreSQL image: `postgres:18.4`
- Closure revision: the workflow prints the exact `github.sha` before checks run.

## Enforced verification

GitHub Actions fails when `TEST_DATABASE_URL` or `DATABASE_URL` is absent. It
uses `pg_isready` against the PostgreSQL service before running migration and
deterministic seed as separate fail-fast steps. The PostgreSQL test file then
produces a JSON result that is accepted only when it records exactly **5 passed,
0 skipped, and 0 failed**. A connection, readiness, migration, seed, assertion,
or test failure stops the job.

The remaining ordered checks are frozen install, secret scan, format, lint and
architecture, typecheck, the full unit/integration suite, production build,
Docker build, and Playwright E2E.

## Results available before the closure PR runs

- Earlier connected suite: **6 passed; 5 PostgreSQL tests skipped**.
- Closure PostgreSQL suite: **UNVERIFIED** (required CI result: 5 passed, 0 skipped).
- Docker build: **UNVERIFIED**.
- Playwright E2E: **UNVERIFIED**.

GitHub Actions logs are the machine-verifiable evidence for the closure commit
itself and report its exact SHA and tool/service versions. This document must not
be interpreted as a green CI result. The Foundation Gate remains **NOT PASSED**
until every required check runs green. PR #1 must remain unmerged while those
claims are unverified.
