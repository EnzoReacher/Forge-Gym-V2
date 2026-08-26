import {
  createDatabase,
  databaseReady,
  latestMigration,
  PostgresUnitOfWork,
} from "@forge/database";
import { TrainingService } from "@forge/training-application";
import { buildApp } from "./app.js";
import { createDevelopmentAccountResolver } from "./identity.js";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`${name} is required`);
  return value;
}

const db = createDatabase(required("DATABASE_URL"));
const app = buildApp({
  training: new TrainingService(new PostgresUnitOfWork(db)),
  accounts: createDevelopmentAccountResolver(process.env),
  ready: () => databaseReady(db),
  migrationVersion: () => latestMigration(db),
});

const port = Number(process.env.PORT ?? 3000);
await app.listen({ port, host: "0.0.0.0" });
