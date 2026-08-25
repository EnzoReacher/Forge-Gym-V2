import { randomUUID } from "node:crypto";
import pg from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { buildApp, type AccountResolver } from "../../apps/api/src/app.js";
import {
  createDatabase,
  databaseReady,
  latestMigration,
  PostgresUnitOfWork,
} from "@forge/database";
import {
  TrainingService,
  type AuthenticatedAccount,
} from "@forge/training-application";

const databaseUrl = process.env.TEST_DATABASE_URL;
if (process.env.CI && !databaseUrl) {
  throw new Error("TEST_DATABASE_URL is mandatory in CI");
}
const integration = databaseUrl ? describe : describe.skip;
const A: AuthenticatedAccount = {
  id: "00000000-0000-4000-8000-000000000001",
  alias: "athlete-a",
};
const B: AuthenticatedAccount = {
  id: "00000000-0000-4000-8000-000000000002",
  alias: "athlete-b",
};
const DATE = "2026-08-17";

integration("WSK-001 PostgreSQL/API contract", () => {
  const db = createDatabase(databaseUrl!);
  const service = new TrainingService(
    new PostgresUnitOfWork(db),
    () => "2026-08-17T10:00:00.000Z",
  );
  const client = new pg.Client({ connectionString: databaseUrl! });

  async function fixture(owner: AuthenticatedAccount = A) {
    const sessionId = randomUUID();
    const occurrenceId = randomUUID();
    const setId = randomUUID();
    await client.query(
      "INSERT INTO workout_sessions(id, owner_id, workout_date, timezone, title, state, version) VALUES($1,$2,$3,'Asia/Ho_Chi_Minh','Push A','planned',0)",
      [sessionId, owner.id, DATE],
    );
    await client.query(
      "INSERT INTO exercise_occurrences(id, owner_id, session_id, exercise_key, exercise_name, ordinal) VALUES($1,$2,$3,'barbell-bench-press','Barbell Bench Press',1)",
      [occurrenceId, owner.id, sessionId],
    );
    await client.query(
      "INSERT INTO exercise_sets(id, owner_id, session_id, exercise_occurrence_id, ordinal, state) VALUES($1,$2,$3,$4,1,'pending')",
      [setId, owner.id, sessionId, occurrenceId],
    );
    return { sessionId, setId };
  }

  beforeAll(async () => {
    await client.connect();
  });
  beforeEach(async () => {
    await client.query(
      "TRUNCATE idempotency_records, exercise_sets, exercise_occurrences, workout_sessions RESTART IDENTITY CASCADE",
    );
    await client.query(
      "INSERT INTO accounts(id,alias) VALUES($1,$2),($3,$4) ON CONFLICT (id) DO NOTHING",
      [A.id, A.alias, B.id, B.alias],
    );
  });
  afterAll(async () => {
    await client.end();
    await db.destroy();
  });

  it("proves two-account read isolation and non-enumerating 404 behavior", async () => {
    const { sessionId } = await fixture(A);
    expect(await service.getWorkout(B, sessionId)).toBeNull();
    const accountB: AccountResolver = { resolve: async () => B };
    const app = buildApp({
      training: service,
      accounts: accountB,
      ready: () => databaseReady(db),
      migrationVersion: () => latestMigration(db),
    });
    const existingOtherOwner = await app.inject({
      method: "GET",
      url: `/api/workouts/${sessionId}`,
    });
    const nonexistent = await app.inject({
      method: "GET",
      url: `/api/workouts/${randomUUID()}`,
    });
    expect(existingOtherOwner.statusCode).toBe(404);
    expect(existingOtherOwner.json()).toEqual(nonexistent.json());
    await app.close();
  });

  it("rejects malicious owner payload instead of redirecting ownership", async () => {
    const { sessionId } = await fixture(A);
    const app = buildApp({
      training: service,
      accounts: { resolve: async () => A },
      ready: () => databaseReady(db),
      migrationVersion: () => latestMigration(db),
    });
    const response = await app.inject({
      method: "POST",
      url: `/api/workouts/${sessionId}/start`,
      payload: {
        expectedVersion: 0,
        idempotencyKey: "owner-attack",
        ownerId: B.id,
      },
    });
    expect(response.statusCode).toBe(400);
    expect((await service.getWorkout(A, sessionId))?.state).toBe("planned");
    expect(await service.getWorkout(B, sessionId)).toBeNull();
    await app.close();
  });

  it("makes start, completeSet, and finish idempotent and rejects key reuse with changed payload", async () => {
    const { sessionId, setId } = await fixture(A);
    const started = await service.startWorkout(A, sessionId, 0, "start-1");
    expect(await service.startWorkout(A, sessionId, 0, "start-1")).toEqual(
      started,
    );
    await expect(
      service.startWorkout(A, sessionId, 1, "start-1"),
    ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });

    const completedSet = await service.completeSet(
      A,
      sessionId,
      setId,
      started.version,
      "set-1",
      80000,
      8,
    );
    expect(
      await service.completeSet(
        A,
        sessionId,
        setId,
        started.version,
        "set-1",
        80000,
        8,
      ),
    ).toEqual(completedSet);
    await expect(
      service.completeSet(
        A,
        sessionId,
        setId,
        started.version,
        "set-1",
        80000,
        9,
      ),
    ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });

    const finished = await service.finishWorkout(
      A,
      sessionId,
      completedSet.version,
      "finish-1",
    );
    expect(
      await service.finishWorkout(
        A,
        sessionId,
        completedSet.version,
        "finish-1",
      ),
    ).toEqual(finished);
  });

  it("serializes concurrent duplicate starts by idempotency namespace", async () => {
    const { sessionId } = await fixture(A);
    const [one, two] = await Promise.all([
      service.startWorkout(A, sessionId, 0, "concurrent-start"),
      service.startWorkout(A, sessionId, 0, "concurrent-start"),
    ]);
    expect(two).toEqual(one);
    expect((await service.getWorkout(A, sessionId))?.version).toBe(1);
  });

  it("returns stale-version conflict without overwriting canonical state", async () => {
    const { sessionId, setId } = await fixture(A);
    const started = await service.startWorkout(A, sessionId, 0, "start-stale");
    await expect(
      service.completeSet(A, sessionId, setId, 0, "stale-set", 80000, 8),
    ).rejects.toMatchObject({ code: "STALE_VERSION" });
    const canonical = await service.getWorkout(A, sessionId);
    expect(canonical?.version).toBe(started.version);
    expect(canonical?.exercises[0]?.sets[0]?.state).toBe("pending");
  });
});
