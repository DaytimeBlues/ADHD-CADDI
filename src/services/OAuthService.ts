import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GoogleAuthData, TodoistAuthData } from './oauth/OAuthShared';
import { OAuthNativeAdapter } from './oauth/OAuthNativeAdapter';

const OAuthService = new OAuthNativeAdapter({
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
});

export type { GoogleAuthData, TodoistAuthData };
export { OAuthService };
export default OAuthService;
