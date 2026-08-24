import { describe, expect, it } from "vitest";
import { buildApp } from "./app.js";

const training = {} as never;
const accounts = { resolve: async () => null };

describe("health/readiness/build identity", () => {
  it("keeps liveness separate from database readiness", async () => {
    const app = buildApp({
      training,
      accounts,
      ready: async () => false,
      migrationVersion: async () => null,
    });
    expect(
      (await app.inject({ method: "GET", url: "/health" })).statusCode,
    ).toBe(200);
    const ready = await app.inject({ method: "GET", url: "/ready" });
    expect(ready.statusCode).toBe(503);
    expect(ready.json()).toEqual({ status: "not_ready" });
    await app.close();
  });

  it("exposes non-sensitive build identity", async () => {
    const app = buildApp({
      training,
      accounts,
      ready: async () => true,
      migrationVersion: async () => "001_initial",
    });
    const response = await app.inject({ method: "GET", url: "/build-info" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ migrationVersion: "001_initial" });
    await app.close();
  });
});
