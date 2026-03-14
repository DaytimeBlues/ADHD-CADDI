import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { HomeHeader } from '../src/screens/home/HomeHeader';

jest.mock('../src/components/AppIcon', () => 'AppIcon');

const styles = {
  header: {},
  title: {},
  systemStatusRow: {},
  systemStatusText: {},
  statusDot: {},
  headerRight: {},
  settingsButton: {},
  settingsButtonText: { color: '#fff' },
  streakBadge: {},
  streakText: {},
};

describe('HomeHeader', () => {
  it('preserves the streak test ids and opens diagnostics', () => {
    const onOpenDiagnostics = jest.fn();

    render(
      <HomeHeader
        streak={7}
        styles={styles}
        onOpenDiagnostics={onOpenDiagnostics}
      />,
    );

    expect(screen.getByTestId('home-streak-badge')).toBeTruthy();
    expect(screen.getByTestId('home-streak')).toHaveTextContent('STREAK.007');

    fireEvent.press(screen.getByLabelText('Settings and Diagnostics'));
    expect(onOpenDiagnostics).toHaveBeenCalledTimes(1);
  });
});
