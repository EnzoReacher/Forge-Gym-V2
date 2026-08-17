# ADR-005 — Authorization and ownership model

Status: **Accepted**

Date: 2026-08-17

## Context

Ownership is a non-negotiable invariant from the first persisted slice, even while other semantics remain Experimental.

## Decision

Use **server-derived account ownership** for all private Training Core records. Application services require trusted account context and repository operations are owner-scoped. Do not accept owner IDs from public mutation payloads.

## Alternatives considered

- Server-derived owner context (recommended)
- Client-supplied owner with validation
- UI-only filtering

## Benefits

Fail-closed isolation model and straightforward two-account tests.

## Costs and risks

Requires deliberate use-case/repository signatures and test fixtures.

## Portability and exit path

Independent of production auth provider. Authorization rules are FORGE concepts.

## Operational burden

Low.

## Consequences

Future roles/entitlements may extend authorization, but they do not replace object ownership checks.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.


## Isolation clarification

Foreign keys and non-null owner columns prove that a record references an owner; they do not by themselves prove tenant isolation. Every private repository operation is owner-scoped from trusted `AuthenticatedAccount` context. Two-account integration tests must prove read, modify, delete, and enumeration isolation. PostgreSQL RLS may be evaluated later as defense-in-depth, but is not claimed for WSK-001.
