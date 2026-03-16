import { test, expect, Page } from '@playwright/test';
import {
  enableE2ETestMode,
  enableNightAweTheme,
  enableRecordingMock,
  seedAlexPersona,
} from './helpers/seed';
import { gotoAppRoot } from './helpers/navigation';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const goToTab = async (
  page: Page,
  tab: 'home' | 'focus' | 'tasks' | 'calendar',
) => {
  const tabButton = page.getByTestId(`nav-${tab}`);
  await expect(tabButton).toBeVisible();
  await tabButton.click({ force: true });
};

const navigateToScreen = async (page: Page, modeId: string) => {
  await page.getByTestId(`mode-${modeId}`).click({ force: true });
};

// ---------------------------------------------------------------------------
// 1. Theme Persistence
// ---------------------------------------------------------------------------

test.describe('Night Awe Theme — Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await enableE2ETestMode(page);
    await gotoAppRoot(page);
    await expect(page.getByTestId('home-title')).toBeVisible();
  });

  test('should persist nightAwe variant in spark-theme-storage', async ({
    page,
  }) => {
    await page.evaluate(() => {
      window.localStorage.setItem(
        'spark-theme-storage',
        JSON.stringify({
          state: { variant: 'nightAwe', _hasHydrated: false },
          version: 0,
        }),
      );
    });
    await page.reload();
    await expect(page.getByTestId('home-title')).toBeVisible({
      timeout: 15000,
    });

    const stored = await page.evaluate(() =>
      window.localStorage.getItem('spark-theme-storage'),
    );
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.variant).toBe('nightAwe');
  });

  test('should persist nightAwe after second reload', async ({ page }) => {
    await page.evaluate(() => {
      window.localStorage.setItem(
        'spark-theme-storage',
        JSON.stringify({
          state: { variant: 'nightAwe', _hasHydrated: false },
          version: 0,
        }),
      );
    });
    await page.reload();
    await page.reload();
    await expect(page.getByTestId('home-title')).toBeVisible({
      timeout: 15000,
    });

    const stored = await page.evaluate(() =>
      window.localStorage.getItem('spark-theme-storage'),
    );
    const parsed = JSON.parse(stored!);
    expect(parsed.state.variant).toBe('nightAwe');
  });
});

// ---------------------------------------------------------------------------
// 2. Home Screen Smoke under Night Awe Theme
// ---------------------------------------------------------------------------

test.describe('Night Awe Theme — Home Screen Smoke', () => {
  test.beforeEach(async ({ page }) => {
    await enableE2ETestMode(page);
    await seedAlexPersona(page);
    await enableNightAweTheme(page);
    await gotoAppRoot(page);
    await expect(page.getByTestId('home-title')).toBeVisible();
  });

  test('renders home title and streak without crash', async ({ page }) => {
    await expect(page.getByTestId('home-title')).toBeVisible();
    await expect(page.getByTestId('home-streak')).toBeVisible();
    await expect(page.getByTestId('home-streak')).toHaveText(/STREAK\.\d{3}/);
  });

  test('renders all mode cards', async ({ page }) => {
    await expect(page.getByTestId('mode-ignite')).toBeVisible();
    await expect(page.getByTestId('mode-fogcutter')).toBeVisible();
    await expect(page.getByTestId('mode-pomodoro')).toBeVisible();
    await expect(page.getByTestId('mode-anchor')).toBeVisible();
    await expect(page.getByTestId('mode-checkin')).toBeVisible();
    await expect(page.getByTestId('mode-cbtguide')).toBeVisible();
  });

  test('renders bottom tab navigation', async ({ page }) => {
    await expect(page.getByText('HOME', { exact: true })).toBeVisible();
    await expect(page.getByText('FOCUS', { exact: true })).toBeVisible();
    await expect(page.getByText('TASKS', { exact: true })).toBeVisible();
    await expect(page.getByText('CALENDAR', { exact: true })).toBeVisible();
  });

  test('renders system status badge', async ({ page }) => {
    await expect(page.getByText('SYS.ONLINE')).toBeVisible();
  });

  test('renders weekly metrics section', async ({ page }) => {
    await expect(page.getByText('WEEKLY_METRICS')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 3. Screen Rendering Smoke under Night Awe Theme
// ---------------------------------------------------------------------------

const screenRoutes: { id: string; verifyText: string }[] = [
  { id: 'ignite', verifyText: 'IGNITE_PROTOCOL' },
  { id: 'fogcutter', verifyText: 'FOG_CUTTER' },
  { id: 'pomodoro', verifyText: 'START TIMER' },
  { id: 'anchor', verifyText: 'BREATHING EXERCISES' },
  { id: 'checkin', verifyText: 'HOW ARE YOU FEELING RIGHT NOW?' },
  { id: 'cbtguide', verifyText: 'EVIDENCE-BASED STRATEGIES' },
];

test.describe('Night Awe Theme — Screen Rendering Smoke', () => {
  test.beforeEach(async ({ page }) => {
    await enableE2ETestMode(page);
    await enableRecordingMock(page);
    await seedAlexPersona(page);
    await enableNightAweTheme(page);
    await gotoAppRoot(page);
    await expect(page.getByTestId('home-title')).toBeVisible();
  });

  for (const { id, verifyText } of screenRoutes) {
    test(`renders ${id} screen without crash`, async ({ page }) => {
      await navigateToScreen(page, id);
      await expect(page.getByText(verifyText)).toBeVisible({ timeout: 15000 });
    });
  }

  test('renders BrainDump (tasks tab) without crash', async ({ page }) => {
    await goToTab(page, 'tasks');
    await expect(page.getByText('BRAIN_DUMP')).toBeVisible({ timeout: 15000 });
  });

  test('renders Calendar tab without crash', async ({ page }) => {
    await goToTab(page, 'calendar');
    await expect(page.getByText('CALENDAR')).toBeVisible({ timeout: 15000 });
  });
});
