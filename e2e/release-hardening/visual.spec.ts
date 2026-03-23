import { test, expect } from './support/issueArtifacts';
import { APP_ROUTES, gotoAnonymousAppShell } from './support/appHarness';

test.describe('Release hardening visual @release @visual', () => {
  test('Login screen remains visually stable', async ({ page }) => {
    await page.goto(APP_ROUTES.login);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('login-screen.png', {
      fullPage: true,
    });
  });

  test('Pomodoro screen remains visually stable in anonymous app shell', async ({
    page,
  }) => {
    await gotoAnonymousAppShell(page);
    await page.getByTestId('mode-pomodoro').click();
    await expect(page).toHaveURL(/\/pomodoro$/);

    await expect(
      page.locator('[aria-label="Pomodoro screen"]'),
    ).toHaveScreenshot('pomodoro-screen.png', {
      animations: 'disabled',
    });
  });
});
