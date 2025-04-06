// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './src/test',
    timeout: 30 * 1000,
    expect: { timeout: 5000 },

    use: {
        headless: false,
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
        video: 'retain-on-failure',
        trace: 'on',
        screenshot: 'only-on-failure',
    },

    reporter: [['html', { open: 'never' }], ['list']],

    projects: [
        {
            name: 'Chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'Firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'WebKit',
            use: { ...devices['Desktop Safari'] },
        },
    ],

    // Optional: global setup for MSW mock server
    // globalSetup: './src/test/globalSetup.ts',
});
