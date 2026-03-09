import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { GlowCard, RuneButton } from '../../ui/cosmic';
import { getCbtGuideStyles } from './cbtGuideStyles';
import type { CBTCategory } from './cbtGuideData';

interface Props {
  category: CBTCategory;
  isCosmic: boolean;
  onFeaturePress: (route: string) => void;
}

export const CbtGuideCategoryCard = ({
  category,
  isCosmic,
  onFeaturePress,
}: Props) => {
  const styles = getCbtGuideStyles(isCosmic);

  return (
    <GlowCard glow="none" tone="base" padding="lg" style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryPillar}>{category.pillar}</Text>
        </View>
      </View>
      <Text style={styles.categoryDescription}>{category.description}</Text>
      <View style={styles.featuresRow}>
        {category.features.map((feature) =>
          isCosmic ? (
            <RuneButton
              key={feature.route}
              variant="secondary"
              size="sm"
              glow="medium"
              onPress={() => onFeaturePress(feature.route)}
            >
              {feature.name.toUpperCase()}
            </RuneButton>
          ) : (
            <Pressable
              key={feature.route}
              style={(state) => [
                styles.featureButton,
                (state as { pressed: boolean; hovered?: boolean }).hovered &&
                  styles.featureButtonHovered,
                state.pressed && styles.featureButtonPressed,
              ]}
              onPress={() => onFeaturePress(feature.route)}
            >
              <Text style={styles.featureButtonText}>
                {feature.name.toUpperCase()}
              </Text>
            </Pressable>
          ),
        )}
      </View>
    </GlowCard>
  );
};
