/**
 * Capture Bubble FAB Component
 *
 * Renders the Floating Action Button, hint pill, and badge button.
 */

import React, { memo, useMemo } from 'react';
import { Pressable, Text, Animated, View, ViewStyle } from 'react-native';
import { navigationRef } from '../../navigation/navigationRef';
import { ROUTES } from '../../navigation/routes';
import { CheckInService } from '../../services/CheckInService';
import { isWeb } from '../../utils/PlatformUtils';
import { COLORS } from './captureBubbleConstants';
import { captureBubbleStyles as styles } from './captureBubbleStyles';
import type { BubbleState } from './captureTypes';

interface CaptureBubbleFabProps {
  bubbleState: BubbleState;
  badgeCount: number;
  totalBadgeCount: number;
  pulseAnim: Animated.Value;
  spinAnim: Animated.Value;
  shakeAnim: Animated.Value;
  drawerOpen: boolean;
  onDrawerOpen: () => void;
}

export const CaptureBubbleFab = memo(function CaptureBubbleFab({
  bubbleState,
  badgeCount,
  totalBadgeCount,
  pulseAnim,
  spinAnim,
  shakeAnim,
  drawerOpen,
  onDrawerOpen,
}: CaptureBubbleFabProps) {
  // Spin rotation interpolation
  const spinRotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Derive FAB color from state
  const fabColor = useMemo((): string => {
    switch (bubbleState) {
      case 'recording':
        return COLORS.recording;
      case 'processing':
        return COLORS.processing;
      case 'failed':
        return COLORS.failed;
      case 'offline':
        return COLORS.offline;
      case 'needs-checkin':
        return COLORS.needsCheckin;
      default:
        return COLORS.idle;
    }
  }, [bubbleState]);

  // Derive FAB glow (web only)
  const fabGlow = useMemo((): ViewStyle => {
    if (!isWeb) {
      return {};
    }
    switch (bubbleState) {
      case 'recording':
        return {
          boxShadow:
            '0 0 0 3px rgba(45, 212, 191, 0.35), 0 0 28px rgba(45, 212, 191, 0.4), 0 8px 24px rgba(7,7,18,0.6)',
        } as ViewStyle;
      case 'failed':
        return {
          boxShadow:
            '0 0 0 2px rgba(251, 113, 133, 0.4), 0 0 20px rgba(251, 113, 133, 0.3)',
        } as ViewStyle;
      case 'offline':
        return { boxShadow: '0 4px 16px rgba(7,7,18,0.5)' } as ViewStyle;
      case 'needs-checkin':
        return {
          boxShadow:
            '0 0 0 3px rgba(246, 193, 119, 0.35), 0 0 28px rgba(246, 193, 119, 0.4), 0 8px 24px rgba(7,7,18,0.6)',
        } as ViewStyle;
      default:
        return {
          boxShadow:
            '0 0 0 2px rgba(139, 92, 246, 0.3), 0 0 24px rgba(139, 92, 246, 0.35), 0 8px 24px rgba(7,7,18,0.6)',
        } as ViewStyle;
    }
  }, [bubbleState]);

  // Derive FAB icon/label
  const fabIcon = useMemo((): string => {
    switch (bubbleState) {
      case 'recording':
        return 'STOP';
      case 'processing':
        return '...';
      case 'failed':
        return 'X';
      case 'offline':
        return 'OFF';
      case 'needs-checkin':
        return 'CHK';
      default:
        return '+';
    }
  }, [bubbleState]);

  const bubbleHint = useMemo((): string | null => {
    if (
      drawerOpen ||
      bubbleState === 'recording' ||
      bubbleState === 'processing'
    ) {
      return null;
    }

    switch (bubbleState) {
      case 'needs-review':
        return totalBadgeCount > 0
          ? `Review ${totalBadgeCount} item${totalBadgeCount !== 1 ? 's' : ''}`
          : 'Review inbox';
      case 'needs-checkin':
        return 'Quick check-in';
      case 'offline':
        return 'Offline capture';
      case 'failed':
        return 'Try again';
      default:
        return 'Quick capture';
    }
  }, [bubbleState, drawerOpen, totalBadgeCount]);

  const handlePress = () => {
    if (bubbleState === 'needs-review' && badgeCount > 0) {
      if (navigationRef.isReady()) {
        navigationRef.navigate(ROUTES.INBOX);
      }
      return;
    }

    if (bubbleState === 'processing') {
      return; // non-interactive
    }
    onDrawerOpen();
    if (bubbleState === 'needs-checkin') {
      CheckInService.setPending(false);
    }
  };

  const handleBadgePress = () => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(ROUTES.INBOX);
    }
  };

  return (
    <Animated.View
      style={[
        styles.fabContainer,
        {
          transform: [
            { scale: pulseAnim },
            { translateX: shakeAnim },
            ...(bubbleState === 'processing' ? [{ rotate: spinRotation }] : []),
          ],
        },
      ]}
      pointerEvents="box-none"
    >
      {isWeb && bubbleHint && (
        <View pointerEvents="none" style={styles.hintPill}>
          <Text style={styles.hintText}>{bubbleHint}</Text>
        </View>
      )}

      <Pressable
        testID="capture-bubble"
        onPress={handlePress}
        disabled={bubbleState === 'processing'}
        accessibilityLabel={
          bubbleState === 'recording'
            ? 'Stop recording'
            : bubbleState === 'needs-review'
              ? `Capture inbox, ${badgeCount} item${badgeCount !== 1 ? 's' : ''} to review`
              : 'Open capture'
        }
        accessibilityRole="button"
        style={[styles.fab, { backgroundColor: fabColor }, fabGlow]}
      >
        <Text style={styles.fabIcon}>{fabIcon}</Text>
      </Pressable>

      {/* Badge */}
      {totalBadgeCount > 0 &&
        bubbleState !== 'recording' &&
        bubbleState !== 'processing' && (
          <Pressable
            style={styles.badge}
            testID="capture-bubble-badge"
            onPress={handleBadgePress}
            accessibilityLabel={`Open capture inbox, ${totalBadgeCount} items to review`}
            accessibilityRole="button"
          >
            <Text style={styles.badgeText}>
              {totalBadgeCount > 99 ? '99+' : totalBadgeCount}
            </Text>
          </Pressable>
        )}
    </Animated.View>
  );
});
