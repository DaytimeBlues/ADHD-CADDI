import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { BrainDumpStatusSection } from '../src/screens/brain-dump/BrainDumpStatusSection';

jest.mock('../src/components/brain-dump', () => {
  const { Text } = require('react-native');
  return {
    BrainDumpActionBar: () => <Text>ACTION_BAR</Text>,
  };
});

const styles = {
  loadingContainer: {},
  loadingText: {},
  errorContainer: {},
  errorText: {},
  connectButton: {},
  connectButtonDisabled: {},
  connectButtonPressed: {},
  connectButtonText: {},
};

describe('BrainDumpStatusSection', () => {
  it('renders loading state before the action bar', () => {
    render(
      <BrainDumpStatusSection
        styles={styles}
        isLoading
        isSorting={false}
        itemCount={0}
        sortingError={null}
        googleAuthRequired={false}
        isConnectingGoogle={false}
        canConnectGoogle={false}
        loadingSpinnerColor="#fff"
        onSort={jest.fn()}
        onClear={jest.fn()}
        onConnectGoogle={jest.fn()}
      />,
    );

    expect(screen.getByText('LOADING...')).toBeTruthy();
    expect(screen.queryByText('ACTION_BAR')).toBeNull();
  });

  it('renders auth recovery when sorting requires google connection', () => {
    const onConnectGoogle = jest.fn();

    render(
      <BrainDumpStatusSection
        styles={styles}
        isLoading={false}
        isSorting={false}
        itemCount={2}
        sortingError="Need Google auth"
        googleAuthRequired
        isConnectingGoogle={false}
        canConnectGoogle
        loadingSpinnerColor="#fff"
        onSort={jest.fn()}
        onClear={jest.fn()}
        onConnectGoogle={onConnectGoogle}
      />,
    );

    expect(screen.getByText('ACTION_BAR')).toBeTruthy();
    fireEvent.press(screen.getByText('CONNECT GOOGLE'));
    expect(onConnectGoogle).toHaveBeenCalledTimes(1);
  });
});
