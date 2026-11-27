import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    environment: 'node',
    globals: true,
    include: ['test/integration/**/*.spec.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
