import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { WebNavBar } from '../src/navigation/WebNavBar';

jest.mock('../src/theme/useTheme', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../src/services/HapticsService', () => ({
  __esModule: true,
  default: {
    tap: jest.fn(),
  },
}));

jest.mock('../src/utils/PlatformUtils', () => ({
  __esModule: true,
  isWeb: true,
}));

const mockUseTheme = jest.requireMock('../src/theme/useTheme')
  .useTheme as jest.Mock;

describe('WebNavBar', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      isCosmic: false,
      isNightAwe: true,
      t: {
        colors: {
          text: {
            primary: '#F6F1E7',
            secondary: '#C9D5E8',
          },
          nightAwe: {
            surface: {
              border: 'rgba(175, 199, 255, 0.16)',
            },
            feature: {
              home: '#AFC7FF',
            },
          },
        },
      },
    });
  });

  it('marks the active Night-Awe tab as selected for navigation clarity', () => {
    render(
      <WebNavBar
        state={{
          index: 0,
          key: 'tab-root',
          routeNames: ['Home', 'Focus'],
          routes: [
            { key: 'home-key', name: 'Home' },
            { key: 'focus-key', name: 'Focus' },
          ],
          stale: false,
          type: 'tab',
          history: [],
        }}
        descriptors={{}}
        insets={{ top: 0, right: 0, bottom: 0, left: 0 }}
        navigation={
          {
            emit: jest.fn(() => ({ defaultPrevented: false })),
            navigate: jest.fn(),
          } as never
        }
      />,
    );

    expect(screen.getByLabelText('Home tab').props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByLabelText('Focus tab').props.accessibilityState).toEqual(
      {
        selected: false,
      },
    );
  });
});
