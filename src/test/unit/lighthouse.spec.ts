// tests/multi-page-audit.spec.ts
import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
import { runAudit } from '@/utils/auditUtils';

const pagesToTest = [
    { path: '/', label: 'home' },
    { path: '/other', label: 'other' },
];

test.describe('Multi-page Lighthouse + Axe Audit', () => {
    for (const { path, label } of pagesToTest) {
        test(`${label} page audit`, async ({ page }) => {
            await page.goto(`http://localhost:4173${path}`);

            // Axe accessibility check
            await injectAxe(page);
            await checkA11y(page, undefined, {
                detailedReport: true,
                detailedReportOptions: { html: true },
            });

            // Lighthouse audit
            await runAudit(page, label);
        });
    }
});
