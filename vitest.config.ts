import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      include: ['src/lib/**/*.ts'],
      exclude: [
        'src/lib/notion.ts',
        'src/lib/notion-monitor.ts',
        'src/lib/gsap.ts',
      ],
    },
  },
})
