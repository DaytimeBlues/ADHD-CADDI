import React, { useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CosmicBackground, GlowCard, RuneButton } from '../ui/cosmic';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import { BackHeader } from '../components/ui/BackHeader';
import ActivationService from '../services/ActivationService';
import CheckInInsightService from '../services/CheckInInsightService';
import { LoggerService } from '../services/LoggerService';
import { useTheme } from '../theme/useTheme';
import { getCheckInScreenStyles } from './CheckInScreen.styles';
import { ROUTES } from '../navigation/routes';
import { pushWebPathForRoute } from '../navigation/webPathMap';
import { getRecommendationAction } from './CheckInScreen.utils';
import {
  CHECK_IN_ENERGY_LEVELS,
  CHECK_IN_MOODS,
  getRecommendationCopy,
} from './check-in/checkInData';
import { CheckInOptionGroup } from './check-in/CheckInOptionGroup';
import { TutorialBubble } from '../components/tutorial/TutorialBubble';
import { checkInOnboardingFlow } from '../store/useTutorialStore';
import { useFeatureTutorial } from '../hooks/useFeatureTutorial';

type CheckInNavigation = {
  navigate: (route: string) => void;
};

const CheckInScreen = ({ navigation }: { navigation?: CheckInNavigation }) => {
  const stackNavigation = useNavigation<CheckInNavigation>();
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [isRecommendationPending, setIsRecommendationPending] = useState(false);
  const lastRecordedSelectionRef = useRef<string | null>(null);
  const { isCosmic } = useTheme();
  const styles = getCheckInScreenStyles(isCosmic);
  const recommendation = getRecommendationCopy(mood, energy);
  const selectedMoodLabel =
    mood === null
      ? null
      : CHECK_IN_MOODS.find((option) => option.value === mood)?.label;
  const selectedEnergyLabel =
    energy === null
      ? null
      : CHECK_IN_ENERGY_LEVELS.find((option) => option.value === energy)?.label;

  const {
    currentTutorialStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTutorial,
    startTutorial,
  } = useFeatureTutorial(checkInOnboardingFlow);

  useEffect(() => {
    if (mood === null || energy === null) {
      return;
    }

    const selectionSignature = `${mood}:${energy}`;
    if (lastRecordedSelectionRef.current === selectionSignature) {
      return;
    }

    lastRecordedSelectionRef.current = selectionSignature;
    CheckInInsightService.recordCheckIn({
      timestamp: Date.now(),
      mood,
      energy,
    })
      .then(() => CheckInInsightService.getPersonalizedInsight())
      .then((result) => {
        setInsight(result);
      })
      .catch((error) => {
        LoggerService.warn({
          service: 'CheckInScreen',
          operation: 'loadPersonalizedInsight',
          message: 'Failed to refresh personalized insight',
          error,
        });
      });
  }, [energy, mood]);

  const handleRecommendationAction = async () => {
    if (mood === null || energy === null || isRecommendationPending) {
      return;
    }

    const action = getRecommendationAction(mood, energy);
    setIsRecommendationPending(true);

    try {
      if (action.route === 'Focus') {
        try {
          await ActivationService.requestPendingStart({
            source: action.source,
            requestedAt: new Date().toISOString(),
            context: {
              reason: 'checkin_high_readiness',
            },
          });
        } catch (error) {
          LoggerService.warn({
            service: 'CheckInScreen',
            operation: 'handleRecommendationAction',
            message: 'Failed to queue pending ignite start from check-in',
            error,
          });
        }
      }

      pushWebPathForRoute(action.route);
      (navigation ?? stackNavigation).navigate(action.route);
    } finally {
      setIsRecommendationPending(false);
    }
  };

  return (
    <CosmicBackground variant="moon">
      <SafeAreaView
        style={styles.container}
        accessibilityLabel="Check-in screen"
        accessibilityRole="summary"
      >
        <View style={styles.webContainer}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <BackHeader
              title="CHECK IN"
              fallbackRoute="Home"
              onBack={() => {
                pushWebPathForRoute(ROUTES.HOME);
                (navigation ?? stackNavigation).navigate(ROUTES.HOME);
              }}
            />
            <View style={styles.tourHeaderRow}>
              <Text style={styles.subtitle} testID="checkin-subtitle">
                HOW ARE YOU FEELING RIGHT NOW?
              </Text>
              <Pressable
                onPress={() => startTutorial()}
                accessibilityRole="button"
                accessibilityLabel="Start check-in tutorial"
                testID="checkin-tour-button"
                style={({ pressed }) => [
                  styles.tourButton,
                  pressed && styles.tourButtonPressed,
                ]}
              >
                <Text style={styles.tourButtonText}>TOUR</Text>
              </Pressable>
            </View>

            {currentTutorialStep && (
              <View style={styles.tutorialOverlay} testID="tutorial-overlay">
                <TutorialBubble
                  step={currentTutorialStep}
                  stepIndex={currentStepIndex}
                  totalSteps={totalSteps}
                  isFirstStep={currentStepIndex === 0}
                  isLastStep={currentStepIndex === totalSteps - 1}
                  onNext={nextStep}
                  onPrevious={previousStep}
                  onSkip={skipTutorial}
                />
              </View>
            )}
            <Text style={styles.helperText}>
              Pick the option that feels closest. Once you choose both mood and
              energy, CADDI suggests one clear next step.
            </Text>

            <GlowCard
              glow="soft"
              tone="base"
              padding="md"
              style={styles.rationaleCard}
            >
              <Text style={styles.rationaleTitle}>WHY THIS WORKS</Text>
              <Text style={styles.rationaleText}>
                Self-monitoring is a core CBT skill for ADHD. Tracking mood and
                energy helps identify patterns, predict challenges, and choose
                appropriate interventions. This metacognitive awareness creates
                space between feeling and action.
              </Text>
            </GlowCard>

            <CheckInOptionGroup
              isCosmic={isCosmic}
              title="MOOD"
              options={CHECK_IN_MOODS}
              selectedValue={mood}
              testIdPrefix="mood-option"
              onSelect={setMood}
            />

            <CheckInOptionGroup
              isCosmic={isCosmic}
              title="ENERGY"
              options={CHECK_IN_ENERGY_LEVELS}
              selectedValue={energy}
              testIdPrefix="energy-option"
              onSelect={setEnergy}
            />

            {selectedMoodLabel && selectedEnergyLabel && (
              <View style={styles.selectionSummary}>
                <Text style={styles.selectionSummaryLabel}>Current read</Text>
                <Text style={styles.selectionSummaryText}>
                  Mood: {selectedMoodLabel}. Energy: {selectedEnergyLabel}.
                </Text>
              </View>
            )}

            {recommendation && (
              <GlowCard
                glow="medium"
                tone="raised"
                padding="lg"
                style={styles.recommendation}
              >
                <Text style={styles.recommendationTitle}>
                  {recommendation.title}
                </Text>
                <Text
                  style={styles.recommendationSubtitle}
                  testID="recommendation-subtitle"
                >
                  RECOMMENDED FOR YOU
                </Text>
                <Text style={styles.recommendationText}>
                  {recommendation.desc}
                </Text>
                {insight && (
                  <View style={styles.insightBox}>
                    <Text style={styles.insightLabel}>Pattern note</Text>
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                )}
                <EvidenceBadge
                  tier="heuristic"
                  label="Guided next step"
                  style={styles.evidenceBadge}
                />
                <RuneButton
                  variant="primary"
                  size="md"
                  glow="medium"
                  onPress={handleRecommendationAction}
                  testID="recommendation-action-button"
                >
                  {mood !== null && energy !== null
                    ? getRecommendationAction(mood, energy).cta
                    : 'CONTINUE'}
                </RuneButton>
              </GlowCard>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
};

export { getRecommendationAction } from './CheckInScreen.utils';
export default CheckInScreen;
