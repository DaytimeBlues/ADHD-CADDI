import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for ADHD-CADDI comprehensive E2E testing.
 * Multi-browser, multi-viewport, edge-case coverage.
 * @see https://playwright.dev/docs/test-configuration
 */

const DEFAULT_WEB_BASE_URL = 'http://localhost:3000';
const WEB_SERVER_TIMEOUT_MS = 300_000;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || DEFAULT_WEB_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  outputDir: './output/playwright/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: 'output/playwright/report' }],
    ['junit', { outputFile: 'output/playwright/playwright-junit.xml' }],
    ['list'],
  ],

  use: {
    baseURL,
    trace: 'off',
    screenshot: 'off',
    video: 'retain-on-failure',
    // Capture console logs and page errors
    launchOptions: {
      logger: {
        isEnabled: () => true,
        log: (name, severity, message) => {
          if (severity === 'error' || severity === 'warning') {
            process.stdout.write(
              `[BROWSER ${severity.toUpperCase()}] ${name}: ${message}\n`,
            );
          }
        },
      },
    },
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'Tablet',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 },
      },
    },

    // Production build testing
    {
      name: 'chromium-prod',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: /.*\.prod\.spec\.ts/,
    },
  ],

  /* Run local dev server before starting tests (only for non-prod tests) */
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run web',
        url: DEFAULT_WEB_BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: WEB_SERVER_TIMEOUT_MS,
      },
});
