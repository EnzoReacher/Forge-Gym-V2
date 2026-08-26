CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY,
  alias text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  workout_date date NOT NULL,
  timezone text NOT NULL,
  title text NOT NULL,
  state text NOT NULL CHECK (state IN ('planned', 'active', 'completed')),
  version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id, id)
);
CREATE INDEX IF NOT EXISTS workout_sessions_owner_state_idx ON workout_sessions(owner_id, state);
CREATE INDEX IF NOT EXISTS workout_sessions_owner_date_idx ON workout_sessions(owner_id, workout_date);
CREATE TABLE IF NOT EXISTS exercise_occurrences (
  id uuid PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  session_id uuid NOT NULL,
  exercise_key text NOT NULL,
  exercise_name text NOT NULL,
  ordinal integer NOT NULL CHECK (ordinal > 0),
  UNIQUE(session_id, ordinal),
  UNIQUE(owner_id, session_id, id),
  FOREIGN KEY(owner_id, session_id) REFERENCES workout_sessions(owner_id, id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS exercise_occurrences_owner_session_idx ON exercise_occurrences(owner_id, session_id);

CREATE TABLE IF NOT EXISTS exercise_sets (
  id uuid PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  session_id uuid NOT NULL,
  exercise_occurrence_id uuid NOT NULL REFERENCES exercise_occurrences(id) ON DELETE CASCADE,
  ordinal integer NOT NULL CHECK (ordinal > 0),
  state text NOT NULL CHECK (state IN ('pending', 'completed')),
  load_grams integer CHECK (load_grams IS NULL OR load_grams >= 0),
  reps integer CHECK (reps IS NULL OR reps > 0),
  completed_at timestamptz,
  UNIQUE(exercise_occurrence_id, ordinal),
  CHECK (
    (state = 'pending' AND completed_at IS NULL)
    OR
    (state = 'completed' AND load_grams IS NOT NULL AND reps IS NOT NULL AND completed_at IS NOT NULL)
  ),
  FOREIGN KEY(owner_id, session_id, exercise_occurrence_id)
    REFERENCES exercise_occurrences(owner_id, session_id, id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS exercise_sets_owner_session_idx ON exercise_sets(owner_id, session_id);

CREATE TABLE IF NOT EXISTS idempotency_records (
  owner_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  operation text NOT NULL,
  idempotency_key text NOT NULL,
  request_hash text NOT NULL,
  response_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(owner_id, operation, idempotency_key)
);
