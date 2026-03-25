import { ROUTES } from './routes';
import { isWeb } from '../utils/PlatformUtils';

const ROUTE_PATHS: Record<string, string> = {
  [ROUTES.HOME]: '/',
  [ROUTES.FOCUS]: '/focus',
  [ROUTES.TASKS]: '/tasks',
  [ROUTES.CALENDAR]: '/calendar',
  [ROUTES.CHAT]: '/chat',
  [ROUTES.CHECK_IN]: '/check-in',
  [ROUTES.CBT_GUIDE]: '/cbt-guide',
  [ROUTES.DIAGNOSTICS]: '/diagnostics',
  [ROUTES.FOG_CUTTER]: '/fog-cutter',
  [ROUTES.POMODORO]: '/pomodoro',
  [ROUTES.ANCHOR]: '/anchor',
  [ROUTES.INBOX]: '/inbox',
};

let lastPushedPath: string | null = null;
let lastPushAt = 0;

export const pushWebPathForRoute = (routeName: string) => {
  if (!isWeb || typeof window === 'undefined') {
    return;
  }

  const nextPath = ROUTE_PATHS[routeName];
  if (!nextPath || window.location.pathname === nextPath) {
    return;
  }

  const now = Date.now();
  if (lastPushedPath === nextPath && now - lastPushAt < 300) {
    return;
  }

  window.history.pushState(null, '', nextPath);
  lastPushedPath = nextPath;
  lastPushAt = now;
};
