import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { LoggerService } from '../services/LoggerService';

const useReducedMotion = (): boolean => {
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadReduceMotionPreference = async (): Promise<void> => {
      try {
        const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        if (isMounted) {
          setReduceMotionEnabled(isEnabled);
        }
      } catch (error) {
        LoggerService.warn({
          service: 'useReducedMotion',
          operation: 'loadReduceMotionPreference',
          message: 'Failed to read reduced motion preference',
          error,
        });
        if (isMounted) {
          setReduceMotionEnabled(false);
        }
      }
    };

    loadReduceMotionPreference();

    const subscription = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      setReduceMotionEnabled,
    );

    return () => {
      isMounted = false;
      subscription?.remove?.();
    };
  }, []);

  return reduceMotionEnabled;
};

export default useReducedMotion;
