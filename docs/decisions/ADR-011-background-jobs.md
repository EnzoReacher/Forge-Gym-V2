# ADR-011 — Background jobs

Status: **Deferred**

Date: 2026-08-17

No current Training Core walking-skeleton requirement needs a queue or background worker.

Default: synchronous application/database operations with bounded request timeouts. Introduce background processing only when a measured use case cannot be served safely within that model.

Any queue/provider selection requires a new ADR update and owner review.
