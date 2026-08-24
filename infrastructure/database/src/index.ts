import {
  Kysely,
  PostgresDialect,
  sql,
  type JSONColumnType,
  type Transaction,
} from "kysely";
import pg from "pg";
import type { WorkoutSession } from "@forge/training-domain";
import type {
  IdempotencyRecord,
  IdempotencyRepository,
  Operation,
  TrainingRepository,
  UnitOfWork,
  UnitOfWorkContext,
} from "@forge/training-application";
import type { WorkoutDto } from "@forge/shared-contracts";
const { Pool } = pg;
interface DB {
  accounts: { id: string; alias: string; created_at: Date };
  workout_sessions: {
    id: string;
    owner_id: string;
    workout_date: string;
    timezone: string;
    title: string;
    state: "planned" | "active" | "completed";
    version: number;
    started_at: Date | null;
    completed_at: Date | null;
    created_at: Date;
  };
  exercise_occurrences: {
    id: string;
    owner_id: string;
    session_id: string;
    exercise_key: string;
    exercise_name: string;
    ordinal: number;
  };
  exercise_sets: {
    id: string;
    owner_id: string;
    session_id: string;
    exercise_occurrence_id: string;
    ordinal: number;
    state: "pending" | "completed";
    load_grams: number | null;
    reps: number | null;
    completed_at: Date | null;
  };
  idempotency_records: {
    owner_id: string;
    operation: string;
    idempotency_key: string;
    request_hash: string;
    response_json: JSONColumnType<WorkoutDto, WorkoutDto, WorkoutDto>;
    created_at: Date;
  };
  _forge_migrations: { version: string; applied_at: Date };
}
export function createDatabase(databaseUrl: string): Kysely<DB> {
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: databaseUrl, max: 10 }),
    }),
  });
}
async function hydrate(
  db: Kysely<DB> | Transaction<DB>,
  ownerId: string,
  sessionId: string,
): Promise<WorkoutSession | null> {
  const s = await db
    .selectFrom("workout_sessions")
    .selectAll()
    .where("owner_id", "=", ownerId)
    .where("id", "=", sessionId)
    .executeTakeFirst();
  if (!s) return null;
  const occurrences = await db
    .selectFrom("exercise_occurrences")
    .selectAll()
    .where("owner_id", "=", ownerId)
    .where("session_id", "=", sessionId)
    .orderBy("ordinal")
    .execute();
  const sets = await db
    .selectFrom("exercise_sets")
    .selectAll()
    .where("owner_id", "=", ownerId)
    .where("session_id", "=", sessionId)
    .orderBy("ordinal")
    .execute();
  return {
    id: s.id,
    ownerId: s.owner_id,
    workoutDate: String(s.workout_date),
    timezone: s.timezone,
    title: s.title,
    state: s.state,
    version: s.version,
    startedAt: s.started_at?.toISOString() ?? null,
    completedAt: s.completed_at?.toISOString() ?? null,
    exercises: occurrences.map((e) => ({
      id: e.id,
      exerciseKey: e.exercise_key,
      exerciseName: e.exercise_name,
      ordinal: e.ordinal,
      sets: sets
        .filter((x) => x.exercise_occurrence_id === e.id)
        .map((x) => ({
          id: x.id,
          ordinal: x.ordinal,
          state: x.state,
          loadGrams: x.load_grams,
          reps: x.reps,
          completedAt: x.completed_at?.toISOString() ?? null,
        })),
    })),
  };
}
class PgTrainingRepository implements TrainingRepository {
  constructor(private readonly db: Transaction<DB>) {}
  async getToday(accountId: string, date: string) {
    const row = await this.db
      .selectFrom("workout_sessions")
      .select("id")
      .where("owner_id", "=", accountId)
      .where("workout_date", "=", date)
      .where("state", "in", ["planned", "active"])
      .orderBy("created_at")
      .executeTakeFirst();
    return row ? hydrate(this.db, accountId, row.id) : null;
  }
  async getActive(accountId: string) {
    const row = await this.db
      .selectFrom("workout_sessions")
      .select("id")
      .where("owner_id", "=", accountId)
      .where("state", "=", "active")
      .executeTakeFirst();
    return row ? hydrate(this.db, accountId, row.id) : null;
  }
  getById(accountId: string, sessionId: string) {
    return hydrate(this.db, accountId, sessionId);
  }
  async save(
    accountId: string,
    session: WorkoutSession,
    expectedVersion: number,
  ) {
    const updated = await this.db
      .updateTable("workout_sessions")
      .set({
        state: session.state,
        version: session.version,
        started_at: session.startedAt ? new Date(session.startedAt) : null,
        completed_at: session.completedAt
          ? new Date(session.completedAt)
          : null,
      })
      .where("id", "=", session.id)
      .where("owner_id", "=", accountId)
      .where("version", "=", expectedVersion)
      .returning("id")
      .executeTakeFirst();
    if (!updated) return false;
    for (const exercise of session.exercises)
      for (const set of exercise.sets)
        await this.db
          .updateTable("exercise_sets")
          .set({
            state: set.state,
            load_grams: set.loadGrams,
            reps: set.reps,
            completed_at: set.completedAt ? new Date(set.completedAt) : null,
          })
          .where("id", "=", set.id)
          .where("owner_id", "=", accountId)
          .where("session_id", "=", session.id)
          .execute();
    return true;
  }
}
class PgIdempotencyRepository implements IdempotencyRepository {
  constructor(private readonly db: Transaction<DB>) {}
  async lock(accountId: string, operation: Operation, key: string) {
    const namespace = `${accountId}:${operation}:${key}`;
    await sql`select pg_advisory_xact_lock(hashtextextended(${namespace}, 0))`.execute(
      this.db,
    );
  }
  async get(accountId: string, operation: Operation, key: string) {
    const r = await this.db
      .selectFrom("idempotency_records")
      .select(["request_hash", "response_json"])
      .where("owner_id", "=", accountId)
      .where("operation", "=", operation)
      .where("idempotency_key", "=", key)
      .executeTakeFirst();
    return r
      ? { requestHash: r.request_hash, response: r.response_json }
      : null;
  }
  async put(
    accountId: string,
    operation: Operation,
    key: string,
    record: IdempotencyRecord,
  ) {
    await this.db
      .insertInto("idempotency_records")
      .values({
        owner_id: accountId,
        operation,
        idempotency_key: key,
        request_hash: record.requestHash,
        response_json: record.response,
        created_at: new Date(),
      })
      .execute();
  }
}
export class PostgresUnitOfWork implements UnitOfWork {
  constructor(private readonly db: Kysely<DB>) {}
  run<T>(work: (ctx: UnitOfWorkContext) => Promise<T>): Promise<T> {
    return this.db.transaction().execute(async (trx) =>
      work({
        training: new PgTrainingRepository(trx),
        idempotency: new PgIdempotencyRepository(trx),
      }),
    );
  }
}
export async function databaseReady(db: Kysely<DB>): Promise<boolean> {
  try {
    await db
      .selectFrom("_forge_migrations")
      .select("version")
      .limit(1)
      .execute();
    return true;
  } catch {
    return false;
  }
}
export async function latestMigration(db: Kysely<DB>): Promise<string | null> {
  try {
    const r = await db
      .selectFrom("_forge_migrations")
      .select("version")
      .orderBy("applied_at", "desc")
      .executeTakeFirst();
    return r?.version ?? null;
  } catch {
    return null;
  }
}
