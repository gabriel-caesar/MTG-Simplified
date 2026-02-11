import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  }
})
