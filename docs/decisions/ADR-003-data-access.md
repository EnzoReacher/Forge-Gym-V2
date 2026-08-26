# ADR-003 — Data-access approach

Status: **Accepted**

Date: 2026-08-17

## Context

FORGE needs type assistance without hiding SQL, transactions, indexes, constraints, and migration behavior behind a large active-record/domain ORM.

## Decision

Use an explicit repository-port layer with **Kysely** as the recommended thin typed SQL query builder for PostgreSQL. Keep schema migrations as reviewable SQL/SQL-like migration code owned by the repository. Do not expose query-builder types outside infrastructure.

## Alternatives considered

- Kysely (recommended)
- Drizzle ORM/query builder
- Raw `pg` SQL
- Prisma-style higher-level ORM

## Benefits

SQL remains visible and predictable; infrastructure types stay close to the database; transaction boundaries can remain explicit.

## Costs and risks

Another dependency and schema typing workflow. Some complex SQL still requires database knowledge, which is considered a benefit rather than something to hide.

## Portability and exit path

Repository ports isolate Kysely. It can be replaced with raw SQL/another adapter without changing domain contracts.

## Operational burden

Low to moderate.

## Consequences

No domain entity may become a Kysely table type. Migrations and constraints receive independent review.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.

## WSK-001 exact pin

- Kysely `0.29.5`
- node-postgres (`pg`) `8.23.0`
