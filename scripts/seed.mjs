import { createHash } from "node:crypto";
import pg from "pg";
const { Client } = pg;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const zone = "Asia/Ho_Chi_Minh";
const dateParts = Object.fromEntries(
  new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(new Date())
    .map(({ type, value }) => [type, value]),
);
const today = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
function uuidFor(text) {
  const hex = createHash("sha256")
    .update(text)
    .digest("hex")
    .slice(0, 32)
    .split("");
  hex[12] = "4";
  hex[16] = "8";
  const s = hex.join("");
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
}
const accounts = [
  ["00000000-0000-4000-8000-000000000001", "athlete-a"],
  ["00000000-0000-4000-8000-000000000002", "athlete-b"],
];
const client = new Client({ connectionString: databaseUrl });
await client.connect();
try {
  await client.query("BEGIN");
  for (const [accountId, alias] of accounts) {
    await client.query(
      "INSERT INTO accounts(id, alias) VALUES($1,$2) ON CONFLICT (id) DO NOTHING",
      [accountId, alias],
    );
    const sessionId = uuidFor(`${alias}:${today}:push-a`);
    const occurrenceId = uuidFor(`${sessionId}:bench-press`);
    const setId = uuidFor(`${occurrenceId}:set-1`);
    await client.query(
      `INSERT INTO workout_sessions(id, owner_id, workout_date, timezone, title, state, version)
      VALUES($1,$2,$3,$4,'Push A','planned',0) ON CONFLICT (id) DO NOTHING`,
      [sessionId, accountId, today, zone],
    );
    await client.query(
      `INSERT INTO exercise_occurrences(id, owner_id, session_id, exercise_key, exercise_name, ordinal)
      VALUES($1,$2,$3,'barbell-bench-press','Barbell Bench Press',1) ON CONFLICT (id) DO NOTHING`,
      [occurrenceId, accountId, sessionId],
    );
    await client.query(
      `INSERT INTO exercise_sets(id, owner_id, session_id, exercise_occurrence_id, ordinal, state)
      VALUES($1,$2,$3,$4,1,'pending') ON CONFLICT (id) DO NOTHING`,
      [setId, accountId, sessionId, occurrenceId],
    );
  }
  await client.query("COMMIT");
  console.log(
    `Seeded deterministic development workouts for ${today} (${zone})`,
  );
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
