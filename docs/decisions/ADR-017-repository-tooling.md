# ADR-017 — Repository and package structure

Status: **Accepted**

Date: 2026-08-17

## Decision
Use pnpm workspaces with explicit boundaries comparable to:

```text
apps/api/
apps/test-ui/
packages/training-domain/
packages/training-application/
packages/shared-contracts/
infrastructure/database/
db/migrations/
tests/
```

One repository, one modular monolith, one PostgreSQL database, and one deployable application artifact for WSK-001. No microservices, queue, cache, second database, or speculative shared framework. Kysely table types stay in infrastructure. Use a pinned pnpm release through `packageManager`; a committed lockfile is required before Foundation Gate passes.

## Approval
Accepted by the owner in the final Milestone 0 execution authorization.

## WSK-001 exact pin

pnpm `11.21.0` via Corepack and the root `packageManager` field.
