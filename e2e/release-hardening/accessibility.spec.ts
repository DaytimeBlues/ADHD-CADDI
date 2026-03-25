import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './support/issueArtifacts';
import { gotoAnonymousAppShell, APP_ROUTES } from './support/appHarness';

test.describe('Release hardening accessibility @release @a11y', () => {
  test('Login has no critical accessibility violations', async ({ page }) => {
    await page.goto(APP_ROUTES.login);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(
      (violation) => violation.impact === 'critical',
    );

    expect(criticalViolations).toHaveLength(0);
  });

  test('Home and Fog Cutter have no critical accessibility violations in the anonymous app shell', async ({
    page,
  }) => {
    await gotoAnonymousAppShell(page);

    const homeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(
      homeResults.violations.filter(
        (violation) => violation.impact === 'critical',
      ),
    ).toHaveLength(0);

    await page.goto(APP_ROUTES.fogCutter);
    await page.waitForLoadState('networkidle');

    const fogCutterResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(
      fogCutterResults.violations.filter(
        (violation) => violation.impact === 'critical',
      ),
    ).toHaveLength(0);
  });
});
