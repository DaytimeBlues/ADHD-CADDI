import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CosmicBackground, GlowCard, RuneButton } from '../ui/cosmic';
import ChatService, { ChatMessage } from '../services/ChatService';
import { Tokens } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { isIOS } from '../utils/PlatformUtils';
import { BackHeader } from '../components/ui/BackHeader';
import { ROUTES } from '../navigation/routes';
import { pushWebPathForRoute } from '../navigation/webPathMap';
import { TutorialBubble } from '../components/tutorial/TutorialBubble';
import { FeatureGuideButton } from '../components/tutorial/FeatureGuideButton';
import { chatOnboardingFlow } from '../store/useTutorialStore';
import { useFeatureTutorial } from '../hooks/useFeatureTutorial';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const { isCosmic } = useTheme();
  const {
    currentTutorialStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTutorial,
    startTutorial,
  } = useFeatureTutorial(chatOnboardingFlow);

  useEffect(() => {
    return ChatService.subscribe((msgs) => {
      setMessages(msgs.filter((m) => m.role !== 'system'));
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) {
      return;
    }
    const text = inputText;
    setInputText('');
    await ChatService.sendMessage(text);
  };

  const styles = getStyles(isCosmic);

  return (
    <CosmicBackground variant="nebula">
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={isIOS ? 90 : 0}
        accessibilityLabel="Chat screen"
        accessibilityRole="summary"
      >
        <BackHeader
          title="CHAT"
          fallbackRoute={ROUTES.HOME}
          onBack={() => {
            pushWebPathForRoute(ROUTES.HOME);
            navigation.navigate(ROUTES.HOME as never);
          }}
        />
        <View style={styles.header}>
          <Text style={styles.title}>CADDI_ASSISTANT</Text>
          <FeatureGuideButton
            onPress={() => startTutorial()}
            accessibilityLabel="Replay guide for chat"
            testID="chat-guide-button"
          />
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

        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageContent}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.role === 'user' ? styles.userRow : styles.assistantRow,
              ]}
            >
              <GlowCard
                glow={msg.role === 'assistant' ? 'soft' : 'none'}
                padding="sm"
                style={[
                  styles.bubble,
                  msg.role === 'user'
                    ? styles.userBubble
                    : styles.assistantBubble,
                ]}
              >
                <Text style={styles.messageText}>{msg.content}</Text>
              </GlowCard>
            </View>
          ))}
          {messages.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                HOW CAN I HELP YOU FOCUS TODAY?
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="TYPE_YOUR_THOUGHTS..."
            placeholderTextColor={Tokens.colors.text.placeholder}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            multiline
          />
          <RuneButton
            variant="primary"
            size="sm"
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            SEND
          </RuneButton>
        </View>
      </KeyboardAvoidingView>
    </CosmicBackground>
  );
};

const getStyles = (isCosmic: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: Tokens.spacing[4],
      padding: Tokens.spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: isCosmic
        ? 'rgba(139, 92, 246, 0.2)'
        : Tokens.colors.neutral.borderSubtle,
    },
    tutorialOverlay: {
      paddingHorizontal: Tokens.spacing[4],
      paddingTop: Tokens.spacing[3],
    },
    title: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.sm,
      fontWeight: '700',
      color: isCosmic ? '#8B5CF6' : Tokens.colors.brand[500],
      letterSpacing: 2,
    },
    messageList: {
      flex: 1,
    },
    messageContent: {
      padding: Tokens.spacing[4],
      paddingBottom: Tokens.spacing[8],
    },
    messageRow: {
      marginBottom: Tokens.spacing[4],
      maxWidth: '85%',
    },
    userRow: {
      alignSelf: 'flex-end',
    },
    assistantRow: {
      alignSelf: 'flex-start',
    },
    bubble: {
      borderRadius: 12,
    },
    userBubble: {
      backgroundColor: isCosmic
        ? 'rgba(139, 92, 246, 0.2)'
        : Tokens.colors.brand[900],
      borderBottomRightRadius: 2,
    },
    assistantBubble: {
      backgroundColor: isCosmic ? '#0B1022' : Tokens.colors.neutral.darker,
      borderBottomLeftRadius: 2,
    },
    messageText: {
      fontFamily: Tokens.type.fontFamily.sans,
      fontSize: Tokens.type.sm,
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
      lineHeight: 20,
    },
    emptyContainer: {
      paddingVertical: 100,
      alignItems: 'center',
    },
    emptyText: {
      fontFamily: Tokens.type.fontFamily.mono,
      fontSize: Tokens.type.xs,
      color: isCosmic ? '#B9C2D9' : Tokens.colors.text.tertiary,
      opacity: 0.5,
    },
    inputArea: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: Tokens.spacing[4],
      backgroundColor: isCosmic
        ? 'rgba(7, 7, 18, 0.9)'
        : Tokens.colors.neutral.darkest,
      borderTopWidth: 1,
      borderTopColor: isCosmic
        ? 'rgba(139, 92, 246, 0.2)'
        : Tokens.colors.neutral.borderSubtle,
      gap: Tokens.spacing[3],
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      backgroundColor: isCosmic
        ? 'rgba(11, 16, 34, 0.8)'
        : Tokens.colors.neutral.darker,
      borderRadius: 22,
      paddingHorizontal: Tokens.spacing[4],
      paddingVertical: Tokens.spacing[3],
      color: isCosmic ? '#EEF2FF' : Tokens.colors.text.primary,
      fontFamily: Tokens.type.fontFamily.sans,
      fontSize: Tokens.type.sm,
    },
  });

export default ChatScreen;
