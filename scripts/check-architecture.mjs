import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
const root = new URL("../packages/training-domain/src/", import.meta.url);
const forbidden = [/from\s+["']fastify["']/, /from\s+["']kysely["']/, /from\s+["']pg["']/, /from\s+["']react["']/, /from\s+["']vite["']/];
async function walk(url) {
  const entries = await readdir(url, { withFileTypes: true });
  for (const entry of entries) {
    const child = new URL(entry.name + (entry.isDirectory() ? "/" : ""), url);
    if (entry.isDirectory()) await walk(child);
    else if (entry.name.endsWith(".ts")) {
      const text = await readFile(child, "utf8");
      for (const pattern of forbidden) {
        if (pattern.test(text)) throw new Error(`Training Domain dependency violation in ${child.pathname}: ${pattern}`);
      }
    }
  }
}
await walk(root);
console.log("Architecture dependency check passed.");
