/**
 * Application Configuration
 *
 * Environment-based configuration for API endpoints, feature flags,
 * and AI provider settings.
 *
 * ⚠️ SECURITY NOTE: Variables prefixed with EXPO_PUBLIC_ are bundled into
 * client-side JavaScript and are extractable by end users. Never store
 * sensitive API keys with this prefix in production. Route AI calls through
 * a server-side proxy (e.g. the Vercel backend at /api/chat) instead.
 */

export type AiProvider = 'vercel' | 'gemini-direct' | 'kimi-direct';

export interface Config {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  googleWebClientId?: string;
  googleIosClientId?: string;
  /** AI provider: 'vercel' uses the Vercel backend; 'gemini-direct' calls Gemini API from client */
  aiProvider: AiProvider;
  /** Gemini API key — only used when aiProvider === 'gemini-direct' */
  geminiApiKey?: string;
  /** Moonshot (Kimi) API key — only used when aiProvider === 'kimi-direct' */
  moonshotApiKey?: string;
  /** Kimi model name (default: kimi-k2.5) */
  kimiModel: string;
  /** AI request timeout in milliseconds (default 8000) */
  aiTimeout: number;
  /** Maximum AI request retry attempts (default 3) */
  aiMaxRetries: number;
}

type RuntimeEnv = Record<string, string | undefined>;

const getRuntimeEnv = (): RuntimeEnv => {
  if (typeof process === 'undefined' || !process.env) {
    return {};
  }

  return process.env;
};

const getEnvironment = (env: RuntimeEnv): Config['environment'] => {
  if (env.NODE_ENV === 'development' || env.EXPO_PUBLIC_ENV === 'development') {
    return 'development';
  }

  if (env.EXPO_PUBLIC_ENV === 'staging') {
    return 'staging';
  }

  return 'production';
};

const getConfig = (): Config => {
  const env = getRuntimeEnv();
  const environment = getEnvironment(env);
  const allowInsecureDirectAi =
    env.EXPO_PUBLIC_ENABLE_INSECURE_DIRECT_AI === 'true';
  const canUseDirectClientAi =
    environment !== 'production' || allowInsecureDirectAi;

  const config: Config = {
    apiBaseUrl: 'https://spark-adhd-api.vercel.app',
    environment,
    googleWebClientId: undefined,
    googleIosClientId: undefined,
    aiProvider: 'vercel',
    geminiApiKey: undefined,
    moonshotApiKey: undefined,
    kimiModel: 'kimi-k2.5',
    aiTimeout: 8000,
    aiMaxRetries: 3,
  };

  // Log warning if direct AI provider is used in production
  const warnDirectProvider = (provider: string, blocked: boolean) => {
    import('../services/LoggerService')
      .then(({ LoggerService }) => {
        LoggerService.warn({
          service: 'config',
          operation: blocked ? 'blockDirectProvider' : 'warnDirectProvider',
          message: blocked
            ? `[SECURITY WARNING] Ignoring '${provider}' in production because client-bundled API keys are public. Use the 'vercel' provider or explicitly set EXPO_PUBLIC_ENABLE_INSECURE_DIRECT_AI=true for non-production debugging.`
            : `[SECURITY WARNING] Using '${provider}' exposes API keys in the client bundle. Prefer the 'vercel' provider with a server-side proxy.`,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn(
          '[config.warnDirectProvider] Failed to import LoggerService for security warning',
          error,
        );
      });
  };

  if (env.EXPO_PUBLIC_API_BASE_URL) {
    config.apiBaseUrl = env.EXPO_PUBLIC_API_BASE_URL;
  }

  if (env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
    config.googleWebClientId = env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  }

  if (env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) {
    config.googleIosClientId = env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  }

  if (env.EXPO_PUBLIC_GEMINI_API_KEY) {
    if (canUseDirectClientAi) {
      config.geminiApiKey = env.EXPO_PUBLIC_GEMINI_API_KEY;
    } else {
      warnDirectProvider('gemini-direct', true);
    }
  }

  if (env.EXPO_PUBLIC_MOONSHOT_API_KEY) {
    if (canUseDirectClientAi) {
      config.moonshotApiKey = env.EXPO_PUBLIC_MOONSHOT_API_KEY;
    } else {
      warnDirectProvider('kimi-direct', true);
    }
  }

  if (env.EXPO_PUBLIC_KIMI_MODEL) {
    config.kimiModel = env.EXPO_PUBLIC_KIMI_MODEL;
  }

  if (env.EXPO_PUBLIC_AI_TIMEOUT) {
    config.aiTimeout = parseInt(env.EXPO_PUBLIC_AI_TIMEOUT, 10) || 8000;
  }

  if (env.EXPO_PUBLIC_AI_MAX_RETRIES) {
    config.aiMaxRetries = parseInt(env.EXPO_PUBLIC_AI_MAX_RETRIES, 10) || 3;
  }

  if (env.EXPO_PUBLIC_AI_PROVIDER === 'vercel') {
    config.aiProvider = 'vercel';
  } else if (env.EXPO_PUBLIC_AI_PROVIDER === 'gemini-direct') {
    if (canUseDirectClientAi) {
      config.aiProvider = 'gemini-direct';
      warnDirectProvider('gemini-direct', false);
    } else {
      warnDirectProvider('gemini-direct', true);
    }
  } else if (env.EXPO_PUBLIC_AI_PROVIDER === 'kimi-direct') {
    if (canUseDirectClientAi) {
      config.aiProvider = 'kimi-direct';
      warnDirectProvider('kimi-direct', false);
    } else {
      warnDirectProvider('kimi-direct', true);
    }
  } else if (env.EXPO_PUBLIC_GEMINI_API_KEY && canUseDirectClientAi) {
    config.aiProvider = 'gemini-direct';
    warnDirectProvider('gemini-direct', false);
  } else if (env.EXPO_PUBLIC_MOONSHOT_API_KEY && canUseDirectClientAi) {
    config.aiProvider = 'kimi-direct';
    warnDirectProvider('kimi-direct', false);
  }

  return config;
};

export const config = getConfig();

export * from './caddi';
