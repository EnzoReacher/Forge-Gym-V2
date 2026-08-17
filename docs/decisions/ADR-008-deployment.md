# ADR-008 — Deployment model

Status: **Accepted**

Date: 2026-08-17

## Context

V1 taught that hosted lifecycle opacity can make production identity difficult to prove. V2 requires local ownership and deployment traceability.

## Decision

Build the application as a standard **OCI container image** plus database migrations. Do not select a final hosting vendor in Milestone 0. Any staging/production platform must run the artifact without changing domain/application behavior and expose immutable Git SHA/build/migration metadata.

## Alternatives considered

- OCI container on a replaceable host (recommended)
- provider-specific serverless bundle
- ChatGPT Sites-specific build
- VM-only manual deployment

## Benefits

Portable artifact, ordinary local reproduction, clearer build/release/run separation, host exit path.

## Costs and risks

Container build/registry management adds some operational work.

## Portability and exit path

Any OCI-compatible host or self-managed server can run the app. Database remains separately portable.

## Operational burden

Moderate, intentionally delayed until the walking skeleton needs staging.

## Consequences

Hosting vendor selection remains a separate decision. Every deployed environment must expose build identity.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.
