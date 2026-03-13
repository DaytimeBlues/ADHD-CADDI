import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemeSection } from '../src/screens/diagnostics/components/ThemeSection';

jest.mock('../src/theme/useTheme', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../src/ui/cosmic', () => {
  const { Pressable } = require('react-native');

  return {
    GlowCard: ({
      children,
      onPress,
      accessibilityLabel,
      accessibilityHint,
      accessibilityRole,
      accessibilityState,
      testID,
    }: {
      children: React.ReactNode;
      onPress?: () => void;
      accessibilityLabel?: string;
      accessibilityHint?: string;
      accessibilityRole?: string;
      accessibilityState?: Record<string, boolean>;
      testID?: string;
    }) => (
      <Pressable
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        testID={testID}
      >
        {children}
      </Pressable>
    ),
  };
});

const mockUseTheme = jest.requireMock('../src/theme/useTheme')
  .useTheme as jest.Mock;

describe('ThemeSection', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      isNightAwe: true,
      t: {
        colors: {
          text: {
            primary: '#F6F1E7',
            secondary: '#C9D5E8',
            onAccent: '#08111E',
          },
          nightAwe: {
            feature: {
              home: '#AFC7FF',
            },
            surface: {
              raised: 'rgba(19, 34, 56, 0.92)',
              border: 'rgba(175, 199, 255, 0.16)',
            },
          },
        },
      },
    });
  });

  it('labels the selected theme as current for quick scanning', () => {
    render(
      <ThemeSection
        themeOptions={[
          {
            variant: 'nightAwe',
            label: 'Night Awe',
            description: 'Grounded horizon tones with a calm, natural sky',
            preview: { background: '#08111E', accent: '#AFC7FF' },
            selected: true,
          },
        ]}
        onSelectTheme={jest.fn(async () => undefined)}
      />,
    );

    expect(screen.getByText('CURRENT')).toBeTruthy();
    expect(
      screen.getByLabelText('Select Night Awe theme').props.accessibilityState,
    ).toEqual({
      selected: true,
    });
  });
});
