/**
 * HomeDebugPanel Component
 *
 * Debug panel for development showing overlay events and diagnostic actions.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface OverlayEvent {
  id: string;
  timestamp: number;
  label: string;
}

interface HomeDebugPanelProps {
  overlayEvents: OverlayEvent[];
  styles: {
    debugPanel: object;
    debugTitle: object;
    debugText: object;
    debugButtonRow: object;
    debugButton: object;
    debugButtonText: object;
  };
  onCopyDiagnostics: () => void;
  onNavigateDiagnostics: () => void;
}

export function HomeDebugPanel({
  overlayEvents,
  styles,
  onCopyDiagnostics,
  onNavigateDiagnostics,
}: HomeDebugPanelProps) {
  return (
    <View style={styles.debugPanel}>
      <Text style={styles.debugTitle}>LOGS</Text>
      {overlayEvents.length === 0 ? (
        <Text style={styles.debugText}>NULL</Text>
      ) : (
        overlayEvents.map((event) => (
          <Text key={event.id} style={styles.debugText}>
            {new Date(event.timestamp).toLocaleTimeString([], {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}{' '}
            :: {event.label}
          </Text>
        ))
      )}
      <View style={styles.debugButtonRow}>
        <TouchableOpacity
          onPress={onCopyDiagnostics}
          style={styles.debugButton}
        >
          <Text style={styles.debugButtonText}>COPY_DIAG</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNavigateDiagnostics}
          style={styles.debugButton}
        >
          <Text style={styles.debugButtonText}>DIAGNOSTICS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
