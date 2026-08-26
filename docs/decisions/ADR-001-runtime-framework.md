# ADR-001 — Runtime and HTTP framework

Status: **Accepted**

Date: 2026-08-17

## Context

FORGE needs a boring, widely supported runtime that works locally, in ordinary IDEs, in containers, and across hosting providers. The HTTP framework should provide routing, validation hooks, request lifecycle control, and structured logging without owning domain semantics.

## Decision

Use **TypeScript on a supported Node.js LTS line** for the backend runtime. Recommend **Fastify** as the thin HTTP adapter. Do not use a full-stack UI framework as the architectural core. Pin an exact supported LTS version when the walking skeleton is scaffolded.

## Alternatives considered

- Node.js + Fastify (recommended)
- Node.js built-in HTTP only (smaller dependency surface, more hand-rolled boundary code)
- Full-stack web framework (convenient, but risks presentation/runtime coupling)
- Another language/runtime (possible, but increases project/agent context switching without a demonstrated need)

## Benefits

TypeScript continuity, strong ecosystem, ordinary debugging, container portability, and a thin HTTP boundary. Fastify's plugin encapsulation maps cleanly to modular application composition without forcing domain coupling.

## Costs and risks

Dependency/runtime maintenance and JavaScript ecosystem supply-chain exposure. Fastify is still a framework dependency, so transport code must remain isolated.

## Portability and exit path

Domain/application code must compile without importing Fastify. Replacing Fastify should primarily affect `api`/composition code. OCI/container deployment remains possible.

## Operational burden

Low. One application process and standard Node operational model.

## Consequences

The Test UI is free to use a different presentation framework later. No server component or framework-specific data primitive may enter the Training Domain.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.

## WSK-001 exact pin

- Node.js `24.19.0` (LTS line)
- TypeScript `6.0.3`
- Fastify `5.12.0`
