import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import * as path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/vitest/**/*.test.{js,ts}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/vitest/setupTests.js'],
    reporters: ['verbose'],
    restoreMocks: true
  },
  resolve: {
    alias: {
      $routes: path.resolve(__dirname, './src/routes'),
      $factories: path.resolve(
        __dirname,
        './src/factories'
      ),
      $matchers: path.resolve(__dirname, './src/matchers'),
      $stores: path.resolve(__dirname, './src/stores')
    }
  }
});
