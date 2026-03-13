// vitest.config.mjs

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
  test: {
    testTimeout: 300000,
    environment: "jsdom",
    // setupFiles: ['./vitest.setup.ts'],
    // coverage: {
    //   reporter: ['text', 'html'],
    // },
    sequence: {
      concurrency: 1,
    },
  },
});
