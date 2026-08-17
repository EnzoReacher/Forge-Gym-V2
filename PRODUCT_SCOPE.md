# FORGE V2 — Training Core Scope

## User problem

During a real gym session, athletes need to know what they planned to do, record what actually happened quickly, recover from interruptions, and see relevant previous performance without losing trust in their history.

## In-scope capabilities

- Minimal athlete/account representation
- Minimum training-plan/workout-template depth required by the active-workout loop
- Workout sessions
- Exercise occurrences and justified variants
- Exercise sets
- Start workout
- Get active workout
- Complete set
- Edit/correct set
- Skip and restore set
- Replace exercise during a session
- Resume interrupted workout
- Finish workout
- Explicit cancel/abandon semantics
- Exercise history
- Previous performance
- Canonical persistence
- Trusted ownership enforcement
- Retry and duplicate protection
- Common failure recovery
- Minimal history/progress output required to validate recorded data

## Out of scope until Training Core certification

Nutrition, hydration as a full product, AI-generated programming, production AI Coach, billing, admin, social, collaboration, marketplace, wearables, uploads without a validated need, advanced analytics, gamification, native mobile, polished marketing, and elaborate visual presentation.

## First validation slice

The walking skeleton must prove:

`Test UI → API/Application → Domain → Repository Port → Real Database → Reload/Resume`

with a real persisted workout and one logged set.

## Product evidence

Important evidence includes:

- time to start a workout
- typical interactions/time to log one set
- unnecessary interactions
- corrections
- interrupted/resumed workouts
- missing/duplicate records
- failed finishes
- workout completion
- reuse of previous performance
- major domain changes per dogfood cycle

## Scope-change rule

A new capability is not authorized merely because the architecture could support it. Scope changes require explicit owner approval and a ROADMAP/PROJECT update.
