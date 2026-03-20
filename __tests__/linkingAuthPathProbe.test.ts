jest.mock('../src/utils/PlatformUtils', () => ({
  isWeb: true,
  isAndroid: false,
  isIOS: false,
}));

import { appLinking } from '../src/navigation/linking';
import { ROUTES } from '../src/navigation/routes';

describe('linking auth path probe', () => {
  it('prints auth and main paths for current linking config', () => {
    const authState = {
      stale: false,
      type: 'stack',
      key: 'root',
      index: 0,
      routeNames: [ROUTES.AUTH, ROUTES.MAIN],
      routes: [
        {
          key: 'auth',
          name: ROUTES.AUTH,
          state: {
            stale: false,
            type: 'stack',
            key: 'auth-stack',
            index: 0,
            routeNames: [ROUTES.LOGIN],
            routes: [{ key: 'login', name: ROUTES.LOGIN }],
          },
        },
      ],
    };

    const mainState = {
      stale: false,
      type: 'stack',
      key: 'root',
      index: 0,
      routeNames: [ROUTES.AUTH, ROUTES.MAIN],
      routes: [
        {
          key: 'main',
          name: ROUTES.MAIN,
          state: {
            stale: false,
            type: 'tab',
            key: 'main-tabs',
            index: 0,
            routeNames: [
              ROUTES.HOME,
              ROUTES.FOCUS,
              ROUTES.TASKS,
              ROUTES.CALENDAR,
              ROUTES.CHAT,
            ],
            routes: [{ key: 'home', name: ROUTES.HOME }],
          },
        },
      ],
    };

    // eslint-disable-next-line no-console
    console.log(
      'AUTH_PATH',
      appLinking.getPathFromState?.(authState as never, appLinking.config),
    );
    // eslint-disable-next-line no-console
    console.log(
      'MAIN_PATH',
      appLinking.getPathFromState?.(mainState as never, appLinking.config),
    );
  });
});
