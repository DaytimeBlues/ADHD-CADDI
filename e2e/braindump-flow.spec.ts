import { test, expect } from '@playwright/test';
import {
  enableE2ETestMode,
  enableE2EAnonymousAppShell,
  enableCosmicTheme,
} from './helpers/seed';

test.describe('BrainDump Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await enableE2ETestMode(page);
    await enableE2EAnonymousAppShell(page);
    await enableCosmicTheme(page);
    await page.goto('/'); // Second goto to ensure init scripts applied and storage clean
    await expect(page.getByTestId('home-title')).toBeVisible({
      timeout: 15000,
    });
    await page.getByTestId('nav-tasks').click({ force: true });
    await expect(page.getByLabel('Tasks screen')).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId('open-brain-dump').click();
    await expect(page.getByText('BRAIN_DUMP')).toBeVisible({ timeout: 10000 });

    const tutorialOverlay = page
      .getByLabel('Brain dump screen')
      .getByTestId('tutorial-overlay');
    if (await tutorialOverlay.isVisible().catch(() => false)) {
      await page.getByTestId('tutorial-skip-button').click();
      await expect(tutorialOverlay).not.toBeVisible();
    }
  });

  test('add item then delete item', async ({ page }) => {
    const brainDumpInput = page
      .getByLabel('Brain dump screen')
      .getByLabel('Add a brain dump item');
    await brainDumpInput.fill('Playwright brain dump item');
    await brainDumpInput.press('Enter');
    await expect(page.getByText('Playwright brain dump item')).toBeVisible();

    // Dismiss guide if it appears (first item added)
    const ackButton = page.getByRole('button', { name: 'Dismiss guidance' });
    if (await ackButton.isVisible()) {
      await ackButton.click();
      await page.waitForTimeout(200); // Wait for item layout to stabilize after banner removal
    }

    const addedItem = page
      .getByTestId('brain-dump-item')
      .filter({ hasText: 'Playwright brain dump item' });
    await expect(addedItem).toHaveCount(1);
    const deleteButton = addedItem.getByTestId('delete-item-button').first();
    await deleteButton.evaluate((el) => {
      (el as HTMLElement).click();
    });
    await expect(addedItem).toHaveCount(0, { timeout: 10000 });
  });

  test('items persist across reload', async ({ page }) => {
    const brainDumpInput = page
      .getByLabel('Brain dump screen')
      .getByLabel('Add a brain dump item');
    await brainDumpInput.fill('Persistence item');
    await brainDumpInput.press('Enter');
    await expect(
      page.getByLabel('Brain dump screen').getByText('Persistence item'),
    ).toBeVisible();
    await page.waitForTimeout(450);

    await page.reload();
    await page.getByTestId('nav-tasks').click({ force: true });
    await expect(page.getByLabel('Tasks screen')).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId('open-brain-dump').click();
    await expect(page.getByText('BRAIN_DUMP')).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByLabel('Brain dump screen').getByText('Persistence item'),
    ).toBeVisible();
  });

  test('integration panel shows branded Google and Todoist logos', async ({
    page,
  }) => {
    const integrationsPanel = page.getByTestId('integrations-panel');
    await expect(integrationsPanel).toBeVisible();
    await expect(page.getByLabel('Google logo')).toBeVisible();
    await expect(page.getByLabel('Todoist logo')).toBeVisible();
    await expect(integrationsPanel.getByText('Google Tasks')).toBeVisible();
    await expect(integrationsPanel.getByText('Todoist').first()).toBeVisible();
  });
});
