# ADR-009 — Observability

Status: **Deferred**

Date: 2026-08-17

## Context

The walking skeleton needs diagnosable requests and a health endpoint, but a full telemetry vendor decision is not required during Milestone 0.

## Decision

Defer vendor/tooling selection. From the first executable slice, require structured logs, privacy-safe request/correlation IDs, `/health`/readiness semantics, and build identity. Before Certification, select/export metrics/traces/error tracking only where they materially improve diagnosis.

## Constraint

Training Domain must not import a telemetry vendor SDK.

## Owner approval

Required when a hosted observability vendor or paid service is selected.
