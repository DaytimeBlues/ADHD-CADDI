import { Page } from '@playwright/test';
import {
  enableE2EAnonymousAppShell,
  enableE2ETestMode,
  seedMinimalAppState,
  seedAlexPersona,
} from '../../helpers/seed';

export const ALLOWED_CONSOLE_PATTERNS = [
  /ResizeObserver loop limit exceeded/i,
  /Missing required parameter `platform`/i,
  /"shadow\*" style props are deprecated/i,
  /props\.pointerEvents is deprecated/i,
  /Google client IDs are not configured/i,
  /EXPO_PUBLIC_SENTRY_DSN is not configured/i,
  /WebMCP: API not found, retrying/i,
  /WebMCP: Skipping tool registration/i,
  /Started timer-service/i,
  /Stopped timer-service/i,
  /Paused timer-service/i,
];

export const APP_ROUTES = {
  home: '/',
  focus: '/focus',
  tasks: '/tasks',
  brainDump: '/tasks',
  fogCutter: '/fog-cutter',
  pomodoro: '/pomodoro',
  anchor: '/anchor',
  checkIn: '/check-in',
  login: '/Auth/Login',
} as const;

export const prepareAnonymousAppShell = async (page: Page) => {
  await enableE2ETestMode(page);
  await enableE2EAnonymousAppShell(page);
  await seedAlexPersona(page);
};

export const prepareAnonymousMinimalShell = async (page: Page) => {
  await enableE2ETestMode(page);
  await enableE2EAnonymousAppShell(page);
  await seedMinimalAppState(page);
};

export const gotoAnonymousAppShell = async (
  page: Page,
  route = APP_ROUTES.home,
) => {
  await prepareAnonymousAppShell(page);
  await page.goto(route);
  await page.waitForLoadState('networkidle');
};

export const expectRouteAndTitle = async ({
  page,
  expectedPath,
  expectedTitle,
}: {
  page: Page;
  expectedPath: string;
  expectedTitle: RegExp;
}) => {
  await page.waitForURL((url) => url.pathname === expectedPath);
  await page.waitForFunction(
    ({ source, flags }) => new RegExp(source, flags).test(document.title),
    {
      source: expectedTitle.source,
      flags: expectedTitle.flags,
    },
  );
};
