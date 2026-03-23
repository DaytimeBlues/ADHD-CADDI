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
    await expect(page.getByText('BRAIN_DUMP')).toBeVisible({ timeout: 10000 });
  });

  test('add item then delete item', async ({ page }) => {
    await page
      .getByPlaceholder('> INPUT_DATA...')
      .fill('Playwright brain dump item');
    await page.getByPlaceholder('> INPUT_DATA...').press('Enter');
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
    await page.getByPlaceholder('> INPUT_DATA...').fill('Persistence item');
    await page.getByPlaceholder('> INPUT_DATA...').press('Enter');
    await expect(page.getByText('Persistence item')).toBeVisible();
    await page.waitForTimeout(450);

    await page.reload();
    await page.getByTestId('nav-tasks').click({ force: true });
    await expect(page.getByText('BRAIN_DUMP')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Persistence item')).toBeVisible();
  });
});
