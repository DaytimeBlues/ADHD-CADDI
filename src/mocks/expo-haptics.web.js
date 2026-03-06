/**
 * Web mock for expo-haptics
 * Haptic feedback is not supported on web, so we provide no-op implementations
 */

export const ImpactFeedbackStyle = {
  Light: 'light',
  Medium: 'medium',
  Heavy: 'heavy',
};

export const NotificationFeedbackType = {
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
};

// No-op implementations for web
export const impactAsync = async () => {};
export const notificationAsync = async () => {};
export const selectionAsync = async () => {};

export default {
  ImpactFeedbackStyle,
  NotificationFeedbackType,
  impactAsync,
  notificationAsync,
  selectionAsync,
};
