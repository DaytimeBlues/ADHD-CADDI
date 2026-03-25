import {
  test,
  expect,
  assertNoCriticalBrowserIssues,
} from './support/issueArtifacts';
import { ALLOWED_CONSOLE_PATTERNS, APP_ROUTES } from './support/appHarness';

test.describe('Release hardening hosted entry @release @hosted @smoke', () => {
  test('hosted app loads and exposes the auth entry path', async ({
    page,
    issueCapture,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveURL(/404/);

    await page.goto(APP_ROUTES.login);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('ADHD-CADDI')).toBeVisible();
    await expect(page.getByPlaceholder('vessel@galaxy.com')).toBeVisible();
    await expect(page.getByText('LOG IN', { exact: true })).toBeVisible();

    await assertNoCriticalBrowserIssues({
      issueCapture,
      allowWarnings: ALLOWED_CONSOLE_PATTERNS,
    });
  });
});
