import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL,
  },
  workers: process.env.CI ? 1 : undefined,
});
