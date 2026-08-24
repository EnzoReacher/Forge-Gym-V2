# ADR-016 — Test UI technology

Status: **Accepted**

Date: 2026-08-17

## Decision

Use React + Vite for the Test UI. It is mobile-usable validation infrastructure, not Product UI/UX. It communicates only through application/API contracts, contains no Training business rules, never accesses PostgreSQL directly, and may be served as static assets by the single FORGE application artifact. It must expose loading, success, pending, failure, retry, stale/conflict, and recovery states where relevant. Raw Steel, animation, decorative dashboards, marketing polish, and premature component architecture are forbidden during the Core Era unless required for validation.

## Consequence

The Test UI may later be replaced or substantially redesigned.

## Approval

Accepted by the owner in the final Milestone 0 execution authorization.

## WSK-001 exact pins

- React / React DOM `19.2.8`
- Vite `8.2.1`
- `@vitejs/plugin-react` `6.0.5`
