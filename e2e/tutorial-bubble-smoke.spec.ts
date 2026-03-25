import { expect, test } from '@playwright/test';
import { gotoAppRoot } from './helpers/navigation';
import {
  enableCosmicTheme,
  enableE2ETestMode,
  enableE2EAnonymousAppShell,
} from './helpers/seed';

test.describe('Tutorial And Bubble Smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
    await enableE2ETestMode(page);
    await enableE2EAnonymousAppShell(page);
    await enableCosmicTheme(page);
    await gotoAppRoot(page);
    await page.waitForLoadState('networkidle');
  });

  test('brain dump tutorial auto-starts and can be replayed', async ({
    page,
  }) => {
    await page.getByTestId('nav-tasks').click({ force: true });
    await expect(
      page.getByLabel('Tasks screen').getByText('TASKS'),
    ).toBeVisible();
    await page.getByTestId('open-brain-dump').click();
    await expect(
      page.getByLabel('Brain dump screen').getByText('BRAIN_DUMP'),
    ).toBeVisible();

    await expect(
      page.getByLabel('Brain dump screen').getByTestId('tutorial-overlay'),
    ).toBeVisible();
    await expect(
      page
        .getByLabel('Brain dump screen')
        .getByText('Brain Dump: Clear the Noise'),
    ).toBeVisible();

    await page.getByTestId('tutorial-next-button').click();
    await expect(
      page.getByLabel('Brain dump screen').getByText('Capture Everything'),
    ).toBeVisible();

    await page.getByTestId('tutorial-skip-button').click();
    await expect(
      page.getByLabel('Brain dump screen').getByTestId('tutorial-overlay'),
    ).not.toBeVisible();

    await page.getByTestId('brain-dump-tour-button').click();
    await expect(
      page.getByLabel('Brain dump screen').getByTestId('tutorial-overlay'),
    ).toBeVisible();
    await expect(
      page
        .getByLabel('Brain dump screen')
        .getByText('Brain Dump: Clear the Noise'),
    ).toBeVisible();
  });

  test('capture bubble saves a text note and routes into inbox', async ({
    page,
  }) => {
    await expect(page.getByTestId('capture-bubble')).toBeVisible();
    await page.getByTestId('capture-bubble').click();

    await expect(page.getByTestId('capture-drawer')).toBeVisible();
    await page.getByTestId('capture-mode-text').click();

    await page
      .getByTestId('capture-text-input')
      .fill('Playwright bubble smoke note');
    await page.getByRole('button', { name: 'SAVE TO INBOX' }).click();

    await expect(page.getByTestId('capture-drawer')).not.toBeVisible();
    await expect(page.getByTestId('capture-bubble-badge')).toBeVisible();

    await page.getByTestId('capture-bubble-badge').click();
    await expect(page.getByTestId('inbox-screen')).toBeVisible();
    await expect(page.getByText('Playwright bubble smoke note')).toBeVisible();
  });

  test('home replay guide launches tasks guide and keeps bubble out of the way', async ({
    page,
  }) => {
    await expect(page.getByText('REPLAY GUIDE')).toBeVisible();
    await page.getByTestId('home-tour-button').click();

    await expect(
      page.getByText('Choose a screen guide to replay.'),
    ).toBeVisible();
    await expect(page.getByTestId('capture-bubble')).not.toBeVisible();

    await page.getByTestId('home-guide-option-tasks-onboarding').click();
    await expect(page.getByLabel('Tasks screen')).toBeVisible();
    await expect(page.getByTestId('tutorial-overlay')).toBeVisible();
    await expect(page.getByText('Tasks: See the Work Clearly')).toBeVisible();
    await expect(page.getByTestId('capture-bubble')).not.toBeVisible();
  });

  test('disabling guided tutorials prevents auto-start but still allows manual replay', async ({
    page,
  }) => {
    await page.getByLabel('Settings and Diagnostics').click();
    await expect(page.getByText('GUIDED HELP')).toBeVisible();

    await page.getByTestId('tutorials-enabled-toggle').click();
    await page.getByLabel('Go back').click();

    await page.getByTestId('nav-tasks').click({ force: true });
    await page.getByTestId('open-brain-dump').click();
    await expect(
      page.getByLabel('Brain dump screen').getByText('BRAIN_DUMP'),
    ).toBeVisible();
    await expect(
      page.getByLabel('Brain dump screen').getByTestId('tutorial-overlay'),
    ).not.toBeVisible();

    await page.getByTestId('brain-dump-tour-button').click();
    await expect(
      page.getByLabel('Brain dump screen').getByTestId('tutorial-overlay'),
    ).toBeVisible();
  });
});
