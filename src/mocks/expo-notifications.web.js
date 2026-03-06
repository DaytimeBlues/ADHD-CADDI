/**
 * Web mock for expo-notifications
 * Push notifications are not supported on web builds
 */

export const scheduleNotificationAsync = async () => '';
export const cancelScheduledNotificationAsync = async () => {};
export const cancelAllScheduledNotificationsAsync = async () => {};
export const getPermissionsAsync = async () => ({ status: 'granted' });
export const requestPermissionsAsync = async () => ({ status: 'granted' });
export const setNotificationHandler = () => {};
export const setNotificationChannelAsync = async () => {};
export const getExpoPushTokenAsync = async () => ({ data: '' });
export const getDevicePushTokenAsync = async () => ({ data: '' });

export const AndroidNotificationPriority = {
  MIN: 'min',
  LOW: 'low',
  DEFAULT: 'default',
  HIGH: 'high',
  MAX: 'max',
};

export const AndroidImportance = {
  UNSPECIFIED: 'unspecified',
  NONE: 'none',
  MIN: 'min',
  LOW: 'low',
  DEFAULT: 'default',
  HIGH: 'high',
  MAX: 'max',
};

export const SchedulableTriggerInputTypes = {
  TIME_INTERVAL: 'timeInterval',
  DATE: 'date',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

// Notification received event (web doesn't support this)
export const addNotificationReceivedListener = () => ({ remove: () => {} });
export const addNotificationResponseReceivedListener = () => ({
  remove: () => {},
});
export const removeNotificationSubscription = () => {};

// Default export for compatibility
export default {
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationHandler,
  AndroidNotificationPriority,
  SchedulableTriggerInputTypes,
};
