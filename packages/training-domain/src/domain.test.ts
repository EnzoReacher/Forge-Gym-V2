import { describe, expect, it } from "vitest";
import {
  completeSet,
  finishWorkout,
  startWorkout,
  type WorkoutSession,
} from "./index.js";
const planned = (): WorkoutSession => ({
  id: "s1",
  ownerId: "a",
  workoutDate: "2026-08-17",
  timezone: "Asia/Ho_Chi_Minh",
  title: "Push A",
  state: "planned",
  version: 0,
  startedAt: null,
  completedAt: null,
  exercises: [
    {
      id: "e1",
      exerciseKey: "bench",
      exerciseName: "Bench",
      ordinal: 1,
      sets: [
        {
          id: "set1",
          ordinal: 1,
          state: "pending",
          loadGrams: null,
          reps: null,
          completedAt: null,
        },
      ],
    },
  ],
});
describe("Training Domain", () => {
  it("transitions planned -> active -> completed with monotonic versions", () => {
    const active = startWorkout(planned(), "2026-08-17T10:00:00.000Z");
    expect(active.version).toBe(1);
    const withSet = completeSet(
      active,
      "set1",
      { loadGrams: 80000, reps: 8 },
      "2026-08-17T10:05:00.000Z",
    );
    expect(withSet.version).toBe(2);
    expect(withSet.exercises[0]?.sets[0]?.state).toBe("completed");
    const done = finishWorkout(withSet, "2026-08-17T11:00:00.000Z");
    expect(done.state).toBe("completed");
    expect(done.version).toBe(3);
  });
});
