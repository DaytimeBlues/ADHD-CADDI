import fs from 'fs';
import path from 'path';
import {
  BrowserContext,
  Page,
  TestInfo,
  expect,
  test as base,
} from '@playwright/test';

type ConsoleEntry = {
  type: string;
  text: string;
  location?: string;
};

type NetworkFailure = {
  url: string;
  method: string;
  resourceType: string;
  failureText: string;
};

type RouteState = {
  routeName: string | null;
  pathName: string | null;
};

type IssueCategory =
  | 'runtime'
  | 'network/CORS'
  | 'selector/interaction'
  | 'assertion/content'
  | 'visual'
  | 'accessibility'
  | 'auth/session'
  | 'skipped-opportunistic-auth';

type IssueArtifact = {
  suiteName: string;
  testName: string;
  timestamp: string;
  status: string;
  expectedStatus: string;
  issueType: IssueCategory;
  summary: string;
  url: string | null;
  documentTitle: string | null;
  route: RouteState;
  console: ConsoleEntry[];
  pageErrors: string[];
  failedRequests: NetworkFailure[];
  screenshotPath: string | null;
  tracePath: string | null;
  failureMessage: string | null;
};

export type BrowserIssueCapture = {
  console: ConsoleEntry[];
  pageErrors: string[];
  failedRequests: NetworkFailure[];
};

type DiagnosticsFixtures = {
  issueCapture: BrowserIssueCapture;
  captureArtifacts: void;
};

const ISSUE_ROOT_DIR = path.resolve(
  process.cwd(),
  'output',
  'playwright',
  'issues',
);

const ensureDirectory = (targetDir: string) => {
  fs.mkdirSync(targetDir, { recursive: true });
};

const toFileSafeName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

const inferIssueType = (testInfo: TestInfo): IssueCategory => {
  const text = [
    testInfo.title,
    testInfo.error?.message ?? '',
    testInfo.error?.stack ?? '',
  ]
    .join('\n')
    .toLowerCase();

  if (text.includes('a11y') || text.includes('axe')) {
    return 'accessibility';
  }
  if (text.includes('screenshot') || text.includes('visual')) {
    return 'visual';
  }
  if (
    text.includes('storage state') ||
    text.includes('session') ||
    text.includes('login') ||
    text.includes('auth')
  ) {
    return 'auth/session';
  }
  if (
    text.includes('request') ||
    text.includes('network') ||
    text.includes('cors') ||
    text.includes('fetch')
  ) {
    return 'network/CORS';
  }
  if (
    text.includes('locator') ||
    text.includes('to be visible') ||
    text.includes('click') ||
    text.includes('timeout')
  ) {
    return 'selector/interaction';
  }
  if (text.includes('pageerror') || text.includes('exception')) {
    return 'runtime';
  }

  return 'assertion/content';
};

const getRouteState = (page: Page): RouteState => {
  try {
    const currentUrl = new URL(page.url());
    const title = page.url();
    return {
      routeName: title.split('/').filter(Boolean).at(-1) ?? 'Home',
      pathName: currentUrl.pathname,
    };
  } catch {
    return {
      routeName: null,
      pathName: null,
    };
  }
};

const createSummary = (
  testInfo: TestInfo,
  category: IssueCategory,
  url: string | null,
) => {
  const firstLine = testInfo.error?.message?.split('\n')[0]?.trim();
  if (firstLine) {
    return `${category} failure on ${url ?? 'unknown URL'}: ${firstLine}`;
  }
  return `${category} failure on ${url ?? 'unknown URL'}`;
};

const beginCapture = (page: Page): BrowserIssueCapture => {
  const capture: BrowserIssueCapture = {
    console: [],
    pageErrors: [],
    failedRequests: [],
  };

  page.on('console', (message) => {
    const type = message.type();
    if (type !== 'warning' && type !== 'error') {
      return;
    }

    const location = message.location();
    capture.console.push({
      type,
      text: message.text(),
      location:
        location.url && location.lineNumber !== undefined
          ? `${location.url}:${location.lineNumber}`
          : location.url || undefined,
    });
  });

  page.on('pageerror', (error) => {
    capture.pageErrors.push(error.message);
  });

  page.on('requestfailed', (request) => {
    capture.failedRequests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      failureText: request.failure()?.errorText ?? 'requestfailed',
    });
  });

  return capture;
};

const stopTracing = async (context: BrowserContext, testInfo: TestInfo) => {
  const tracePath = path.join(testInfo.outputDir, 'trace.zip');
  if (testInfo.status !== testInfo.expectedStatus) {
    await context.tracing.stop({ path: tracePath });
    return tracePath;
  }

  await context.tracing.stop();
  return null;
};

const writeIssueArtifact = async (
  page: Page,
  testInfo: TestInfo,
  issueCapture: BrowserIssueCapture,
  tracePath: string | null,
) => {
  if (testInfo.status === testInfo.expectedStatus) {
    return;
  }

  ensureDirectory(ISSUE_ROOT_DIR);

  let screenshotPath: string | null = null;
  try {
    screenshotPath = path.join(testInfo.outputDir, 'issue-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch {
    screenshotPath = null;
  }

  let documentTitle: string | null = null;
  try {
    documentTitle = await page.title();
  } catch {
    documentTitle = null;
  }

  const url = page.isClosed() ? null : page.url();
  const issueType = inferIssueType(testInfo);
  const issue: IssueArtifact = {
    suiteName: testInfo.titlePath[0] ?? 'playwright',
    testName: testInfo.title,
    timestamp: new Date().toISOString(),
    status: testInfo.status ?? 'unknown',
    expectedStatus: testInfo.expectedStatus,
    issueType,
    summary: createSummary(testInfo, issueType, url),
    url,
    documentTitle,
    route: getRouteState(page),
    console: issueCapture.console,
    pageErrors: issueCapture.pageErrors,
    failedRequests: issueCapture.failedRequests,
    screenshotPath,
    tracePath,
    failureMessage: testInfo.error?.message ?? null,
  };

  const issuePath = path.join(
    ISSUE_ROOT_DIR,
    `${toFileSafeName(testInfo.title)}.json`,
  );
  fs.writeFileSync(issuePath, JSON.stringify(issue, null, 2));
  await testInfo.attach('issue-json', {
    path: issuePath,
    contentType: 'application/json',
  });
};

export const writeStructuredSkipNote = (
  fileName: string,
  payload: Record<string, unknown>,
) => {
  ensureDirectory(ISSUE_ROOT_DIR);
  const targetPath = path.join(
    ISSUE_ROOT_DIR,
    `${toFileSafeName(fileName)}.json`,
  );
  fs.writeFileSync(targetPath, JSON.stringify(payload, null, 2));
  return targetPath;
};

export const assertNoCriticalBrowserIssues = async ({
  issueCapture,
  allowWarnings = [],
  allowPageErrors = [],
}: {
  issueCapture: BrowserIssueCapture;
  allowWarnings?: RegExp[];
  allowPageErrors?: RegExp[];
}) => {
  const disallowedConsole = issueCapture.console.filter((entry) => {
    if (entry.type !== 'error' && entry.type !== 'warning') {
      return false;
    }

    return !allowWarnings.some((pattern) => pattern.test(entry.text));
  });
  const disallowedPageErrors = issueCapture.pageErrors.filter(
    (entry) => !allowPageErrors.some((pattern) => pattern.test(entry)),
  );

  await expect
    .soft(
      disallowedConsole,
      'Unexpected console warnings/errors should stay at zero.',
    )
    .toHaveLength(0);
  await expect
    .soft(
      disallowedPageErrors,
      'Unexpected uncaught page errors should stay at zero.',
    )
    .toHaveLength(0);
};

export const test = base.extend<DiagnosticsFixtures>({
  issueCapture: async ({ page }, use) => {
    const capture = beginCapture(page);
    await use(capture);
  },
  captureArtifacts: [
    async ({ context, page, issueCapture }, use, testInfo) => {
      await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
      });

      await use();

      const tracePath = await stopTracing(context, testInfo);
      await writeIssueArtifact(page, testInfo, issueCapture, tracePath);
    },
    { auto: true },
  ],
});

export { expect };
