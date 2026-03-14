import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { BrainDumpActionBar } from '../../components/brain-dump';

interface BrainDumpStatusSectionProps {
  styles: {
    loadingContainer: object;
    loadingText: object;
    errorContainer: object;
    errorText: object;
    connectButton: object;
    connectButtonDisabled: object;
    connectButtonPressed: object;
    connectButtonText: object;
  };
  isLoading: boolean;
  isSorting: boolean;
  itemCount: number;
  sortingError: string | null;
  googleAuthRequired: boolean;
  isConnectingGoogle: boolean;
  canConnectGoogle: boolean;
  loadingSpinnerColor: string;
  onSort: () => void;
  onClear: () => void;
  onConnectGoogle: () => void;
}

export function BrainDumpStatusSection({
  styles,
  isLoading,
  isSorting,
  itemCount,
  sortingError,
  googleAuthRequired,
  isConnectingGoogle,
  canConnectGoogle,
  loadingSpinnerColor,
  onSort,
  onClear,
  onConnectGoogle,
}: BrainDumpStatusSectionProps) {
  return (
    <>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={loadingSpinnerColor} />
          <Text style={styles.loadingText}>LOADING...</Text>
        </View>
      ) : (
        <BrainDumpActionBar
          itemCount={itemCount}
          isSorting={isSorting}
          onSort={onSort}
          onClear={onClear}
        />
      )}

      {sortingError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{sortingError}</Text>
          {googleAuthRequired && canConnectGoogle && (
            <Pressable
              onPress={onConnectGoogle}
              disabled={isConnectingGoogle}
              style={({ pressed }) => [
                styles.connectButton,
                isConnectingGoogle && styles.connectButtonDisabled,
                pressed && styles.connectButtonPressed,
              ]}
            >
              <Text style={styles.connectButtonText}>
                {isConnectingGoogle ? 'CONNECTING...' : 'CONNECT GOOGLE'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </>
  );
}
