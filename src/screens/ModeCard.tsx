import React, { useCallback, useState, memo } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import AppIcon from '../components/AppIcon';
import { Tokens } from '../theme/tokens';
import HapticsService from '../services/HapticsService';
import { useTheme } from '../theme/useTheme';
import { isWeb } from '../utils/PlatformUtils';

export type ModeCardMode = {
  name: string;
  icon: string;
  desc: string;
  accent: string;
};

export type ModeCardProps = {
  mode: ModeCardMode;
  onPress: () => void;
  style?: ViewStyle;
  animatedStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

type WebInteractiveStyle = {
  boxShadow?: string;
  borderColor?: string;
  outlineColor?: string;
  outlineStyle?: 'solid' | 'dotted' | 'dashed';
  outlineWidth?: number;
  outlineOffset?: number;
  cursor?: 'pointer';
  transition?: string;
};

type WebCardSurfaceStyle = ViewStyle & {
  backdropFilter?: string;
  WebkitBackdropFilter?: string;
  backgroundImage?: string;
  pointerEvents?: 'none';
};

const CARD_MIN_HEIGHT = 100;
const DOT_SIZE = 4; // Smaller, sharper dots
const ICON_SIZE = 24;

function ModeCardComponent({
  mode,
  onPress,
  style,
  animatedStyle,
  testID,
}: ModeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { isCosmic, isNightAwe, t } = useTheme();

  const surfaceColor = isNightAwe
    ? t.colors.nightAwe?.surface?.raised || '#132238'
    : isCosmic
      ? '#1E2336'
      : Tokens.colors.neutral.dark;
  const borderColor = isNightAwe
    ? t.colors.nightAwe?.surface?.border || 'rgba(217, 228, 242, 0.14)'
    : isCosmic
      ? 'rgba(255, 255, 255, 0.08)'
      : Tokens.colors.neutral.border;
  const textPrimary = isNightAwe
    ? t.colors.text?.primary || '#F6F1E7'
    : '#EEF2FF';
  const textSecondary = isNightAwe
    ? t.colors.text?.secondary || 'rgba(246, 241, 231, 0.78)'
    : 'rgba(238, 242, 255, 0.80)';

  const hoverStyle: WebInteractiveStyle | undefined =
    isWeb && (isHovered || isFocused)
      ? ({
          borderColor: isNightAwe ? mode.accent : 'rgba(255, 255, 255, 0.25)',
          backgroundColor: isNightAwe ? '#16283F' : '#232A42',
          transform: 'translateY(-2px)',
          boxShadow: isNightAwe
            ? `0 14px 32px rgba(8, 17, 30, 0.26), 0 0 0 1px ${mode.accent}22`
            : `0 12px 40px rgba(0,0,0,0.3), 0 0 24px ${mode.accent}25`,
        } as WebInteractiveStyle)
      : undefined;

  const focusStyle: WebInteractiveStyle | undefined =
    isWeb && isFocused
      ? ({
          outlineColor: mode.accent,
          outlineStyle: 'solid',
          outlineWidth: 2,
          outlineOffset: 2,
        } as WebInteractiveStyle)
      : undefined;

  const handlePress = useCallback(() => {
    HapticsService.tap({ key: 'modeCard' });
    onPress();
  }, [onPress]);

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        testID={testID}
        accessibilityLabel={`${mode.name} mode`}
        accessibilityHint={`Open ${mode.name}. ${mode.desc}`}
        accessibilityRole="button"
        onPress={handlePress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={({ pressed }) => [
          styles.card,
          isNightAwe
            ? [
                styles.cardNightAwe,
                {
                  backgroundColor: surfaceColor,
                  borderColor,
                },
              ]
            : isCosmic
              ? styles.cardCosmic
              : styles.cardStandard,
          isWeb &&
            ({
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
            } as WebInteractiveStyle),
          pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
          hoverStyle,
          focusStyle,
        ]}
      >
        {isWeb && <View style={styles.webGradientOverlay} />}
        <View style={styles.cardHeader}>
          <AppIcon
            name={mode.icon}
            size={ICON_SIZE}
            color={isHovered ? mode.accent : textPrimary}
          />
          <View
            style={[
              styles.accentDot,
              (isHovered || isNightAwe) && { backgroundColor: mode.accent },
            ]}
          />
        </View>

        <View style={styles.cardContent}>
          <Text
            style={[
              styles.cardTitle,
              { color: textPrimary },
              isHovered && styles.cardTitleHovered,
            ]}
          >
            {mode.name.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.cardDesc,
              { color: textSecondary },
              isHovered && styles.cardDescHovered,
            ]}
            numberOfLines={2}
          >
            {mode.desc}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Tokens.spacing[4] || 16,
    borderRadius: 24, // Generous, friendly corner radius
    borderWidth: 1,
    minHeight: CARD_MIN_HEIGHT,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardCosmic: {
    backgroundColor: '#1E2336', // Warm, soft navy matte finish
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: 'rgba(255, 255, 255, 0.15)', // Gentle light catch
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)', // Soften the background
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      } as WebCardSurfaceStyle,
      default: {
        backgroundColor: '#1E2336', // Reliable, solid but soft color for Native
        elevation: 4, // Gentle drop shadow on Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  cardStandard: {
    borderColor: Tokens.colors.neutral.border,
    backgroundColor: Tokens.colors.neutral.dark,
  },
  cardNightAwe: {
    borderTopColor: 'rgba(246, 241, 231, 0.1)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow:
          '0 10px 26px rgba(8, 17, 30, 0.22), inset 0 1px 0 rgba(246, 241, 231, 0.03)',
      } as WebCardSurfaceStyle,
      default: {
        elevation: 2,
        shadowColor: '#08111E',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
    }),
  },
  webGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
    ...(isWeb &&
      ({
        backgroundImage:
          'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none',
      } as WebCardSurfaceStyle)),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  accentDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: 'transparent',
  },
  accentDotActive: {
    // This is overridden dynamically now
  },
  cardContent: {
    marginTop: Tokens.spacing[3],
    zIndex: 2,
  },
  cardTitle: {
    fontFamily: Tokens.type.fontFamily.mono,
    fontSize: Tokens.type.sm,
    fontWeight: '700',
    marginBottom: Tokens.spacing[1],
    letterSpacing: 1.2,
  },
  cardTitleHovered: {
    color: '#FFFFFF',
  },
  cardDesc: {
    fontFamily: Tokens.type.fontFamily.sans,
    fontSize: Tokens.type.xs,
    lineHeight: 18,
    letterSpacing: 0.3, // Reduced spacing for easier reading
  },
  cardDescHovered: {
    color: 'rgba(238, 242, 255, 0.95)',
  },
});

// Memoize for performance - prevents unnecessary re-renders
export default memo(ModeCardComponent);
