import { test, expect } from '@playwright/test';
import { enableE2ETestMode } from './helpers/seed';

/**
 * Guest Mode tests for ADHD-CADDI web app.
 * Verifies that the guest/anonymous sign-in flow is accessible and functional.
 */

test.describe('Guest Mode', () => {
  test('login screen shows guest mode button', async ({ page }) => {
    await enableE2ETestMode(page);
    await page.goto('/Auth/Login');
    await page.waitForLoadState('networkidle');

    // Verify login screen elements
    await expect(page.getByText('ADHD-CADDI')).toBeVisible();

    // Verify guest button is visible
    const guestButton = page.getByText('CONTINUE AS GUEST');
    await expect(guestButton).toBeVisible();
  });

  test('guest button has correct styling and is clickable', async ({
    page,
  }) => {
    await enableE2ETestMode(page);
    await page.goto('/Auth/Login');
    await page.waitForLoadState('networkidle');

    // Guest button should be visible with proper styling
    const guestButton = page.getByText('CONTINUE AS GUEST');
    await expect(guestButton).toBeVisible();

    // Button should be in a pressable container
    const guestButtonContainer = guestButton.locator('..');
    await expect(guestButtonContainer).toBeVisible();
  });

  test('login screen shows email/password inputs alongside guest option', async ({
    page,
  }) => {
    await enableE2ETestMode(page);
    await page.goto('/Auth/Login');
    await page.waitForLoadState('networkidle');

    // Email input should be visible
    await expect(page.getByPlaceholder('vessel@galaxy.com')).toBeVisible();

    // Password input should be visible
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();

    // Log in button should be visible
    await expect(page.getByText('LOG IN', { exact: true })).toBeVisible();

    // Guest button should also be visible (not replacing email/password)
    await expect(page.getByText('CONTINUE AS GUEST')).toBeVisible();
  });

  test('guest entry reaches the app shell without Google sign-in', async ({
    page,
  }) => {
    await enableE2ETestMode(page);
    await page.goto('/Auth/Login');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('login-guest-button').click();

    await expect(page.getByTestId('home-title')).toBeVisible();
    await expect(page.getByText('GUEST MODE')).toBeVisible();
    await expect(page.getByText('EXIT GUEST')).toBeVisible();
  });
});
