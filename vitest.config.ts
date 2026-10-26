import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    globals: true,
    exclude: ['node_modules', 'dist', 'build', 'coverage'],
    projects: [
      {
        // Logic, route handlers and file checks: no DOM to build.
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['{src,tests}/**/*.{test,spec}.ts'],
          restoreMocks: true,
        },
      },
      {
        // Components. vmThreads builds jsdom once per worker and still runs
        // each file in its own context, so one file's mocks can't leak into
        // the next.
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          pool: 'vmThreads',
          setupFiles: './src/setup.tests.ts',
          include: ['{src,tests}/**/*.{test,spec}.tsx'],
        },
      },
    ],
  },
});
