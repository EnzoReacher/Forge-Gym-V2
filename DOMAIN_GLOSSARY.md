# FORGE V2 — Domain Glossary

Status: **Initial hypotheses. Experimental semantics may change with evidence.**

The purpose of this file is to prevent the database, API, domain, and UI from inventing different meanings for the same term.

## Account

A trusted FORGE identity used to derive ownership and authorization. External provider identity objects are adapted into this concept outside the Training Domain.

## Athlete

The training-facing profile associated with an account. Initial implementation should avoid duplicating identity data unless Training Core behavior requires it.

## Workout Template

A reusable intended structure for a workout. It is not historical truth.

Open question: the minimum template depth for the first walking skeleton.

## Workout Session

A concrete occurrence of training belonging to one account. Once started, it must preserve enough snapshot data that later template changes cannot silently rewrite history.

### Proposed initial lifecycle

`Planned → Active → Completed`

Cancellation must be explicit. `Paused` and automatic `Abandoned` states are **not accepted yet**; interruption may initially be represented by an Active session that can be resumed. Dogfood evidence will determine whether additional states are needed.

### Open semantic questions

- whether more than one Active session may exist per account
- exact cancel vs abandon meaning
- whether Completed may ever reopen
- session ownership date when crossing midnight
- template snapshot depth

These must be resolved before the corresponding capability is implemented.

## Exercise

A canonical movement identity used for history/comparison. Do not over-model equipment/variant taxonomy before previous-performance requirements prove the need.

## Exercise Occurrence

An exercise as it appears inside one Workout Session, preserving session-specific ordering and replacement semantics.

## Exercise Set

A planned/recorded effort belonging to an Exercise Occurrence.

### Proposed initial states

`Pending`, `Completed`, `Skipped`.

Correction is initially treated as an operation on a completed canonical set with audit/revision semantics to be decided before implementation; it is not automatically a permanent state value.

## Exercise Replacement

A session-scoped substitution unless an explicit separate action changes the template. Already completed historical data must not be silently relabeled as the replacement exercise.

## Previous Performance

Context from prior canonical completed training that is useful at the moment of performing a comparable exercise.

“Previous” is **not yet defined as most recent, personal best, or most comparable**. The comparison rule must be tested through real usage.

## Units

Display unit is a preference; canonical recorded meaning must not change when the preference changes. Exact storage representation is proposed in ADR-015.

## Time

Canonical event timestamps use UTC. The workout must also preserve enough IANA timezone/local-date context to reproduce the athlete's workout date. Exact semantics are proposed in ADR-015.


## WSK-001 lifecycle decision

The initial implemented Workout Session lifecycle is deliberately only `Planned -> Active -> Completed`. Interruption is represented by an `Active` session that can be retrieved and resumed. `Paused`, automatic `Abandoned`, cancellation, reopening, multiple active sessions, cross-midnight ownership, replacement, correction, skip/restore, and advanced metrics remain capability-specific questions and are not implemented merely because they may exist later.
