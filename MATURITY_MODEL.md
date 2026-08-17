# FORGE V2 — Maturity Model

Maturity is scoped. A certification claim must name the capability/domain evaluated.

## Experimental

Purpose: discover the correct Training Core workflow and semantics.

Expected:
- Test UI exists
- real workout usage begins
- schema/contracts/terminology may change with evidence
- wrong implementations may be discarded
- architecture boundaries still apply

Never allowed:
- known corruption
- ownership bypass
- untracked destructive migration
- false production-safety claims

## Stable

Purpose: establish that the Training Core model survived repeated real use.

Before a Stable review, `DOGFOOD_PROTOCOL.md` must define exact thresholds for the current cycle. Calendar age alone is not evidence.

Required evidence includes:
- repeated real workouts
- representative completed sets
- corrections
- interruptions/resumes
- skips/restores where implemented
- exercise replacements where implemented
- previous-performance reuse
- at least one representative migration
- materially reduced semantic/schema churn
- no unresolved corruption
- no unresolved duplicate-record defect
- no known ownership leakage
- critical automated tests consistently green

## Certified

Purpose: prove a Stable Training Core is sufficiently safe, reproducible, recoverable, observable, and traceable for serious Product UI/UX investment.

Required:
- ownership isolation
- authentication and authorization
- transaction integrity
- retry/idempotency
- failure recovery
- security baseline
- backup + successful restore rehearsal
- observability
- CI enforcement
- reproducible deployment
- rollback
- migration verification
- Git/build/migration provenance

Certification record format:

```text
TRAINING CORE
STATUS: CERTIFIED
VERSION: <version>
GIT SHA: <sha>
MIGRATION VERSION: <version>
CERTIFICATION DATE: <date>
EVIDENCE LOCATION: <path>
KNOWN LIMITATIONS: <list>
```

## Controlled change after certification

Certification freezes a reference, not future learning.

A materially affected scope may be demoted from Certified to Stable until evidence is regenerated. Breaking ownership, auth, session lifecycle, transaction, schema, idempotency, backup/restore, or deployment changes require explicit change control and scoped re-certification.
