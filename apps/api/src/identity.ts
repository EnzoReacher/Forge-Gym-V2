import type { AuthenticatedAccount } from "@forge/training-application";
import type { AccountResolver } from "./app.js";

type Env = Record<string, string | undefined>;

function required(env: Env, name: string): string {
  const value = env[name];
  if (!value) throw new Error(`${name} is required when development identity is enabled.`);
  return value;
}

export function createDevelopmentAccountResolver(env: Env = process.env): AccountResolver {
  const allow = env.ALLOW_DEV_IDENTITY === "true";
  const nodeEnv = env.NODE_ENV ?? "development";
  const appEnv = env.APP_ENV ?? nodeEnv;

  if (allow && (nodeEnv !== "development" || appEnv !== "development")) {
    throw new Error("Development identity is forbidden outside development.");
  }

  if (!allow) return { resolve: async () => null };

  const account: AuthenticatedAccount = {
    id: required(env, "DEV_ACCOUNT_ID"),
    alias: required(env, "DEV_ACCOUNT_ALIAS"),
  };

  return { resolve: async () => account };
}
