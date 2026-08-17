# ADR-007 — Local development environment

Status: **Accepted**

Date: 2026-08-17

## Context

The owner wants the entire project operable from ordinary IDEs and capable of self-run local development without hidden hosted state.

## Decision

Use repository-pinned Node tooling plus a **Docker Compose PostgreSQL service** as the documented default local dependency path. Support connecting to an externally managed local PostgreSQL instance through environment configuration. Provide `.env.example`, migrations, deterministic development seed data, and a safe dev identity.

## Alternatives considered

- Docker Compose default + external DB override (recommended)
- require system-installed PostgreSQL
- cloud database even for local development

## Benefits

Reproducible onboarding while preserving an escape path for developers who do not want Docker.

## Costs and risks

Docker adds one local prerequisite for the easiest path. Platform-specific shell scripts must be avoided where cross-platform Node scripts can work.

## Portability and exit path

All services use documented ports/env vars. No cloud provider required for local work.

## Operational burden

Low.

## Consequences

Clean-machine bootstrap becomes a Foundation Gate test, not just README prose.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.
