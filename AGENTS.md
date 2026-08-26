# FORGE V2 — Agent Operating Contract

This file governs AI and human execution inside the repository.

## Authority

### Project owner

Final authority over product scope, irreversible business decisions, production release, and acceptance of material architecture choices.

### Lead architecture/engineering agent

May inspect, propose reversible architecture, create control documents, implement approved bounded work, verify evidence, identify ambiguity, and recommend maturity transitions.

### Execution agents

May work only from an explicit Task Packet. They do not independently redefine architecture, scope, canonical domain semantics, or release gates.

### CI

Independent mechanical verifier. Agent claims do not override failing checks.

## Mandatory work sequence

`Inspect → Task Packet → Branch → Implement → Verify → Review diff/evidence → PR → Required checks → Merge → Checkpoint`

An initial empty-repository bootstrap commit may be required before normal branch/PR workflow exists. That exception must be documented and must not contain product implementation.

## Before implementation

Read:

- PROJECT.md
- PRODUCT_SCOPE.md
- ARCHITECTURE.md
- CURRENT_STATE.md
- relevant ADRs
- relevant domain/invariant/test documents
- the active Task Packet

State what will change and what will not change.

## Agents must not silently

- add/change a framework, service, database, or infrastructure provider
- alter auth architecture
- alter canonical ownership
- expand into deferred domains
- change canonical domain semantics without evidence and documentation
- introduce speculative abstractions
- perform Product UI polish during the Core Era
- weaken tests/gates
- modify unrelated files
- write directly to protected main
- treat a build as deployment verification
- declare Stable/Certified without gate evidence

## Stop conditions

Stop the affected task and report when:

- requirements conflict with architecture constraints
- domain semantics are undefined/contradictory
- migration may lose/reinterpret data
- Stable/Certified contract requires breaking change
- security boundary cannot be verified
- Test UI exposes a likely domain-model error
- irreversible decision lacks required owner approval
- required tests cannot run
- repository state conflicts with baseline

Continue unrelated safe work if it remains clearly in scope.

## Task Packet

Every implementation task must include:

```text
Task ID
Title
Goal
Why this task exists
Current maturity state
Context
Allowed scope
Forbidden scope
Architecture constraints
Acceptance criteria
Required tests
Failure cases
Files likely affected
Documentation updates
Evidence to record
Definition of done
```

## Evidence

Completion reports must state:

- files changed
- decisions made
- tests actually run
- failures/limitations
- evidence path
- follow-up

Never claim an unexecuted test passed.

## Change control

Architecture changes require ADR updates. Stable/Certified behavioral changes require impact review. Certification may be scoped-demoted when affected evidence becomes invalid.
