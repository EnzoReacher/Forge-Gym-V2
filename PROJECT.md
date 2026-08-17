# FORGE V2 — Project Charter

## Mission

Build a training product that helps an athlete know what to do now, perform the workout with minimal friction, preserve trustworthy training records, and use prior performance at the moment it is useful.

## Product thesis

The initial hypothesis is:

> If FORGE makes the active-workout loop faster, safer, and more context-aware than notes or generic trackers, athletes will repeatedly use it during real workouts and trust it as the canonical record of their training.

This hypothesis must be tested through real usage. Architecture quality and automated tests do not prove product value.

## Governing principle

FORGE V2 is **core-first, not UI-free**.

During the Core Era, a minimal Test UI is permitted only to exercise, challenge, and validate the architecture, domain semantics, persistence, recovery, and workflow. Serious Product UI/UX work begins only after a certified Training Core baseline exists.

## Current certified scope

None. No V2 capability is certified yet.

The first intended certified scope is:

`CORE = TRAINING CORE`

## Program outcomes

The Training Core program succeeds when:

1. The active-workout workflow is repeatedly usable in real workouts.
2. Canonical workout data remains correct through edits, retries, refreshes, interruptions, and representative failure conditions.
3. Ownership and authorization are proven server-side.
4. The architecture survives real usage with materially reduced semantic churn.
5. The system is reproducible, observable, recoverable, and traceable to an immutable Git revision.
6. A scoped Training Core baseline passes the Certification Gate.

## Non-goals before Training Core certification

- Full nutrition or hydration products
- Production AI Coach
- AI-generated plans
- Billing
- Admin Control Center
- Social or collaboration features
- Marketplace functionality
- Wearables
- Native mobile
- Gamification
- Advanced analytics
- Elaborate marketing or brand presentation

## Decision filter

Before adding work, ask:

1. Does this directly help prove or protect the Training Core?
2. Is the decision needed now?
3. Can a smaller reversible decision work?
4. Does it preserve domain independence from UI and vendors?
5. Can the claim be verified with evidence?
6. Does the work expand deferred scope?

If #6 is yes, stop unless the owner explicitly changes scope.
