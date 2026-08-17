import { createHash } from "node:crypto";
import { completeSet, finishWorkout, startWorkout, type WorkoutSession } from "@forge/training-domain";
import type { WorkoutDto } from "@forge/shared-contracts";

export interface AuthenticatedAccount { id: string; alias: string; }
export type Operation = "startWorkout" | "completeSet" | "finishWorkout";
export interface IdempotencyRecord { requestHash: string; response: WorkoutDto; }
export interface TrainingRepository {
  getToday(accountId: string, date: string): Promise<WorkoutSession | null>;
  getActive(accountId: string): Promise<WorkoutSession | null>;
  getById(accountId: string, sessionId: string): Promise<WorkoutSession | null>;
  save(accountId: string, session: WorkoutSession, expectedVersion: number): Promise<boolean>;
}
export interface IdempotencyRepository {
  lock(accountId: string, operation: Operation, key: string): Promise<void>;
  get(accountId: string, operation: Operation, key: string): Promise<IdempotencyRecord | null>;
  put(accountId: string, operation: Operation, key: string, record: IdempotencyRecord): Promise<void>;
}
export interface UnitOfWorkContext { training: TrainingRepository; idempotency: IdempotencyRepository; }
export interface UnitOfWork { run<T>(work: (ctx: UnitOfWorkContext) => Promise<T>): Promise<T>; }

export class ApplicationError extends Error {
  constructor(public readonly code: "NOT_FOUND" | "INVALID_TRANSITION" | "STALE_VERSION" | "IDEMPOTENCY_CONFLICT", message: string, public readonly current?: WorkoutDto) { super(message); }
}
const dto = (s: WorkoutSession): WorkoutDto => ({ id: s.id, workoutDate: s.workoutDate, timezone: s.timezone, title: s.title, state: s.state, version: s.version, startedAt: s.startedAt, completedAt: s.completedAt, exercises: s.exercises.map((e) => ({ id: e.id, exerciseKey: e.exerciseKey, exerciseName: e.exerciseName, ordinal: e.ordinal, sets: e.sets.map((x) => ({ ...x })) })) });
function stableHash(value: unknown): string {
  const normalize = (v: unknown): unknown => Array.isArray(v) ? v.map(normalize) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,x]) => [k, normalize(x)])) : v;
  return createHash("sha256").update(JSON.stringify(normalize(value))).digest("hex");
}
export class TrainingService {
  constructor(private readonly uow: UnitOfWork, private readonly now: () => string = () => new Date().toISOString()) {}
  async getToday(account: AuthenticatedAccount, date: string): Promise<WorkoutDto | null> { return this.uow.run(async ({training}) => { const s = await training.getToday(account.id, date); return s ? dto(s) : null; }); }
  async getActive(account: AuthenticatedAccount): Promise<WorkoutDto | null> { return this.uow.run(async ({training}) => { const s = await training.getActive(account.id); return s ? dto(s) : null; }); }
  async getWorkout(account: AuthenticatedAccount, id: string): Promise<WorkoutDto | null> { return this.uow.run(async ({training}) => { const s = await training.getById(account.id, id); return s ? dto(s) : null; }); }
  startWorkout(account: AuthenticatedAccount, id: string, expectedVersion: number, key: string) { return this.mutate(account, "startWorkout", key, { id, expectedVersion }, async (repo) => { const s=await repo.getById(account.id,id); if(!s) throw new ApplicationError("NOT_FOUND","Workout not found."); if(s.version!==expectedVersion) throw new ApplicationError("STALE_VERSION","Workout changed; reload canonical state.",dto(s)); return startWorkout(s,this.now()); }); }
  completeSet(account: AuthenticatedAccount, id: string, setId: string, expectedVersion: number, key: string, loadGrams: number, reps: number) { return this.mutate(account, "completeSet", key, { id,setId,expectedVersion,loadGrams,reps }, async (repo) => { const s=await repo.getById(account.id,id); if(!s) throw new ApplicationError("NOT_FOUND","Workout not found."); if(s.version!==expectedVersion) throw new ApplicationError("STALE_VERSION","Workout changed; reload canonical state.",dto(s)); return completeSet(s,setId,{loadGrams,reps},this.now()); }); }
  finishWorkout(account: AuthenticatedAccount, id: string, expectedVersion: number, key: string) { return this.mutate(account, "finishWorkout", key, { id, expectedVersion }, async (repo) => { const s=await repo.getById(account.id,id); if(!s) throw new ApplicationError("NOT_FOUND","Workout not found."); if(s.version!==expectedVersion) throw new ApplicationError("STALE_VERSION","Workout changed; reload canonical state.",dto(s)); return finishWorkout(s,this.now()); }); }
  private async mutate(account: AuthenticatedAccount, operation: Operation, key: string, materialPayload: unknown, transition: (repo: TrainingRepository) => Promise<WorkoutSession>): Promise<WorkoutDto> {
    if (!key || key.length > 128) throw new ApplicationError("IDEMPOTENCY_CONFLICT", "A valid idempotency key is required.");
    const requestHash=stableHash(materialPayload);
    return this.uow.run(async ({training,idempotency}) => {
      await idempotency.lock(account.id, operation, key);
      const existing=await idempotency.get(account.id,operation,key);
      if(existing) { if(existing.requestHash!==requestHash) throw new ApplicationError("IDEMPOTENCY_CONFLICT","Idempotency key was already used for different input."); return existing.response; }
      const beforeVersion=(materialPayload as {expectedVersion:number}).expectedVersion;
      const next=await transition(training);
      if(!(await training.save(account.id,next,beforeVersion))) { const current=await training.getById(account.id,next.id); throw new ApplicationError("STALE_VERSION","Workout changed; reload canonical state.",current?dto(current):undefined); }
      const response=dto(next);
      await idempotency.put(account.id,operation,key,{requestHash,response});
      return response;
    });
  }
}
