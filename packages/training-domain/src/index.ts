export type WorkoutState = "planned" | "active" | "completed";
export type ExerciseSetState = "pending" | "completed";

export interface ExerciseSet {
  id: string;
  ordinal: number;
  state: ExerciseSetState;
  loadGrams: number | null;
  reps: number | null;
  completedAt: string | null;
}
export interface ExerciseOccurrence {
  id: string;
  exerciseKey: string;
  exerciseName: string;
  ordinal: number;
  sets: ExerciseSet[];
}
export interface WorkoutSession {
  id: string;
  ownerId: string;
  workoutDate: string;
  timezone: string;
  title: string;
  state: WorkoutState;
  version: number;
  startedAt: string | null;
  completedAt: string | null;
  exercises: ExerciseOccurrence[];
}
export class DomainError extends Error {
  constructor(public readonly code: "INVALID_TRANSITION" | "INVALID_SET" | "SET_NOT_FOUND", message: string) { super(message); }
}
export function startWorkout(session: WorkoutSession, now: string): WorkoutSession {
  if (session.state !== "planned") throw new DomainError("INVALID_TRANSITION", "Only a planned workout can start.");
  return { ...session, state: "active", startedAt: now, version: session.version + 1 };
}
export function completeSet(session: WorkoutSession, setId: string, input: { loadGrams: number; reps: number }, now: string): WorkoutSession {
  if (session.state !== "active") throw new DomainError("INVALID_TRANSITION", "Sets can only be completed in an active workout.");
  if (!Number.isInteger(input.loadGrams) || input.loadGrams < 0 || !Number.isInteger(input.reps) || input.reps <= 0) {
    throw new DomainError("INVALID_SET", "Load must be a non-negative integer gram value and reps must be a positive integer.");
  }
  let found = false;
  const exercises = session.exercises.map((exercise) => ({ ...exercise, sets: exercise.sets.map((set) => {
    if (set.id !== setId) return set;
    found = true;
    if (set.state !== "pending") throw new DomainError("INVALID_TRANSITION", "Only a pending set can be completed.");
    return { ...set, state: "completed" as const, loadGrams: input.loadGrams, reps: input.reps, completedAt: now };
  }) }));
  if (!found) throw new DomainError("SET_NOT_FOUND", "Set not found in workout.");
  return { ...session, exercises, version: session.version + 1 };
}
export function finishWorkout(session: WorkoutSession, now: string): WorkoutSession {
  if (session.state !== "active") throw new DomainError("INVALID_TRANSITION", "Only an active workout can finish.");
  const completed = session.exercises.some((exercise) => exercise.sets.some((set) => set.state === "completed"));
  if (!completed) throw new DomainError("INVALID_TRANSITION", "Complete at least one set before finishing.");
  return { ...session, state: "completed", completedAt: now, version: session.version + 1 };
}
