import React from 'react';
import { render } from '@testing-library/react-native';
import { FogCutterTaskComposer } from '../fog-cutter/FogCutterTaskComposer';

jest.mock('../../theme/useTheme', () => ({
  useTheme: () => ({
    variant: 'linear',
    isCosmic: false,
    isNightAwe: false,
    t: {
      colors: {
        text: {
          muted: '#94A3B8',
          secondary: '#94A3B8',
        },
      },
    },
  }),
}));

jest.mock('../../components/ui/LinearButton', () => ({
  LinearButton: ({
    title,
    children,
    onPress,
    accessibilityLabel,
  }: {
    title?: string;
    children?: React.ReactNode;
    onPress?: () => void;
    accessibilityLabel?: string;
  }) => {
    const { Text: MockText, TouchableOpacity } = require('react-native');

    return (
      <TouchableOpacity
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
      >
        <MockText>{title}</MockText>
        {children}
      </TouchableOpacity>
    );
  },
}));

jest.mock('../../components/ui/Shimmer', () => ({
  Shimmer: () => {
    const { View } = require('react-native');
    return <View />;
  },
}));

jest.mock('../../ui/cosmic', () => ({
  RuneButton: ({
    children,
    onPress,
    accessibilityLabel,
  }: {
    children?: React.ReactNode;
    onPress?: () => void;
    accessibilityLabel?: string;
  }) => {
    const { Text: MockText, TouchableOpacity } = require('react-native');

    return (
      <TouchableOpacity
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
      >
        <MockText>{children}</MockText>
      </TouchableOpacity>
    );
  },
  GlowCard: ({ children }: { children?: React.ReactNode }) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('../../components/ui/AnimatedMicroStep', () => ({
  AnimatedMicroStep: ({ item }: { item: string }) => {
    const { Text: MockText } = require('react-native');
    return <MockText>{item}</MockText>;
  },
}));

describe('FogCutterTaskComposer', () => {
  it('uses truthful step-breakdown copy', () => {
    const view = render(
      <FogCutterTaskComposer
        focusedInput={null}
        isAiLoading={false}
        isCosmic={false}
        isNightAwe={false}
        microSteps={['Open your email app']}
        newStep=""
        onAddMicroStep={jest.fn()}
        onAddTask={jest.fn()}
        onAiBreakdownPress={jest.fn()}
        onFocusInput={jest.fn()}
        onNewStepChange={jest.fn()}
        onTaskChange={jest.fn()}
        saveDisabled={false}
        setTaskInputRef={React.createRef()}
        task="Write an email"
      />,
    );

    expect(view.getByText('BREAK INTO STEPS')).toBeTruthy();
    expect(
      view.getByText('Turn one task into a small starter plan.'),
    ).toBeTruthy();
    expect(
      view.getByText('Use this when the next step feels too big.'),
    ).toBeTruthy();
    expect(
      view.getByText('You can edit the steps after they appear.'),
    ).toBeTruthy();
    expect(
      view.getByText("Starter steps ready. Adjust anything that doesn't fit."),
    ).toBeTruthy();

    expect(view.queryByText('GENERATE STEPS')).toBeNull();
    expect(view.queryByText('ANALYSING...')).toBeNull();
    expect(view.queryByText(/\bAI\b/i)).toBeNull();
  });
});
