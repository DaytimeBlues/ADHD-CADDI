/**
 * Web mock for expo-local-authentication
 * Biometric authentication is not supported on web builds
 */

export const authenticateAsync = async () => ({ success: true });
export const hasHardwareAsync = async () => false;
export const isEnrolledAsync = async () => false;
export const getEnrolledLevelAsync = async () => 0;
export const supportedAuthenticationTypesAsync = async () => [];
export const cancelAuthenticate = async () => {};

// Security level constants
export const SecurityLevel = {
  NONE: 0,
  SECRET: 1,
  BIOMETRIC: 2,
};

// Authentication type constants
export const AuthenticationType = {
  NONE: 0,
  FINGERPRINT: 1,
  FACIAL_RECOGNITION: 2,
  IRIS: 3,
};

export default {
  authenticateAsync,
  hasHardwareAsync,
  isEnrolledAsync,
  SecurityLevel,
  AuthenticationType,
};
