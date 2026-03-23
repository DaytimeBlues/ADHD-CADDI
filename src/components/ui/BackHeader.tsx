import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/useTheme';
import AppIcon from '../AppIcon';
import { ROUTES } from '../../navigation/routes';

type BackHeaderProps = {
  title?: string;
  onBack?: () => void;
  showIcon?: boolean;
  fallbackRoute?: string;
};

export const BackHeader = ({
  title,
  onBack,
  showIcon = true,
  fallbackRoute = ROUTES.HOME,
}: BackHeaderProps) => {
  const navigation = useNavigation();
  const { isCosmic, isNightAwe, t } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (
      typeof navigation.canGoBack === 'function' &&
      navigation.canGoBack()
    ) {
      navigation.goBack();
    } else if (typeof navigation.navigate === 'function') {
      navigation.navigate(fallbackRoute as never);
    } else {
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      minHeight: 56,
      width: '100%',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
    },
    backText: {
      fontFamily: t.type?.fontFamily?.sans,
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: 1.5,
      marginLeft: 4,
      color: isCosmic
        ? '#8B5CF6'
        : isNightAwe
          ? '#AFC7FF'
          : t.colors.brand[500],
    },
    title: {
      flex: 1,
      fontFamily: t.type?.fontFamily?.sans,
      fontSize: 16,
      fontWeight: '800',
      textAlign: 'center',
      marginRight: 40, // Offset the back button to center the title
      color: t.colors.text?.primary || '#FFFFFF',
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
  });

  const iconColor = isCosmic
    ? '#8B5CF6'
    : isNightAwe
      ? '#AFC7FF'
      : t.colors.brand[500];

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleBack}
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        {showIcon && (
          <AppIcon name="chevron-left" size={24} color={iconColor} />
        )}
        <Text style={styles.backText}>BACK</Text>
      </Pressable>
      {title && (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}
    </View>
  );
};
