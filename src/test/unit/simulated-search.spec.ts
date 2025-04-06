// tests/simulated-search.spec.ts
import { test, expect } from '@playwright/test';

test('user can perform a search and see mock results', async ({ page }) => {
    // Navigate to your HomePage (update if it's nested)
    await page.goto('http://localhost:5173/');

    // Step 1: Find the search input
    const input = await page.getByRole('textbox', { name: /search/i });

    // Step 2: Type a query
    await input.fill('Mock Result A');

    // Step 3: Submit the search
    await input.press('Enter');

    // Step 4: Wait for loading spinner
    await page.getByRole('progressbar');

    // Step 5: Wait for mock result to appear (after your internal 1000ms delay)
    await expect(page.getByText('Mock Result A')).toBeVisible();
});
