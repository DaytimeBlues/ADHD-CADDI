import {
  test,
  expect,
  writeStructuredSkipNote,
} from './support/issueArtifacts';
import { discoverAuthState } from './support/authState';

test.describe('Release hardening authenticated opportunistic @release @auth', () => {
  test('uses an existing valid auth storage state if present', async ({
    browser,
  }, testInfo) => {
    const discovery = discoverAuthState();

    if (!discovery.storageStatePath) {
      const notePath = writeStructuredSkipNote('opportunistic-auth-skip', {
        suiteName: 'Release hardening authenticated opportunistic',
        timestamp: new Date().toISOString(),
        skippedTests: [testInfo.title],
        reason: 'no existing authenticated session/storage state found',
        checkedLocations: discovery.checkedLocations,
        note: 'No credentials were invented and no fake auth was created.',
        issueType: 'skipped-opportunistic-auth',
      });

      await testInfo.attach('opportunistic-auth-skip', {
        path: notePath,
        contentType: 'application/json',
      });

      test.skip(
        true,
        'No existing authenticated session/storage state found; skipping opportunistic auth coverage.',
      );
    }

    const context = await browser.newContext({
      storageState: discovery.storageStatePath!,
      baseURL: testInfo.project.use.baseURL,
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('ADHD-CADDI')).toHaveCount(0);
    await expect(page.getByTestId('home-title')).toBeVisible();
    await expect(page).toHaveTitle(/ADHD-CADDI \| Home/);

    await page.getByTestId('nav-tasks').click();
    await expect(page.getByText('TASKS')).toBeVisible();
    await page.getByTestId('open-brain-dump').click();
    await expect(page.getByText('BRAIN_DUMP')).toBeVisible();

    await context.close();
  });
});
