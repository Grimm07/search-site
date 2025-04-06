# Playwright E2E Testing Setup

This section describes how to set up and run **Playwright** for end-to-end (E2E) testing with video recording and other useful features.

---

## ✅ **Installation**

### Step 1: Install Playwright as a dev dependency

Install Playwright in your project by running:

```bash
npm install --save-dev playwright
```

### Step 2: Install Playwright browser binaries

Playwright requires browser binaries for testing. Run the following command to install them:

```bash
npx playwright install
```

---

## ✅ **Configuration**

### Step 1: Create or update `playwright.config.ts`

Ensure that your `playwright.config.ts` is configured to record videos on failure (or all tests if desired). Here’s a basic configuration:

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,  // Keep headless mode for CI or local, remove for visual testing
    video: 'retain-on-failure', // Record video on failure only (set to 'on' to record always)
  },
  testDir: './tests',  // Path to your test files
  reporter: 'list',  // Simple console output or 'html' for a more detailed report
});
```

### Step 2: Create your test files

Create a test file, e.g., `simulated-search.spec.ts`, and write your E2E test scenarios.

Example:

```ts
// tests/simulated-search.spec.ts
import { test, expect } from '@playwright/test';

test('user can perform a search and see mock results', async ({ page }) => {
  // Navigate to your HomePage (update if it's nested)
  await page.goto('http://localhost:5173');  // Update with your actual dev URL

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
```

---

## ✅ **Running Tests**

### Step 1: Start your app (if not already running)

Run your Vite app to ensure it's available for Playwright to interact with:

```bash
npm run dev  # Start your Vite dev server
```

Make sure your app is running at `http://localhost:5173` or whatever URL you're using in your test.

### Step 2: Run Playwright tests

You can now run your Playwright tests with the following command:

```bash
npx playwright test
```

### Step 3: View the Results

#### Video Recording
Playwright will record a video of the browser interaction for each test. If a test fails, the video will be saved in the `playwright-report/videos` directory.

To view the video, navigate to:

```bash
open playwright-report/videos/simulated-search.spec.ts/video.webm
```

#### HTML Report (Optional)
If you configured Playwright to generate an HTML report, you can open it with:

```bash
npx playwright show-report
```

This opens a report with test status and videos for visual inspection.

---

## ✅ **CI Integration (Optional)**

### Step 1: Configure CI environment

In CI (e.g., GitHub Actions), make sure to run the tests in an environment where you have access to a virtual display for headless testing. If you're using GitHub Actions, you can use this as an example:

```yaml
name: E2E Tests with Playwright

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Install dependencies
        run: npm install
      - name: Install Playwright
        run: npx playwright install
      - name: Run Playwright tests
        run: npx playwright test
```

### Step 2: View video in CI

To access videos in CI, ensure you upload them as artifacts after test runs (if your CI tool supports it). For example, GitHub Actions can store video artifacts like this:

```yaml
      - name: Upload Playwright videos
        uses: actions/upload-artifact@v2
        with:
          name: playwright-videos
          path: playwright-report/videos/*
```

---

## ✅ **Summary**

1. **Install Playwright** as a dev dependency.
2. **Configure** `playwright.config.ts` to record videos and customize test behavior.
3. **Write Playwright tests** in your preferred test files.
4. **Run tests** using `npx playwright test`.
5. **View results** in the console or via HTML report, and view videos in case of test failures.
