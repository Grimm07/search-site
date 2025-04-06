import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Authentication Flow + Audits', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await injectAxe(page);
    });

    test('performs login and passes accessibility audit', async ({ page }) => {
        await expect(page.locator('text=Sign in with SSO')).toBeVisible();

        // Simulated login
        await page.click('text=Sign in with SSO');
        await page.waitForTimeout(1000);

        // Verify login success
        await expect(page.locator('text=Welcome')).toBeVisible();

        // Run accessibility audit
        await checkA11y(page, undefined, {
            detailedReport: true,
            detailedReportOptions: { html: true },
        });
    });
});
