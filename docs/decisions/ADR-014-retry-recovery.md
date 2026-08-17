# ADR-014 — Offline, retry, and recovery policy

Status: **Accepted**

Date: 2026-08-17

## Context

Gym connectivity is unreliable, but a full offline sync system would add large conflict/state complexity before evidence requires it.

## Decision

Use **online-first canonical server state**. Retry-sensitive mutations receive client-generated idempotency keys. Use bounded timeouts/retries and explicit reconciliation after ambiguous outcomes. Do not implement a general offline-first synchronization engine unless dogfood evidence demonstrates need.

## Alternatives considered

- Online-first + idempotency/reconciliation (recommended)
- Full offline-first local-first sync
- No retry support

## Benefits

Protects against common duplicate/lost-response failures with controlled complexity.

## Costs and risks

Requires idempotency persistence/expiry policy and explicit pending/failed/conflict UI states.

## Portability and exit path

Protocol is application-level and independent of hosting vendor.

## Operational burden

Moderate; limited to mutations that need it.

## Consequences

Network failure may delay confirmation, but must never silently duplicate or lose canonical workout data.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.


## WSK-001 idempotency contract

Retry-sensitive mutations use the namespace `authenticated account + operation + idempotency key`. For `startWorkout`, `completeSet`, and `finishWorkout`, an equivalent retry returns the original canonical result; a materially different payload is an explicit conflict; accounts cannot collide with or discover each other's records; canonical mutation and successful idempotency result commit in one transaction; failed transactions leave no false-success record; and lost responses are reconcilable by retrying the same request.

Mutable active Workout Sessions use optimistic concurrency with a monotonically increasing integer `version`. Relevant mutations submit `expectedVersion`; success increments the version; stale versions return an explicit conflict and never overwrite newer state. No real-time collaboration or generic sync engine is introduced.
