import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import type {
  AuthenticatedAccount,
  TrainingService,
} from "@forge/training-application";
import { ApplicationError } from "@forge/training-application";
import type {
  ApiErrorBody,
  CompleteSetRequest,
  MutationEnvelope,
} from "@forge/shared-contracts";
export interface AccountResolver {
  resolve(request: FastifyRequest): Promise<AuthenticatedAccount | null>;
}
export interface AppDeps {
  training: TrainingService;
  accounts: AccountResolver;
  ready: () => Promise<boolean>;
  migrationVersion: () => Promise<string | null>;
}
function errorBody(
  code: ApiErrorBody["error"]["code"],
  message: string,
  current?: ApiErrorBody["error"]["current"],
): ApiErrorBody {
  return { error: { code, message, ...(current ? { current } : {}) } };
}
const hasOnly = (
  value: unknown,
  allowed: string[],
): value is Record<string, unknown> =>
  !!value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).every((k) => allowed.includes(k));
const int = (v: unknown) => typeof v === "number" && Number.isInteger(v);
async function accountOr401(
  request: FastifyRequest,
  reply: any,
  resolver: AccountResolver,
) {
  const account = await resolver.resolve(request);
  if (!account) {
    reply
      .code(401)
      .send(errorBody("UNAUTHENTICATED", "Authentication required."));
    return null;
  }
  return account;
}
function mapError(error: unknown, reply: any) {
  if (error instanceof ApplicationError) {
    const code = error.code;
    const status =
      code === "NOT_FOUND"
        ? 404
        : code === "STALE_VERSION" || code === "IDEMPOTENCY_CONFLICT"
          ? 409
          : 400;
    return reply
      .code(status)
      .send(errorBody(code, error.message, error.current));
  }
  const maybe = error as { code?: string; message?: string };
  if (
    maybe?.code === "INVALID_TRANSITION" ||
    maybe?.code === "INVALID_SET" ||
    maybe?.code === "SET_NOT_FOUND"
  )
    return reply
      .code(400)
      .send(
        errorBody(
          "INVALID_TRANSITION",
          maybe.message ?? "Invalid training transition.",
        ),
      );
  requestLog(reply, error);
  return reply
    .code(500)
    .send(errorBody("INTERNAL", "Unexpected server error."));
}
function requestLog(reply: any, error: unknown) {
  reply.request?.log?.error?.({ err: error }, "request failed");
}
export function buildApp(deps: AppDeps): FastifyInstance {
  const app = Fastify({ logger: true, bodyLimit: 32 * 1024 });
  app.get("/health", async () => ({ status: "ok" }));
  app.get("/ready", async (_req, reply) => {
    const ok = await deps.ready();
    return reply
      .code(ok ? 200 : 503)
      .send({ status: ok ? "ready" : "not_ready" });
  });
  app.get("/build-info", async () => ({
    version: process.env.FORGE_VERSION ?? "0.1.0-experimental",
    gitSha: process.env.FORGE_GIT_SHA ?? "local-unverified",
    buildId: process.env.FORGE_BUILD_ID ?? "local",
    buildTimestamp: process.env.FORGE_BUILD_TIMESTAMP ?? "local",
    environment: process.env.APP_ENV ?? "development",
    migrationVersion:
      (await deps.migrationVersion()) ??
      process.env.FORGE_MIGRATION_VERSION ??
      "unknown",
  }));
  app.get("/api/today", async (req, reply) => {
    const a = await accountOr401(req, reply, deps.accounts);
    if (!a) return;
    const date = (req.query as any)?.date;
    if (typeof date !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date))
      return reply
        .code(400)
        .send(errorBody("INVALID_REQUEST", "date must be YYYY-MM-DD"));
    return { workout: await deps.training.getToday(a, date) };
  });
  app.get("/api/workouts/active", async (req, reply) => {
    const a = await accountOr401(req, reply, deps.accounts);
    if (!a) return;
    return { workout: await deps.training.getActive(a) };
  });
  app.get("/api/workouts/:id", async (req, reply) => {
    const a = await accountOr401(req, reply, deps.accounts);
    if (!a) return;
    const w = await deps.training.getWorkout(a, (req.params as any).id);
    if (!w)
      return reply.code(404).send(errorBody("NOT_FOUND", "Workout not found."));
    return { workout: w };
  });
  app.post("/api/workouts/:id/start", async (req, reply) => {
    const a = await accountOr401(req, reply, deps.accounts);
    if (!a) return;
    const b = req.body;
    if (
      !hasOnly(b, ["expectedVersion", "idempotencyKey"]) ||
      !int(b.expectedVersion) ||
      typeof b.idempotencyKey !== "string"
    )
      return reply
        .code(400)
        .send(errorBody("INVALID_REQUEST", "Invalid start request."));
    try {
      return {
        workout: await deps.training.startWorkout(
          a,
          (req.params as any).id,
          b.expectedVersion as number,
          b.idempotencyKey as string,
        ),
      };
    } catch (e) {
      return mapError(e, reply);
    }
  });
  app.post("/api/workouts/:id/sets/:setId/complete", async (req, reply) => {
    const a = await accountOr401(req, reply, deps.accounts);
    if (!a) return;
    const b = req.body;
    if (
      !hasOnly(b, ["expectedVersion", "idempotencyKey", "loadGrams", "reps"]) ||
      !int(b.expectedVersion) ||
      typeof b.idempotencyKey !== "string" ||
      !int(b.loadGrams) ||
      !int(b.reps)
    )
      return reply
        .code(400)
        .send(errorBody("INVALID_REQUEST", "Invalid set request."));
    try {
      return {
        workout: await deps.training.completeSet(
          a,
          (req.params as any).id,
          (req.params as any).setId,
          b.expectedVersion as number,
          b.idempotencyKey as string,
          b.loadGrams as number,
          b.reps as number,
        ),
      };
    } catch (e) {
      return mapError(e, reply);
    }
  });
  app.post("/api/workouts/:id/finish", async (req, reply) => {
    const a = await accountOr401(req, reply, deps.accounts);
    if (!a) return;
    const b = req.body;
    if (
      !hasOnly(b, ["expectedVersion", "idempotencyKey"]) ||
      !int(b.expectedVersion) ||
      typeof b.idempotencyKey !== "string"
    )
      return reply
        .code(400)
        .send(errorBody("INVALID_REQUEST", "Invalid finish request."));
    try {
      return {
        workout: await deps.training.finishWorkout(
          a,
          (req.params as any).id,
          b.expectedVersion as number,
          b.idempotencyKey as string,
        ),
      };
    } catch (e) {
      return mapError(e, reply);
    }
  });
  const staticRoot = resolve(process.env.STATIC_ROOT ?? "apps/test-ui/dist");
  app.get("/", async (_req, reply) => {
    try {
      return reply
        .type("text/html")
        .send(await readFile(resolve(staticRoot, "index.html")));
    } catch {
      return reply.code(404).send("Test UI not built");
    }
  });
  app.get("/assets/*", async (req, reply) => {
    const rel = (req.params as any)["*"];
    const file = resolve(staticRoot, "assets", rel);
    if (!file.startsWith(resolve(staticRoot, "assets") + sep))
      return reply.code(404).send();
    try {
      const types: Record<string, string> = {
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
        ".png": "image/png",
      };
      return reply
        .type(types[extname(file)] ?? "application/octet-stream")
        .send(await readFile(file));
    } catch {
      return reply.code(404).send();
    }
  });
  return app;
}
