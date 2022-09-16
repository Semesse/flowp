/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

// @ts-ignore
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html', 'clover'],
    },
  },
})
