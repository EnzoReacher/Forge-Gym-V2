# FORGE V2 — Architecture

Status: **Foundation architecture approved for the Walking Skeleton; deferred provider choices remain deferred.**

## Architecture style

FORGE V2 starts as a **modular monolith**:

- one repository
- one backend application
- one primary relational database
- explicit module boundaries
- one deployable application artifact unless evidence later justifies separation

No microservice, queue, cache, second database, or distributed subsystem is introduced without a measured problem and ADR.

## Dependency direction

```text
Test UI / Future Product UI
        ↓
Fastify HTTP Adapter
        ↓
Application Services
       ↙          ↘
Training Domain   Repository Ports
                  ↑
        PostgreSQL / Kysely Adapter
```

Required interpretation:

- The Training Domain contains business meaning and state-transition rules.
- The Training Domain imports no Fastify, Kysely, PostgreSQL, React, Vite, provider SDK, or repository implementation.
- Application Services orchestrate use cases and transaction boundaries.
- Application Services depend on repository contracts, never concrete persistence.
- Infrastructure implements repository contracts and may depend on the Domain/application contracts.
- HTTP and UI translate inputs/outputs but do not invent business rules.
- Kysely table types are infrastructure types and must not become domain entities.

## Initial module boundaries

```text
training/
  domain/          canonical training rules and state transitions
  application/     use cases and transaction orchestration
  ports/           repository and external capability contracts
  infrastructure/  database implementations and provider adapters
  api/             transport mapping and validation

identity/
  application/     trusted FORGE account context
  ports/           identity/session boundary
  infrastructure/  dev and future production adapters

test-ui/
  presentation only; no business rules or direct database access
```

Directory names may change during accepted stack scaffolding, but dependency direction may not.

## Runtime topology

Initial target topology:

```text
Browser
  ↓ HTTPS
Single FORGE application process
  ├─ Test UI static/client assets
  ├─ HTTP API
  ├─ Application services
  └─ Domain
        ↓
Primary relational database
```

Runtime, framework, database, data access, Test UI, repository tooling, and the initial recovery/testing choices are Accepted for WSK-001. Production hosting/authentication and unused providers remain Deferred.

## Identity boundary

External identity must be translated into a small trusted FORGE account context before reaching application/domain logic.

The client cannot provide the canonical owner identifier for private training records.

## Data flow rules

1. Transport input is parsed and validated at the boundary.
2. Application services resolve the authenticated FORGE account.
3. Domain rules validate state transitions and canonical meaning.
4. Application services define transaction/idempotency boundaries.
5. Repository ports persist/retrieve canonical state.
6. Infrastructure errors are translated into explicit application outcomes.
7. Presentation renders confirmed, pending, failed, retried, or conflicted state without inventing success.

## Failure boundaries

Expected failures include network interruption, timeout, duplicate request, lost response, stale data, concurrent edits, expired identity, database errors, and deployment failure.

The architecture must make reconciliation possible and must never silently duplicate or lose canonical workout data.

## Portability constraints

- local development is first-class
- no hosted-only development state
- domain has no provider SDK dependency
- production deployment must identify Git SHA and migration version
- external vendors are adapters, not domain concepts
- deployment target must have an exit path

## Architecture budget

Every new subsystem must answer:

> What current, measured FORGE problem requires this?

If there is no current problem, defer it.

## Current unknowns

The following remain deliberately unresolved because WSK-001 does not require them:

- production identity provider
- final production hosting vendor
- production observability vendor
- AI provider
- background-job system
- object storage

They do not block the Walking Skeleton.
