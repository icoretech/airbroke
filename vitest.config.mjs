// vitest.config.mjs

import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
  plugins: [tsconfigPaths(), react()],
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
