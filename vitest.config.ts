/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

// @ts-ignore
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
  },
})
