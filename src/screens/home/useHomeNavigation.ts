import { useCallback } from 'react';
import { ROUTES } from '../../navigation/routes';

type NavigatorState = {
  routeNames?: string[];
};

export type HomeNavigationNode = {
  navigate: (routeName: string) => void;
  getState?: () => NavigatorState | undefined;
  getParent?: () => HomeNavigationNode | undefined;
};

const getRouteForMode = (modeId: string) => {
  switch (modeId) {
    case 'checkin':
      return ROUTES.CHECK_IN;
    case 'cbtguide':
      return ROUTES.CBT_GUIDE;
    case 'fogcutter':
      return ROUTES.FOG_CUTTER;
    case 'pomodoro':
      return ROUTES.POMODORO;
    case 'anchor':
      return ROUTES.ANCHOR;
    default:
      return ROUTES.FOCUS;
  }
};

export function useHomeNavigation(navigation: HomeNavigationNode) {
  const navigateByRouteName = useCallback(
    (routeName: string) => {
      let currentNavigator: HomeNavigationNode | undefined = navigation;

      while (currentNavigator) {
        const routeNames = currentNavigator.getState?.()?.routeNames;
        if (Array.isArray(routeNames) && routeNames.includes(routeName)) {
          currentNavigator.navigate(routeName);
          return;
        }
        currentNavigator = currentNavigator.getParent?.();
      }

      navigation.navigate(routeName);
    },
    [navigation],
  );

  const handlePress = useCallback(
    (modeId: string) => {
      navigateByRouteName(getRouteForMode(modeId));
    },
    [navigateByRouteName],
  );

  return {
    navigateByRouteName,
    handlePress,
  };
}
