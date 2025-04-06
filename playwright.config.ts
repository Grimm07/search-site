// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        headless: false,  // Run tests in headless mode (set to `false` for visual testing)
        video: 'retain-on-failure', // Record video only on failure (use 'on' for always recording)
        trace: 'on', // Record traces (useful for debugging)
    },
    testDir: './src/test',
    // reporter: 'list', // or 'html' for pretty output
    reporter: [['html', { open: 'never' }]],
});