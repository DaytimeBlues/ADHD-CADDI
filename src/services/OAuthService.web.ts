/// <reference lib="dom" />
import type { GoogleAuthData, TodoistAuthData } from './oauth/OAuthShared';
import { OAuthWebAdapter } from './oauth/OAuthWebAdapter';

const OAuthService = new OAuthWebAdapter({
  getItem: async (key) => localStorage.getItem(key),
  setItem: async (key, value) => {
    localStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    localStorage.removeItem(key);
  },
});

export type { GoogleAuthData, TodoistAuthData };
export { OAuthService };
export default OAuthService;
