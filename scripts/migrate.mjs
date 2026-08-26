import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import pg from "pg";
const { Client } = pg;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const client = new Client({ connectionString: databaseUrl });
await client.connect();
try {
  await client.query(
    `CREATE TABLE IF NOT EXISTS _forge_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`,
  );
  const dir = resolve("db/migrations");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const version = file.replace(/\.sql$/, "");
    const exists = await client.query(
      "SELECT 1 FROM _forge_migrations WHERE version = $1",
      [version],
    );
    if (exists.rowCount) continue;
    const sql = await readFile(resolve(dir, file), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO _forge_migrations(version) VALUES($1)", [
        version,
      ]);
      await client.query("COMMIT");
      console.log(`Applied ${version}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
} finally {
  await client.end();
}
