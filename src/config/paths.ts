export const WEB_APP_ORIGIN =
  process.env.EXPO_PUBLIC_WEB_APP_ORIGIN || 'https://adhd-3f643.web.app';
export const WEB_APP_BASE_PATH = '/';
export const WEB_APP_URL = `${WEB_APP_ORIGIN}${WEB_APP_BASE_PATH === '/' ? '' : WEB_APP_BASE_PATH}`;

export const getWebRedirectUri = (origin = WEB_APP_ORIGIN): string => {
  return `${origin}${WEB_APP_BASE_PATH === '/' ? '/' : `${WEB_APP_BASE_PATH}/`}`;
};

export const WEB_LINKING_PREFIXES = [WEB_APP_URL, getWebRedirectUri()];
