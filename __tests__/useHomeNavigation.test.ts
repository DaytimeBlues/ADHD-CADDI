import { renderHook } from '@testing-library/react-native';
import { ROUTES } from '../src/navigation/routes';
import { useHomeNavigation } from '../src/screens/home/useHomeNavigation';

type MockNavigationNode = {
  navigate: jest.Mock;
  getState?: () => { routeNames?: string[] } | undefined;
  getParent?: () => MockNavigationNode | undefined;
};

describe('useHomeNavigation', () => {
  it('navigates through parent navigators when the route exists upstream', () => {
    const parentNavigate = jest.fn();
    const childNavigate = jest.fn();
    const parent: MockNavigationNode = {
      navigate: parentNavigate,
      getState: () => ({ routeNames: [ROUTES.DIAGNOSTICS] }),
    };
    const child: MockNavigationNode = {
      navigate: childNavigate,
      getState: () => ({ routeNames: [ROUTES.HOME] }),
      getParent: () => parent,
    };

    const { result } = renderHook(() => useHomeNavigation(child));

    result.current.navigateByRouteName(ROUTES.DIAGNOSTICS);

    expect(parentNavigate).toHaveBeenCalledWith(ROUTES.DIAGNOSTICS);
    expect(childNavigate).not.toHaveBeenCalled();
  });

  it('maps mode presses to the existing route contract', () => {
    const navigate = jest.fn();
    const navigation: MockNavigationNode = {
      navigate,
      getState: () => ({ routeNames: [ROUTES.FOG_CUTTER, ROUTES.FOCUS] }),
    };

    const { result } = renderHook(() => useHomeNavigation(navigation));

    result.current.handlePress('fogcutter');
    result.current.handlePress('resume');

    expect(navigate).toHaveBeenNthCalledWith(1, ROUTES.FOG_CUTTER);
    expect(navigate).toHaveBeenNthCalledWith(2, ROUTES.FOCUS);
  });
});
