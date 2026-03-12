import { config } from '../../config';
import { LoggerService } from '../LoggerService';
import { type OAuthProvider } from './OAuthShared';
import { OAuthBase } from './OAuthBase';

interface GoogleSigninUser {
  data?: {
    user?: {
      email?: string;
      name?: string | null;
      photo?: string | null;
    };
  };
}

export class OAuthNativeAdapter extends OAuthBase {
  protected getStorageMode() {
    return 'metadata-only' as const;
  }

  protected getRedirectUri(_provider: OAuthProvider): string {
    return 'com.adhdcaddi:/oauth2callback';
  }

  protected openOAuthPopup(): Promise<{ success: boolean; error?: string }> {
    return Promise.resolve({
      success: false,
      error: 'Native OAuth not implemented',
    });
  }

  async initiateGoogleAuth(): Promise<{ success: boolean; error?: string }> {
    try {
      const { GoogleSignin } = await import(
        '@react-native-google-signin/google-signin'
      );

      GoogleSignin.configure({
        webClientId: config.googleWebClientId,
        iosClientId: config.googleIosClientId,
        offlineAccess: Boolean(config.googleWebClientId),
        forceCodeForRefreshToken: false,
      });

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = (await GoogleSignin.signIn()) as GoogleSigninUser;
      const tokens = await GoogleSignin.getTokens();

      await this.storeAuthData('google', {
        accessToken: tokens.accessToken,
        email: userInfo.data?.user?.email,
        name: userInfo.data?.user?.name ?? undefined,
        picture: userInfo.data?.user?.photo ?? undefined,
      });
      return { success: true };
    } catch (error) {
      LoggerService.error({
        service: 'OAuthService',
        operation: 'initiateGoogleAuthNative',
        message: 'Native Google auth failed',
        error,
      });
      return { success: false, error: 'Google sign-in failed' };
    }
  }
}
