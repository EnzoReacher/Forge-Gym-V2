import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: {
    alias: {
      "@forge/database": fileURLToPath(
        new URL("./infrastructure/database/src/index.ts", import.meta.url),
      ),
      "@forge/shared-contracts": fileURLToPath(
        new URL("./packages/shared-contracts/src/index.ts", import.meta.url),
      ),
      "@forge/training-application": fileURLToPath(
        new URL(
          "./packages/training-application/src/index.ts",
          import.meta.url,
        ),
      ),
      "@forge/training-domain": fileURLToPath(
        new URL("./packages/training-domain/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    include: [
      "packages/**/*.test.ts",
      "apps/**/*.test.ts",
      "tests/integration/**/*.test.ts",
    ],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
