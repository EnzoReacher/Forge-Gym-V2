# ADR-006 — API architecture

Status: **Accepted**

Date: 2026-08-17

## Context

The Test UI and future Product UI need a simple debuggable contract. A browser-friendly HTTP boundary is sufficient for the initial modular monolith.

## Decision

Use a versionable **HTTP JSON API** with resource/use-case endpoints, explicit input schemas, stable error/outcome codes, and idempotency keys for retry-sensitive mutations. Keep transport DTOs separate from domain objects.

## Alternatives considered

- REST-like HTTP/JSON (recommended)
- GraphQL
- RPC framework
- server actions tied to a presentation framework

## Benefits

Easy to inspect, test, replay, and consume from future web/mobile clients; avoids UI-framework coupling.

## Costs and risks

Requires disciplined contract design and explicit mapping code.

## Portability and exit path

Standard HTTP contracts can move across hosts and clients.

## Operational burden

Low.

## Consequences

API versioning is introduced only when compatibility requires it; do not pre-build multiple versions.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.
