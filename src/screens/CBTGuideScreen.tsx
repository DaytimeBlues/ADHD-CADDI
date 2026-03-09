import React, { useMemo } from 'react';
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../theme/useTheme';
import { CosmicBackground } from '../ui/cosmic';
import { buildCbtCategories } from './cbt-guide/cbtGuideData';
import { CbtGuideCategoryCard } from './cbt-guide/CbtGuideCategoryCard';
import { CbtGuideOverviewCard } from './cbt-guide/CbtGuideOverviewCard';
import { getCbtGuideStyles } from './cbt-guide/cbtGuideStyles';

type ScreenNavigation = {
  navigate: (route: string) => void;
  goBack: () => void;
};

const CBTGuideScreen = ({ navigation }: { navigation: ScreenNavigation }) => {
  const { isCosmic } = useTheme();
  const styles = getCbtGuideStyles(isCosmic);
  const categories = useMemo(() => buildCbtCategories(), []);

  return (
    <CosmicBackground variant="ridge">
      <SafeAreaView
        style={styles.container}
        accessibilityLabel="CBT guide screen"
        accessibilityRole="summary"
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.maxWidthWrapper}>
            <View style={styles.header}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={(state) => [
                  styles.backButton,
                  (state as { pressed: boolean; hovered?: boolean }).hovered &&
                    styles.backButtonHovered,
                  state.pressed && styles.backButtonPressed,
                ]}
                accessibilityLabel="Go back"
                accessibilityRole="button"
              >
                <Text style={styles.backButtonText}>←</Text>
              </Pressable>
              <View>
                <Text style={styles.headerTitle}>CBT FOR ADHD</Text>
                <Text style={styles.headerSubtitle}>
                  EVIDENCE-BASED STRATEGIES
                </Text>
              </View>
            </View>

            <CbtGuideOverviewCard
              isCosmic={isCosmic}
              onOpenSource={(url) => Linking.openURL(url)}
            />

            {categories.map((category) => (
              <CbtGuideCategoryCard
                key={category.id}
                category={category}
                isCosmic={isCosmic}
                onFeaturePress={(route) => navigation.navigate(route)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
};

export default CBTGuideScreen;
