/**
 * useCaptureBubbleState Hook
 *
 * Manages subscriptions, badge counting, drawer state, and bubble-state transitions
 * for the CaptureBubble component.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import CaptureService from '../../services/CaptureService';
import { CheckInService } from '../../services/CheckInService';
import OverlayService from '../../services/OverlayService';
import { useTaskStore } from '../../store/useTaskStore';
import { isWeb } from '../../utils/PlatformUtils';
import { PULSE_DURATION, SPIN_DURATION } from './captureBubbleConstants';
import {
  getNextStateForBadgeCount,
  getNextStateForCheckIn,
  getRecoveryStateAfterFailure,
} from './captureStateMachine';
import type { BubbleState } from './captureTypes';

export interface UseCaptureBubbleStateReturn {
  drawerOpen: boolean;
  bubbleState: BubbleState;
  badgeCount: number;
  totalBadgeCount: number;
  pulseAnim: Animated.Value;
  spinAnim: Animated.Value;
  shakeAnim: Animated.Value;
  setDrawerOpen: (open: boolean) => void;
  setBubbleState: (state: BubbleState) => void;
  runShake: () => void;
  handleDrawerClose: () => void;
  handleStateChange: (state: BubbleState) => void;
}

export function useCaptureBubbleState(): UseCaptureBubbleStateReturn {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bubbleState, setBubbleState] = useState<BubbleState>('idle');
  const [badgeCount, setBadgeCount] = useState(0);

  // Task Store Integration
  const activeTaskCount = useTaskStore((state) => state.getActiveCount());
  const totalBadgeCount = badgeCount + activeTaskCount;

  // Sync with native overlay
  useEffect(() => {
    OverlayService.updateCount(totalBadgeCount);
  }, [totalBadgeCount]);

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const spinLoop = useRef<Animated.CompositeAnimation | null>(null);
  const useNativeDriver = !isWeb;

  // Subscribe to badge count updates from CaptureService
  useEffect(() => {
    const unsub = CaptureService.subscribe((count) => {
      setBadgeCount(count);
      setBubbleState((currentState) =>
        getNextStateForBadgeCount(currentState, count),
      );
    });
    return unsub;
  }, []);

  // Subscribe to check-in interval
  useEffect(() => {
    const unsub = CheckInService.subscribe((isPending) => {
      setBubbleState((currentState) =>
        getNextStateForCheckIn(currentState, isPending, badgeCount),
      );
    });
    return unsub;
  }, [badgeCount]);

  // Pulse animation (recording state)
  useEffect(() => {
    if (bubbleState === 'recording' || bubbleState === 'needs-checkin') {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: PULSE_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: PULSE_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver,
          }),
        ]),
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
    return () => {
      pulseLoop.current?.stop();
    };
  }, [bubbleState, pulseAnim, useNativeDriver]);

  // Spin animation (processing state)
  useEffect(() => {
    if (bubbleState === 'processing') {
      spinLoop.current = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: SPIN_DURATION,
          easing: Easing.linear,
          useNativeDriver,
        }),
      );
      spinLoop.current.start();
    } else {
      spinLoop.current?.stop();
      spinAnim.setValue(0);
    }
    return () => {
      spinLoop.current?.stop();
    };
  }, [bubbleState, spinAnim, useNativeDriver]);

  // Shake animation (failed state - plays once)
  const runShake = useCallback(() => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver,
        easing: Easing.linear,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver,
        easing: Easing.linear,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        useNativeDriver,
        easing: Easing.linear,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 60,
        useNativeDriver,
        easing: Easing.linear,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver,
        easing: Easing.linear,
      }),
    ]).start(() => {
      // Reset to idle after showing error for 3s
      setTimeout(() => {
        setBubbleState((currentState) =>
          getRecoveryStateAfterFailure(currentState, badgeCount),
        );
      }, 3000);
    });
  }, [badgeCount, shakeAnim, useNativeDriver]);

  // Run shake when entering failed state
  useEffect(() => {
    if (bubbleState === 'failed') {
      runShake();
    }
  }, [bubbleState, runShake]);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleStateChange = useCallback((state: BubbleState) => {
    setBubbleState(state);
  }, []);

  return {
    drawerOpen,
    bubbleState,
    badgeCount,
    totalBadgeCount,
    pulseAnim,
    spinAnim,
    shakeAnim,
    setDrawerOpen,
    setBubbleState,
    runShake,
    handleDrawerClose,
    handleStateChange,
  };
}
