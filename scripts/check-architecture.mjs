import { readdir, readFile } from "node:fs/promises";

const rules = [
  {
    root: new URL("../packages/training-domain/src/", import.meta.url),
    label: "Training Domain",
    forbidden: [
      "fastify",
      "kysely",
      "pg",
      "react",
      "vite",
      "@forge/training-application",
      "@forge/database",
    ],
  },
  {
    root: new URL("../packages/training-application/src/", import.meta.url),
    label: "Training Application",
    forbidden: ["fastify", "kysely", "pg", "react", "vite", "@forge/database"],
  },
  {
    root: new URL("../packages/shared-contracts/src/", import.meta.url),
    label: "Shared Contracts",
    forbidden: [
      "fastify",
      "kysely",
      "pg",
      "react",
      "vite",
      "@forge/training-domain",
      "@forge/training-application",
      "@forge/database",
    ],
  },
  {
    root: new URL("../apps/test-ui/src/", import.meta.url),
    label: "Test UI",
    forbidden: [
      "kysely",
      "pg",
      "@forge/database",
      "@forge/training-domain",
      "@forge/training-application",
    ],
  },
  {
    root: new URL("../infrastructure/database/src/", import.meta.url),
    label: "Database Infrastructure",
    forbidden: ["fastify", "react", "vite"],
  },
];

const importPattern = /(?:from\s+|import\s*\()["']([^"']+)["']/g;

async function walk(rule, url = rule.root) {
  const entries = await readdir(url, { withFileTypes: true });
  for (const entry of entries) {
    const child = new URL(entry.name + (entry.isDirectory() ? "/" : ""), url);
    if (entry.isDirectory()) {
      await walk(rule, child);
      continue;
    }
    if (
      !/\.(?:ts|tsx)$/.test(entry.name) ||
      entry.name.endsWith(".test.ts") ||
      entry.name.endsWith(".test.tsx")
    )
      continue;
    const text = await readFile(child, "utf8");
    for (const match of text.matchAll(importPattern)) {
      const specifier = match[1];
      if (
        rule.forbidden.some(
          (name) => specifier === name || specifier.startsWith(`${name}/`),
        )
      ) {
        throw new Error(
          `${rule.label} dependency violation in ${child.pathname}: import ${specifier}`,
        );
      }
    }
  }
}

for (const rule of rules) await walk(rule);
console.log("Architecture dependency checks passed.");
