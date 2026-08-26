# ADR-004 — Authentication architecture

Status: **Accepted**

Date: 2026-08-17

## Context

The walking skeleton needs ownership context, but choosing a production auth vendor now would add coupling before its requirements are proven.

## Decision

Define a provider-neutral `AuthenticatedAccount` boundary now. The walking skeleton uses an explicit **development identity adapter** that is impossible to enable accidentally in production. Selection of the production identity provider is deferred until before external beta.

## Alternatives considered

- Provider-neutral boundary + dev adapter now (recommended)
- Choose production provider immediately
- Anonymous/no identity until later

## Benefits

Lets ownership be correct from the first persisted slice while keeping vendor selection reversible.

## Costs and risks

Dev identity must be strongly environment-gated so it cannot become a production bypass.

## Portability and exit path

Production providers implement the same adapter. Domain sees only a small FORGE account identifier/context.

## Operational burden

Low during local/staging experimentation.

## Consequences

No provider token/header/object appears in Training Domain APIs.

## Verification

The decision is not considered successful until the walking skeleton can be built, tested, run on a clean documented environment, and the relevant boundary can be demonstrated.

## Owner approval

Approved: Yes — accepted by the owner in the final Milestone 0 execution authorization.

## Development identity guard

The development adapter is disabled by default and requires both `NODE_ENV=development` and `ALLOW_DEV_IDENTITY=true`. It resolves only deterministic, server-configured seed identities. It never trusts a public client-supplied canonical account ID. Startup must fail if development identity is enabled in staging or production. Production authentication remains Deferred.
