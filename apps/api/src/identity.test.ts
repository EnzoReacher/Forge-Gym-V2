import { describe, expect, it } from "vitest";
import { createDevelopmentAccountResolver } from "./identity.js";

describe("development identity startup guard", () => {
  it("is disabled by default", async () => {
    const resolver = createDevelopmentAccountResolver({
      NODE_ENV: "development",
      APP_ENV: "development",
    });
    expect(await resolver.resolve({} as never)).toBeNull();
  });

  it("requires both development environment flags", () => {
    expect(() =>
      createDevelopmentAccountResolver({
        NODE_ENV: "production",
        APP_ENV: "production",
        ALLOW_DEV_IDENTITY: "true",
        DEV_ACCOUNT_ID: "a",
        DEV_ACCOUNT_ALIAS: "athlete-a",
      }),
    ).toThrow(/forbidden/i);
    expect(() =>
      createDevelopmentAccountResolver({
        NODE_ENV: "development",
        APP_ENV: "staging",
        ALLOW_DEV_IDENTITY: "true",
        DEV_ACCOUNT_ID: "a",
        DEV_ACCOUNT_ALIAS: "athlete-a",
      }),
    ).toThrow(/forbidden/i);
  });

  it("uses only deterministic server configuration", async () => {
    const resolver = createDevelopmentAccountResolver({
      NODE_ENV: "development",
      APP_ENV: "development",
      ALLOW_DEV_IDENTITY: "true",
      DEV_ACCOUNT_ID: "00000000-0000-4000-8000-000000000001",
      DEV_ACCOUNT_ALIAS: "athlete-a",
    });
    await expect(
      resolver.resolve({ headers: { "x-forge-account": "attacker" } } as never),
    ).resolves.toEqual({
      id: "00000000-0000-4000-8000-000000000001",
      alias: "athlete-a",
    });
  });
});
