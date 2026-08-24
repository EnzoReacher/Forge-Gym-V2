# WSK-001V Connected Verification Evidence

Implementation/fix SHA under test: `76c73c55555da45e36a02e4623892c70d6a94ea8`

Date: 2026-08-20  
Environment: Ubuntu 24.04.4 LTS, connected OpenAI workspace  
Maturity: Experimental

This recovery began by fetching and checking out
`origin/task/wsk-001-walking-skeleton` at
`978892f66fcc9d47e9bb3ee9973ac8cb026657c3`. No patch from an earlier task was
restored or applied.

## Changes justified by executable failures

- Generated the genuine pnpm 11.21.0 lockfile from the pinned workspace graph.
- Applied Prettier after `pnpm format:check` reported 52 unformatted files.
- Added Node types to the Training Application TypeScript project after target
  TypeScript 6.0.3 could not resolve `node:crypto`.

No product capability or architecture was changed.

## Passed checks

All commands in this section were rerun with Node.js 24.19.0 and pnpm 11.21.0:

- `pnpm install --frozen-lockfile` — PASS.
- `pnpm format:check` — PASS.
- `pnpm lint` — PASS, including the architecture dependency checker.
- `pnpm typecheck` — PASS with TypeScript 6.0.3 across all workspace projects.
- `pnpm test` — PARTIAL PASS: 3 test files passed, 1 PostgreSQL integration file
  was skipped; 6 tests passed and 5 PostgreSQL tests were skipped.
- `pnpm build` — PASS for all buildable workspace projects.
- `node scripts/scan-secrets.mjs` — PASS.
- `git diff --check` — PASS.

The executed non-PostgreSQL tests include pure domain transitions, development
identity guards, non-sensitive liveness, database-down readiness returning 503,
and build-info response behavior.

## Required checks not executable

### PostgreSQL 18.4

Docker is not installed. PostgreSQL client/server is not installed. An attempt to
add the official PostgreSQL APT repository failed because the environment proxy
returned HTTP 403 for the signing-key URL. Consequently migration, seed,
PostgreSQL repository/API integration, real two-account isolation, transactional
idempotency/concurrency, and real stale-write checks were not executed.

### Playwright

`pnpm exec playwright install chromium` was attempted. All browser downloads
from `cdn.playwright.dev` failed with HTTP 403 `Domain forbidden`. The browser E2E
and refresh/resume flow were therefore not executed.

### Docker / OCI

`docker version` was attempted and failed because `docker` is not installed. No
OCI build, container start, or container build-info check is claimed.

### GitHub Actions and publication

The remote task branch was fetched successfully and used as the sole recovery
baseline. This run does not claim a remote push or GitHub Actions result. PR #1
was not merged.

## Conclusion

The lockfile and source-only target-toolchain gates are now verified. WSK-001V is
still incomplete because the required PostgreSQL, Playwright, and OCI checks
could not execute in this environment. The Foundation Gate remains not passed,
and no Stable or Certified claim is made.
