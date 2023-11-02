import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

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
      $routes: 'src/routes'
    }
  }
});
