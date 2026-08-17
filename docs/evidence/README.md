# Evidence

This directory stores reviewable evidence for maturity gates, dogfood findings, migrations, failure/recovery exercises, deployment checks, restore rehearsals, and certification.

Evidence must identify the relevant Git SHA/build when applicable.

Suggested structure:

```text
evidence/
  dogfood/
  migrations/
  failures/
  security/
  deployments/
  restore/
  certification/
```

Do not store secrets or unnecessary sensitive workout payloads in evidence.
