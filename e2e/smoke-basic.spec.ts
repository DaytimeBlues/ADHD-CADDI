import { test, expect } from '@playwright/test';

test.describe('Basic Smoke', () => {
  test('app shell loads without fatal errors', async ({ page }) => {
    const pageErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('#root')).toBeVisible();
    await expect(page).not.toHaveURL(/404/);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('Cannot GET /');
    expect(bodyText).not.toContain('Whitelabel Error Page');

    const fatal = pageErrors.filter(
      (msg) =>
        !msg.includes('ResizeObserver loop limit exceeded') &&
        !msg.includes('Missing required parameter `platform`'),
    );
    expect(fatal).toHaveLength(0);
  });

  test('critical static assets are reachable', async ({ page }) => {
    const responses: number[] = [];

    page.on('response', (response) => {
      const url = response.url();
      if (url.endsWith('.js') || url.endsWith('.css')) {
        responses.push(response.status());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    if (responses.length > 0) {
      expect(responses.some((status) => status >= 400)).toBeFalsy();
    }
  });
});
