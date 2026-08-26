# ADR-002 — Primary relational database

Status: **Accepted**

Date: 2026-08-17

## Context

Training data has ownership, foreign-key relationships, atomic multi-record operations, migration requirements, concurrency, and historical integrity needs. Avoid a later database-class migration merely because the first prototype was small.

## Decision

Use **PostgreSQL** as the canonical relational database from the walking skeleton onward. Pin a supported major version for development/CI and keep production on a supported release line.

## Alternatives considered

- PostgreSQL (recommended)
- SQLite first (simpler local start, but different concurrency/operational behavior and likely later migration)
- Hosted proprietary database API (fast setup, higher coupling)
- NoSQL/document store (poor fit for current relational invariants)

## Benefits

Strong relational constraints, transactions, mature tooling, broad hosting/self-host support, and predictable portability.

## Costs and risks

Requires a local database service and operational care. Major-version upgrades require planning.

## Portability and exit path

Use standard PostgreSQL and portable SQL where practical. No provider-specific database API in domain/application code. Dump/restore and migration tooling must remain provider-independent.

## Operational burden

Moderate but well understood. Local development can use Docker Compose or a user-managed PostgreSQL instance.

## Consequences

Database constraints become a second line of defense for integrity; application/domain rules remain canonical for business semantics.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.

## WSK-001 exact pin

PostgreSQL `18.4` for local/CI database images. Minor updates within PostgreSQL 18 should be reviewed as maintenance rather than silent floating tags.
