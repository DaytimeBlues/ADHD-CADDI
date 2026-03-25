import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnchorActiveSession } from '../components/anchor/AnchorActiveSession';
import { AnchorHeader } from '../components/anchor/AnchorHeader';
import { AnchorPatternSelector } from '../components/anchor/AnchorPatternSelector';
import { AnchorRationale } from '../components/anchor/AnchorRationale';
import { BackHeader } from '../components/ui/BackHeader';
import { ROUTES } from '../navigation/routes';
import { pushWebPathForRoute } from '../navigation/webPathMap';
import { PATTERNS, useAnchorSession } from '../hooks/useAnchorSession';
import { Tokens } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { CosmicBackground } from '../ui/cosmic';
import { FeatureGuideButton } from '../components/tutorial/FeatureGuideButton';
import { FeatureTutorialOverlay } from '../components/tutorial/FeatureTutorialOverlay';
import { anchorOnboardingFlow } from '../store/useTutorialStore';
import { useFeatureTutorial } from '../hooks/useFeatureTutorial';

const AnchorScreen = () => {
  const { isCosmic } = useTheme();
  const styles = getStyles(isCosmic);
  const navigation = useNavigation();
  const {
    pattern,
    count,
    isActive,
    startPattern,
    stopPattern,
    getPhaseText,
    getCircleScale,
  } = useAnchorSession();
  const {
    currentTutorialStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTutorial,
    guideButtonLabel,
    isReplayTutorial,
    startTutorial,
  } = useFeatureTutorial(anchorOnboardingFlow);

  const content = (
    <SafeAreaView
      style={styles.container}
      accessibilityLabel="Anchor breathing screen"
      accessibilityRole="summary"
    >
      <View style={styles.scrollContent}>
        <View style={styles.content}>
          <BackHeader
            title="ANCHOR"
            fallbackRoute="Home"
            onBack={() => {
              pushWebPathForRoute(ROUTES.HOME);
              navigation.navigate(ROUTES.HOME as never);
            }}
          />
          <View style={styles.headerRow}>
            <AnchorHeader />
            <FeatureGuideButton
              onPress={() => startTutorial()}
              accessibilityLabel="Open tutorial for anchor"
              testID="anchor-tour-button"
              label={guideButtonLabel}
              isSecondary={isReplayTutorial}
            />
          </View>

          <FeatureTutorialOverlay
            currentTutorialStep={currentTutorialStep}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            onNext={nextStep}
            onPrevious={previousStep}
            onSkip={skipTutorial}
            style={styles.tutorialOverlay}
          />

          <AnchorRationale />
          {isActive && pattern ? (
            <AnchorActiveSession
              patternConfig={PATTERNS[pattern]}
              phaseText={getPhaseText()}
              circleScale={getCircleScale()}
              count={count}
              onStop={stopPattern}
            />
          ) : (
            <AnchorPatternSelector
              patterns={PATTERNS}
              onSelectPattern={startPattern}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );

  if (isCosmic) {
    return (
      <CosmicBackground variant="moon" testID="anchor-cosmic-background">
        {content}
      </CosmicBackground>
    );
  }

  return content;
};

const getStyles = (isCosmic: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isCosmic ? 'transparent' : Tokens.colors.neutral.darkest,
    },
    scrollContent: {
      flex: 1,
      alignItems: 'center',
    },
    content: {
      flex: 1,
      width: '100%',
      maxWidth: Tokens.layout.maxWidth.prose,
      paddingHorizontal: Tokens.spacing[6],
      paddingTop: Tokens.spacing[6],
      paddingBottom: Tokens.spacing[8],
      alignItems: 'center',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: Tokens.spacing[4],
    },
    tutorialOverlay: {
      width: '100%',
      marginBottom: Tokens.spacing[4],
    },
  });

export default AnchorScreen;
