export const WEB_APP_ORIGIN = 'https://daytimeblues.github.io';
export const WEB_APP_BASE_PATH = '/ADHD-CADDI';
export const WEB_APP_URL = `${WEB_APP_ORIGIN}${WEB_APP_BASE_PATH}`;

export const getWebRedirectUri = (origin = WEB_APP_ORIGIN): string => {
  return `${origin}${WEB_APP_BASE_PATH}/`;
};

export const WEB_LINKING_PREFIXES = [WEB_APP_URL, getWebRedirectUri()];
