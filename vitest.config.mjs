// vitest.config.mjs

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    testTimeout: 300000,
    environment: 'jsdom',
    // setupFiles: ['./vitest.setup.ts'],
    // coverage: {
    //   reporter: ['text', 'html'],
    // },
    sequence: {
      concurrency: 1,
    },
  },
});
