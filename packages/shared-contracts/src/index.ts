export interface SetDto { id: string; ordinal: number; state: "pending" | "completed"; loadGrams: number | null; reps: number | null; completedAt: string | null; }
export interface ExerciseDto { id: string; exerciseKey: string; exerciseName: string; ordinal: number; sets: SetDto[]; }
export interface WorkoutDto { id: string; workoutDate: string; timezone: string; title: string; state: "planned" | "active" | "completed"; version: number; startedAt: string | null; completedAt: string | null; exercises: ExerciseDto[]; }
export interface MutationEnvelope { expectedVersion: number; idempotencyKey: string; }
export interface CompleteSetRequest extends MutationEnvelope { loadGrams: number; reps: number; }
export type ApiErrorCode = "UNAUTHENTICATED" | "NOT_FOUND" | "INVALID_REQUEST" | "INVALID_TRANSITION" | "STALE_VERSION" | "IDEMPOTENCY_CONFLICT" | "INTERNAL";
export interface ApiErrorBody { error: { code: ApiErrorCode; message: string; current?: WorkoutDto } }
