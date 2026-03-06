import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { CosmicBackground, GlowCard, RuneButton } from '../ui/cosmic';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import ActivationService from '../services/ActivationService';
import { ROUTES } from '../navigation/routes';
import { useTheme } from '../theme/useTheme';
import CheckInInsightService from '../services/CheckInInsightService';
import { LoggerService } from '../services/LoggerService';
import { getCheckInScreenStyles } from './CheckInScreen.styles';
import { getRecommendationAction } from './CheckInScreen.utils';
export { getRecommendationAction } from './CheckInScreen.utils';

type CheckInNavigation = {
  navigate: (route: string) => void;
};

const CheckInScreen = ({ navigation }: { navigation?: CheckInNavigation }) => {
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [isRecommendationPending, setIsRecommendationPending] = useState(false);

  const { isCosmic } = useTheme();

  React.useEffect(() => {
    if (mood !== null && energy !== null) {
      const fetchInsight = async () => {
        const result = await CheckInInsightService.getPersonalizedInsight();
        if (result) {
          setInsight(result);
        }
      };
      fetchInsight();
    }
  }, [mood, energy]);

  const moods = [
    {
      quote: '“I am a forest, and a night of dark trees.”',
      author: 'Nietzsche',
      label: 'Low',
      value: 1,
    },
    {
      quote: '“A melancholy of mine own.”',
      author: 'Shakespeare',
      label: 'Down',
      value: 2,
    },
    { quote: '“I simply am.”', author: 'Kafka', label: 'Neutral', value: 3 },
    {
      quote: '“I celebrate myself, and sing myself.”',
      author: 'Whitman',
      label: 'Good',
      value: 4,
    },
    {
      quote: '“I dwell in possibility.”',
      author: 'Dickinson',
      label: 'Great',
      value: 5,
    },
  ];

  const energyLevels = [
    {
      quote: '“I am worn out with dreams.”',
      author: 'Wilde',
      label: 'Drained',
      value: 1,
    },
    {
      quote: '“A strange languor has come over me.”',
      author: 'Shelley',
      label: 'Low',
      value: 2,
    },
    {
      quote: '“I am awake, and the world is awake.”',
      author: 'Thoreau',
      label: 'Medium',
      value: 3,
    },
    {
      quote: '“There is a vitality, a life force.”',
      author: 'Graham',
      label: 'High',
      value: 4,
    },
    {
      quote: '“I contain multitudes.”',
      author: 'Whitman',
      label: 'Full',
      value: 5,
    },
  ];

  const getRecommendation = () => {
    if (mood === null || energy === null) {
      return null;
    }
    if (mood <= 2 && energy <= 2) {
      return {
        title: '🌱 GENTLE START',
        desc: 'Try the Anchor breathing exercise to ground yourself.',
      };
    }
    if (mood >= 4 && energy >= 4) {
      return {
        title: '🚀 RIDE THE WAVE',
        desc: 'Perfect time for a Ignite focus session!',
      };
    }
    if (energy <= 2) {
      return {
        title: '💪 MICRO TASK',
        desc: 'Try Fog Cutter with just one micro-step.',
      };
    }
    return { title: '📝 BRAIN DUMP', desc: 'Clear your mind before starting.' };
  };

  const recommendation = getRecommendation();

  const handleRecommendationAction = async () => {
    if (mood === null || energy === null || isRecommendationPending) {
      return;
    }

    const action = getRecommendationAction(mood, energy);
    setIsRecommendationPending(true);

    try {
      if (action.route === ROUTES.FOCUS) {
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

      navigation?.navigate(action.route);
    } finally {
      setIsRecommendationPending(false);
    }
  };

  const styles = getCheckInScreenStyles(isCosmic);

  return (
    <CosmicBackground variant="moon">
      <SafeAreaView style={styles.container}>
        <View style={styles.webContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>CHECK IN</Text>
            <Text style={styles.subtitle}>HOW ARE YOU FEELING RIGHT NOW?</Text>

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

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MOOD</Text>
              <View style={styles.options}>
                {moods.map((m) => (
                  <Pressable
                    key={m.value}
                    testID={`mood-option-${m.value}`}
                    style={({
                      pressed,
                      hovered,
                    }: {
                      pressed: boolean;
                      hovered?: boolean;
                    }) => [
                      styles.option,
                      mood === m.value && styles.selected,
                      hovered && !mood && styles.optionHovered,
                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => setMood(m.value)}
                  >
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.label,
                          mood === m.value && styles.selectedLabel,
                        ]}
                      >
                        {m.label.toUpperCase()}
                      </Text>
                      <Text
                        style={[
                          styles.quote,
                          mood === m.value && styles.selectedQuote,
                        ]}
                      >
                        {m.quote}
                      </Text>
                      <Text style={styles.author}>— {m.author}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ENERGY</Text>
              <View style={styles.options}>
                {energyLevels.map((e) => (
                  <Pressable
                    key={e.value}
                    testID={`energy-option-${e.value}`}
                    style={({
                      pressed,
                      hovered,
                    }: {
                      pressed: boolean;
                      hovered?: boolean;
                    }) => [
                      styles.option,
                      energy === e.value && styles.selected,
                      hovered && !energy && styles.optionHovered,
                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => setEnergy(e.value)}
                  >
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.label,
                          energy === e.value && styles.selectedLabel,
                        ]}
                      >
                        {e.label.toUpperCase()}
                      </Text>
                      <Text
                        style={[
                          styles.quote,
                          energy === e.value && styles.selectedQuote,
                        ]}
                      >
                        {e.quote}
                      </Text>
                      <Text style={styles.author}>— {e.author}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

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
                <Text style={styles.recommendationSubtitle}>
                  RECOMMENDED FOR YOU
                </Text>
                <Text style={styles.recommendationText}>
                  {recommendation.desc}
                </Text>
                {insight && (
                  <View style={styles.insightBox}>
                    <Text style={styles.insightLabel}>AI_INSIGHT:</Text>
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                )}
                <EvidenceBadge tier="heuristic" style={styles.evidenceBadge} />
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
          </View>
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
};

export default CheckInScreen;
