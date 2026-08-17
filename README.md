# FORGE V2

FORGE V2 is a clean rebuild of the FORGE training product.

The project is being developed as a controlled engineering program. The first certified scope is the **Training Core** only. Serious Product UI/UX work is intentionally deferred until the Training Core has been exercised through a minimal Test UI, used in real workouts, stabilized, hardened, and certified.

## Governing principle

> Core first. Exercise it through a minimal but usable interface. Use it in real workouts. Let evidence correct the domain and architecture. Establish stability. Harden and certify a versioned core baseline. Then build the real FORGE experience on top.

The Test UI is validation infrastructure, not the final product experience.

## Current status

- Milestone: **0 — Project Control Plane**
- Maturity: **Experimental / pre-walking-skeleton**
- Application scaffold: **not created**
- Production deployment: **none**
- Certified baseline: **none**

See [`CURRENT_STATE.md`](./CURRENT_STATE.md) for the authoritative current checkpoint.

## Read before changing the project

1. [`PROJECT.md`](./PROJECT.md)
2. [`PRODUCT_SCOPE.md`](./PRODUCT_SCOPE.md)
3. [`ARCHITECTURE.md`](./ARCHITECTURE.md)
4. [`DOMAIN_GLOSSARY.md`](./DOMAIN_GLOSSARY.md)
5. [`CORE_INVARIANTS.md`](./CORE_INVARIANTS.md)
6. [`MATURITY_MODEL.md`](./MATURITY_MODEL.md)
7. [`ROADMAP.md`](./ROADMAP.md)
8. [`TEST_STRATEGY.md`](./TEST_STRATEGY.md)
9. [`AGENTS.md`](./AGENTS.md)
10. [`CURRENT_STATE.md`](./CURRENT_STATE.md)

Material architecture decisions live under `docs/decisions/`. Bounded implementation work lives under `docs/tasks/`. Evidence belongs under `docs/evidence/`.

## Ownership model

- Git is the source of truth.
- The repository must remain locally runnable and IDE-agnostic.
- Hosting, authentication, AI, telemetry, and storage vendors must not leak into the Training Domain.
- Production must always identify the immutable Git revision and migration version that produced it.
- The project owner has final product authority.
- Architecture changes require explicit documentation.
- Execution agents work from bounded Task Packets and do not silently become architects.

## Initial product loop

The first end-to-end slice is deliberately narrow:

`Open Test UI → See today's workout → Start → Log one set → Persist → Refresh → Resume → Finish → View completed result`

No Fuel, Coach, billing, admin, social, native mobile, or polished marketing work is authorized during the initial Training Core program.

## Local development

The exact runtime commands are intentionally not committed yet. They will be added after the initial architecture ADRs are reviewed and accepted. A Foundation Gate requirement is that a clean computer can reach a working local environment using documented, reproducible commands with no hidden hosted-only state.

## V1

V1 is reference material, not the codebase to extend. V2 may deliberately reuse proven requirements, safety principles, failure cases, and product lessons. V1 implementation choices are not inherited automatically.
