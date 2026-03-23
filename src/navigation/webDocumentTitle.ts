import { ROUTES } from './routes';

const TITLE_BY_ROUTE: Record<string, string> = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.FOCUS]: 'Focus',
  [ROUTES.TASKS]: 'Tasks',
  [ROUTES.CALENDAR]: 'Calendar',
  [ROUTES.CHAT]: 'Chat',
  [ROUTES.CHECK_IN]: 'Check In',
  [ROUTES.CBT_GUIDE]: 'CBT Guide',
  [ROUTES.DIAGNOSTICS]: 'Diagnostics',
  [ROUTES.BRAIN_DUMP]: 'Brain Dump',
  [ROUTES.FOG_CUTTER]: 'Fog Cutter',
  [ROUTES.POMODORO]: 'Pomodoro',
  [ROUTES.ANCHOR]: 'Anchor',
  [ROUTES.INBOX]: 'Capture Inbox',
  [ROUTES.LOGIN]: 'Login',
  [ROUTES.AUTH]: 'Login',
};

type NavigationStateLike = {
  index?: number;
  routes?: Array<{
    name?: string;
    state?: NavigationStateLike;
    params?: unknown;
  }>;
};

const isNavigationStateLike = (
  value: unknown,
): value is NavigationStateLike => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return 'routes' in value;
};

const getDeepestRouteName = (
  state: NavigationStateLike | undefined,
): string | null => {
  if (!state?.routes || state.routes.length === 0) {
    return null;
  }

  const index =
    typeof state.index === 'number'
      ? Math.min(Math.max(state.index, 0), state.routes.length - 1)
      : state.routes.length - 1;
  const route = state.routes[index];

  if (route?.state) {
    return getDeepestRouteName(route.state) ?? route.name ?? null;
  }

  return route?.name ?? null;
};

export const getDocumentTitleForState = (state: unknown) => {
  const routeName = getDeepestRouteName(
    isNavigationStateLike(state) ? state : undefined,
  );
  const screenTitle = routeName
    ? TITLE_BY_ROUTE[routeName] || routeName
    : 'Home';
  return `ADHD-CADDI | ${screenTitle}`;
};
