// vitest.config.mjs

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const nextNavigationMock = fileURLToPath(
  new URL("./__tests__/helpers/nextNavigation.ts", import.meta.url),
);

export default defineConfig({
  resolve: {
    alias: {
      "@": projectRoot,
      "next/navigation": nextNavigationMock,
    },
  },
  test: {
    testTimeout: 300000,
    environment: "jsdom",
    env: {
      BETTER_AUTH_URL: "http://localhost:3000",
      BETTER_AUTH_SECRET: "test-secret-at-least-32-characters-long",
    },
    // setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: [
        "lib/**/*.ts",
        "app/**/*.ts",
        "app/**/*.tsx",
        "components/**/*.tsx",
        "proxy.ts",
      ],
      exclude: [
        "**/*.test.*",
        "**/__tests__/**",
        "**/generated/**",
        "lib/db.ts",
      ],
    },
    sequence: {
      concurrency: 1,
    },
  },
});
