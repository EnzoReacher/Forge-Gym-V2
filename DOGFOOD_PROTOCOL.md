# FORGE V2 — Dogfood Protocol

Real workout usage is required to promote Training Core maturity.

## Purpose

Dogfood evidence should reveal whether the model and workflow are correct, not reward activity volume.

## Per-workout evidence

Record in `docs/evidence/dogfood/`:

```text
Workout ID:
Date/local timezone:
Device/browser:
App/build version:
Git SHA:
Workout flow completed:
Interrupted/resumed:
Offline/degraded network:
Sets corrected:
Sets skipped/restored:
Exercises replaced:
Friction:
Unexpected behavior:
Data correction required:
Bug severity:
Domain assumption challenged:
Follow-up task/decision:
```

## Finding classes

- UI friction
- Domain flaw
- API friction
- Data integrity
- Reliability/recovery
- Security/ownership
- Performance
- Feature request
- Documentation gap

Do not change schema automatically because a UI interaction feels awkward. Classify the root problem first.

## Metrics

Track only what helps validate the product/core:

- open → workout-start time
- typical time/interaction count to log one set
- unnecessary interactions
- corrections
- interruptions/resumes
- missing-record incidents
- duplicate-record incidents
- failed finishes
- workout completion
- previous-performance reuse
- major domain changes per cycle

Do not collect unnecessary health/private payloads for engineering telemetry.

## Stable threshold

The exact threshold is deliberately **not set during Milestone 0** because the final Experimental Training Core is not implemented yet.

Before Milestone 4 begins, create an evidence-based threshold proposal covering:

- minimum representative workout cycles
- minimum completed sessions/sets
- required exercised failure/recovery cases
- maximum unresolved severity
- semantic-change trend

Changing the threshold merely to pass the gate is prohibited.
