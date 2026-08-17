# ADR-013 — Testing tools and execution

Status: **Accepted**

Date: 2026-08-17

## Context

The project needs fast domain feedback plus real browser and database evidence. Tooling should be familiar, local, and CI-friendly.

## Decision

Recommend **Vitest** for TypeScript unit/integration suites and **Playwright** for critical browser E2E once the Test UI exists. Database integration tests run against real disposable PostgreSQL, not an in-memory substitute with different semantics.

## Alternatives considered

- Vitest + Playwright (recommended)
- Node built-in test runner + Playwright
- Jest + Playwright

## Benefits

Good TypeScript/Vite ecosystem fit, watch mode, straightforward CI, real browser coverage.

## Costs and risks

Additional dev dependencies; browser E2E has higher runtime cost and must stay focused.

## Portability and exit path

Tests are repository-owned and host-independent.

## Operational burden

Low to moderate.

## Consequences

E2E is reserved for critical user journeys, not used to replace lower-level tests.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.

## WSK-001 exact pins

- Vitest `4.1.10`
- Playwright `1.62.1`
