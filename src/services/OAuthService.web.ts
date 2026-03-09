/// <reference lib="dom" />
import { OAuthWebAdapter } from './oauth';
import type { GoogleAuthData, TodoistAuthData } from './oauth';

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
