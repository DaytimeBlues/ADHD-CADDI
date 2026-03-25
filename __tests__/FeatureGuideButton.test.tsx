import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { FeatureGuideButton } from '../src/components/tutorial/FeatureGuideButton';

describe('FeatureGuideButton', () => {
  it('uses Tutorial as the primary default label', () => {
    render(
      <FeatureGuideButton
        onPress={jest.fn()}
        accessibilityLabel="Open tutorial"
        testID="feature-guide-button"
      />,
    );

    expect(screen.getByText('TUTORIAL')).toBeTruthy();
  });

  it('shows Replay Tutorial as the secondary replay label', () => {
    const onPress = jest.fn();

    render(
      <FeatureGuideButton
        onPress={onPress}
        accessibilityLabel="Replay tutorial"
        testID="feature-guide-button"
        label="Replay Tutorial"
        isSecondary
      />,
    );

    fireEvent.press(screen.getByTestId('feature-guide-button'));

    expect(screen.getByText('REPLAY TUTORIAL')).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
