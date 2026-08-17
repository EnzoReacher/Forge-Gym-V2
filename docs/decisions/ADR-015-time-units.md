# ADR-015 — Time, timezone, and unit semantics

Status: **Accepted**

Date: 2026-08-17

## Context

Training history crosses timezones/midnight and athletes may switch displayed units. Floating-point or display-only semantics can silently change historical meaning.

## Decision

Store event timestamps as UTC instants and preserve the workout's **IANA timezone identifier** plus derived local workout date. Store external load in a canonical exact mass representation (recommended integer grams) and treat kg/lb as display/input preferences with explicit conversion/rounding. Preserve entered meaning when conversion occurs.

## Alternatives considered

- UTC + timezone snapshot + canonical integer mass (recommended)
- local timestamps only
- decimal kg as canonical
- store only the originally displayed unit/value

## Benefits

Deterministic ordering/date reproduction and exact unit conversion without binary floating-point drift.

## Costs and risks

Integer grams may need additional modeling for unusual movement types; not every exercise has external load.

## Portability and exit path

Uses standard UTC/IANA timezone concepts and ordinary database numeric/integer fields.

## Operational burden

Low.

## Consequences

Exercise-type-specific metrics remain deferred until validated. Do not force every exercise into a weighted-reps model.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.
