import {
  test,
  expect,
  assertNoCriticalBrowserIssues,
} from './support/issueArtifacts';
import {
  ALLOWED_CONSOLE_PATTERNS,
  APP_ROUTES,
  gotoAnonymousAppShell,
  prepareAnonymousMinimalShell,
} from './support/appHarness';

test.describe('Release hardening anonymous mandatory @release @smoke', () => {
  test('hosted or local app shell reaches Home and keeps route/title in sync', async ({
    page,
    issueCapture,
  }) => {
    await gotoAnonymousAppShell(page);

    await expect(page.getByTestId('home-title')).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/ADHD-CADDI \| Home/);

    await page.getByTestId('nav-focus').click();
    await expect(page.getByText('IGNITE_PROTOCOL')).toBeVisible();
    await expect(page).toHaveURL(/\/focus$/);
    await expect(page).toHaveTitle(/ADHD-CADDI \| Focus/);

    await page.goBack();
    await expect(page.getByTestId('home-title')).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/ADHD-CADDI \| Home/);

    await page.goForward();
    await expect(page.getByText('IGNITE_PROTOCOL').first()).toBeVisible();
    await expect(page).toHaveURL(/\/focus$/);
    await expect(page).toHaveTitle(/ADHD-CADDI \| Focus/);

    await assertNoCriticalBrowserIssues({
      issueCapture,
      allowWarnings: ALLOWED_CONSOLE_PATTERNS,
    });
  });

  test('Fog Cutter example flow generates a usable breakdown and degrades safely on network failure', async ({
    page,
    issueCapture,
  }) => {
    await page.route('**/api/microsteps', async (route) => {
      await route.abort('failed');
    });

    await prepareAnonymousMinimalShell(page);
    await page.goto(APP_ROUTES.fogCutter);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('FOG_CUTTER')).toBeVisible();
    await page.getByText('Write an email', { exact: true }).click();
    await page.getByRole('button', { name: /Break task into steps/i }).click();

    await expect(
      page.getByText('Here is a quick breakdown to get you moving.'),
    ).toBeVisible();
    await expect(
      page.getByText('Open your email app and start a new draft'),
    ).toBeVisible();
    await expect(
      page.getByText('Read it once, then send or save the draft'),
    ).toBeVisible();
    await expect(page.getByText(/AI breakdown failed/i)).toHaveCount(0);

    expect(
      issueCapture.failedRequests.some((request) =>
        request.url.includes('/api/microsteps'),
      ),
    ).toBeTruthy();

    await assertNoCriticalBrowserIssues({
      issueCapture,
      allowWarnings: [
        ...ALLOWED_CONSOLE_PATTERNS,
        /Failed to load resource: net::ERR_FAILED/i,
        /FogCutterAI unavailable, using fallback steps/i,
      ],
      allowPageErrors: [],
    });
  });

  test('Pomodoro shows timer state and back behavior', async ({
    page,
    issueCapture,
  }) => {
    await gotoAnonymousAppShell(page);
    await page.getByTestId('mode-pomodoro').click();
    await expect(page).toHaveURL(/\/pomodoro$/);
    await expect(page.getByTestId('timer-display')).toBeVisible();
    await expect(page.getByTestId('pomodoro-phase')).toContainText(
      /FOCUS|WORK/i,
    );

    await page.goBack();
    await expect(page.getByTestId('home-title')).toBeVisible();
    await expect(page).toHaveURL(/\/$/);

    await assertNoCriticalBrowserIssues({
      issueCapture,
      allowWarnings: ALLOWED_CONSOLE_PATTERNS,
    });
  });

  test('Anchor starts Box Breathing intentionally and shows guided state', async ({
    page,
    issueCapture,
  }) => {
    await gotoAnonymousAppShell(page, APP_ROUTES.anchor);

    await expect(page.getByText('ANCHOR')).toBeVisible();
    await page.getByTestId('anchor-pattern-box').click();
    await expect(page.getByText('BOX BREATHING')).toBeVisible();
    await expect(page.getByText('BREATHE IN', { exact: true })).toBeVisible();
    await expect(page.getByTestId('anchor-count')).toBeVisible();

    await assertNoCriticalBrowserIssues({
      issueCapture,
      allowWarnings: ALLOWED_CONSOLE_PATTERNS,
    });
  });

  test('Check In recommendation can route into Brain Dump and Brain Dump stays usable', async ({
    page,
    issueCapture,
  }) => {
    await gotoAnonymousAppShell(page, APP_ROUTES.checkIn);

    await expect(page.getByTestId('checkin-subtitle')).toBeVisible();
    await page.getByTestId('mood-option-3').click();
    await page.getByTestId('energy-option-3').click();
    await expect(page.getByTestId('recommendation-subtitle')).toBeVisible();
    await expect(page.getByText('BRAIN DUMP', { exact: true })).toBeVisible();

    await page.getByTestId('recommendation-action-button').click();
    await expect(page.getByText('BRAIN_DUMP')).toBeVisible();
    await expect(page.getByTestId('brain-dump-tour-button')).toBeVisible();

    await assertNoCriticalBrowserIssues({
      issueCapture,
      allowWarnings: [
        ...ALLOWED_CONSOLE_PATTERNS,
        /blocked by CORS policy/i,
        /Failed to load resource: net::ERR_FAILED/i,
        /CheckInInsight unavailable/i,
      ],
    });
  });

  test('public auth path is present and not obviously broken', async ({
    page,
    issueCapture,
  }) => {
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
