import React, { useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ROUTES } from '../navigation/routes';
import { useTheme } from '../theme/useTheme';
import { CosmicBackground } from '../ui/cosmic';
import { NightAweBackground } from '../ui/nightAwe';
import { isWeb } from '../utils/PlatformUtils';
import {
  BrainDumpItem,
  BrainDumpInput,
  BrainDumpActionBar,
  BrainDumpRationale,
  BrainDumpGuide,
  BrainDumpVoiceRecord,
  IntegrationPanel,
} from '../components/brain-dump';
import { FeatureGuideButton } from '../components/tutorial/FeatureGuideButton';
import { FeatureTutorialOverlay } from '../components/tutorial/FeatureTutorialOverlay';
import { BackHeader } from '../components/ui/BackHeader';
import useBrainDump from '../hooks/useBrainDump';
import { brainDumpOnboardingFlow } from '../store/useTutorialStore';
import { useFeatureTutorial } from '../hooks/useFeatureTutorial';
import { useTaskStore } from '../store/useTaskStore';
import { getBrainDumpStyles } from './brain-dump/brainDumpStyles';
import { BrainDumpSortedSection } from './brain-dump/BrainDumpSortedSection';

type BrainDumpRouteParams = {
  autoRecord?: boolean;
};

type BrainDumpRoute = RouteProp<
  Record<typeof ROUTES.BRAIN_DUMP, BrainDumpRouteParams>,
  typeof ROUTES.BRAIN_DUMP
>;

const BrainDumpScreen = () => {
  const { isCosmic, isNightAwe, t, variant } = useTheme();
  const styles = useMemo(() => getBrainDumpStyles(variant, t), [t, variant]);
  const loadingSpinnerColor = isNightAwe
    ? t.colors.nightAwe?.feature?.brainDump || t.colors.semantic.primary
    : t.colors.brand[500];
  const route = useRoute<BrainDumpRoute>();
  const storeTasks = useTaskStore((state) => state.tasks);
  const activeTasks = useMemo(
    () => storeTasks.filter((task) => !task.completed),
    [storeTasks],
  );
  const {
    currentTutorialStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTutorial,
    startTutorial,
  } = useFeatureTutorial(brainDumpOnboardingFlow);

  const {
    items,
    recordingState,
    recordingError,
    isSorting,
    isLoading,
    sortingError,
    sortedItems,
    googleAuthRequired,
    isConnectingGoogle,
    showGuide,
    groupedSortedItems,
    addItem,
    deleteItem,
    clearAll,
    handleRecordPress,
    handleAISort,
    handleConnectGoogle,
    dismissGuide,
    getPriorityStyle,
  } = useBrainDump(route.params?.autoRecord);

  const content = (
    <SafeAreaView
      style={styles.container}
      accessibilityLabel="Brain dump screen"
      accessibilityRole="summary"
    >
      <View style={styles.centerContainer}>
        <View style={styles.contentWrapper}>
          <BackHeader title="BRAIN_DUMP" />
          <View style={styles.header}>
            <Text style={styles.title}>CAPTURE_SYSTEM</Text>
            <View style={styles.headerLine} />
            <FeatureGuideButton
              onPress={() => startTutorial()}
              accessibilityLabel="Replay guide for brain dump"
              testID="brain-dump-tour-button"
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

          <BrainDumpRationale />

          <BrainDumpInput onAdd={addItem} />

          <BrainDumpGuide showGuide={showGuide} onDismiss={dismissGuide} />

          <BrainDumpVoiceRecord
            recordingState={recordingState}
            recordingError={recordingError}
            onRecordPress={handleRecordPress}
          />

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={loadingSpinnerColor} />
              <Text style={styles.loadingText}>LOADING...</Text>
            </View>
          ) : (
            <BrainDumpActionBar
              itemCount={items.length}
              isSorting={isSorting}
              onSort={handleAISort}
              onClear={clearAll}
            />
          )}

          {sortingError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{sortingError}</Text>
              {googleAuthRequired && !isWeb && (
                <Pressable
                  onPress={handleConnectGoogle}
                  disabled={isConnectingGoogle}
                  style={({ pressed }) => [
                    styles.connectButton,
                    isConnectingGoogle && styles.connectButtonDisabled,
                    pressed && styles.connectButtonPressed,
                  ]}
                >
                  <Text style={styles.connectButtonText}>
                    {isConnectingGoogle ? 'CONNECTING...' : 'CONNECT GOOGLE'}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          <IntegrationPanel />

          {activeTasks.length > 0 && (
            <View style={styles.sortedSection}>
              <Text style={styles.sortedHeader}>ACTIVE_TASKS</Text>
              {activeTasks.map((taskItem) => (
                <View key={taskItem.id} style={styles.sortedItemRow}>
                  <Text style={styles.sortedItemText}>{taskItem.title}</Text>
                </View>
              ))}
            </View>
          )}

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BrainDumpItem item={item} onDelete={deleteItem} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              !isLoading ? (
                <Text style={[styles.title, styles.emptyState]}>
                  _AWAITING_INPUT
                </Text>
              ) : null
            }
            ListFooterComponent={
              sortedItems.length > 0 ? (
                <BrainDumpSortedSection
                  groupedSortedItems={groupedSortedItems}
                  styles={{
                    sortedSection: styles.sortedSection,
                    sortedHeader: styles.sortedHeader,
                    categorySection: styles.categorySection,
                    categoryTitle: styles.categoryTitle,
                    sortedItemRow: styles.sortedItemRow,
                    sortedItemText: styles.sortedItemText,
                    priorityBadge: styles.priorityBadge,
                    priorityText: styles.priorityText,
                  }}
                  getPriorityStyle={getPriorityStyle}
                />
              ) : null
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );

  if (isNightAwe) {
    return (
      <NightAweBackground
        variant="focus"
        activeFeature="brainDump"
        motionMode="idle"
        dimmer={false}
      >
        {content}
      </NightAweBackground>
    );
  }

  if (isCosmic) {
    return (
      <View style={styles.container}>
        <CosmicBackground variant="nebula">
          <View style={StyleSheet.absoluteFillObject} />
        </CosmicBackground>
        <View style={StyleSheet.absoluteFillObject}>{content}</View>
      </View>
    );
  }

  return content;
};

export default BrainDumpScreen;
