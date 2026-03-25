import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { FirebaseAuthService } from '../services/FirebaseAuthService';
import { config } from '../config';
import { Tokens } from '../theme/tokens';
import { cosmicColors } from '../theme/cosmicTokens';
import { GlowCard } from '../ui/cosmic';
import AppIcon from '../components/AppIcon';
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen = () => {
  const { enterGuestMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canUseGoogleSignIn =
    Platform.OS === 'web'
      ? true
      : Boolean(config.googleWebClientId || config.googleIosClientId);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: authError } = isSignUp
      ? await FirebaseAuthService.signUpWithEmail(email, password)
      : await FirebaseAuthService.signInWithEmail(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error: authError } =
      await FirebaseAuthService.signInWithGoogleWeb();
    if (authError) {
      setError(authError);
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await enterGuestMode();
    } catch (authError) {
      setError(
        authError instanceof Error ? authError.message : String(authError),
      );
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <AppIcon
            name="auto-fix"
            size={60}
            color={cosmicColors.nebulaViolet}
          />
          <Text style={styles.title}>ADHD-CADDI</Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Create your celestial account'
              : 'Welcome back, explorer'}
          </Text>
        </View>

        <GlowCard style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="vessel@galaxy.com"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'INITIALIZE ACCOUNT' : 'LOG IN'}
              </Text>
            )}
          </TouchableOpacity>
        </GlowCard>

        {canUseGoogleSignIn ? (
          <>
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
            >
              <AppIcon name="google" size={20} color="#FFF" />
              <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
            </TouchableOpacity>
          </>
        ) : null}

        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuestSignIn}
          disabled={loading}
          testID="login-guest-button"
        >
          <AppIcon
            name="account-circle-outline"
            size={20}
            color={cosmicColors.nebulaViolet}
          />
          <Text style={styles.guestButtonText}>CONTINUE AS GUEST</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.switchText}>
            {isSignUp
              ? 'ALREADY HAVE AN ACCOUNT? LOG IN'
              : "DON'T HAVE AN ACCOUNT? SIGN UP"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070712', // Cosmic Background
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    fontFamily: Tokens.type.fontFamily.sans,
    marginTop: 16,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
  },
  card: {
    width: '100%',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: cosmicColors.nebulaViolet,
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    height: 50,
    backgroundColor: cosmicColors.nebulaViolet,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: cosmicColors.nebulaViolet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '700',
  },
  googleButton: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  googleButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: 1,
  },
  switchButton: {
    marginTop: 32,
  },
  switchText: {
    color: cosmicColors.nebulaViolet,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  guestButton: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginTop: 16,
  },
  guestButtonText: {
    color: cosmicColors.nebulaViolet,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 1,
  },
});

export default LoginScreen;
