import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../services/StorageService';
import UXMetricsService from '../services/UXMetricsService';

/**
 * TutorialStep interface - defines a single step in a tutorial flow
 */
export interface TutorialStep {
  /** Unique identifier for this step */
  id: string;
  /** Display title - short, punchy headline */
  title: string;
  /** The clinical/ADHD benefit - explains WHY this feature matters */
  whyText: string;
  /** The actionable instruction - explains WHAT to do */
  howText: string;
  /** Optional: Icon name from MaterialCommunityIcons */
  iconName?: string;
}

/**
 * TutorialFlow interface - defines a complete tutorial sequence
 */
export interface TutorialFlow {
  id: string;
  name: string;
  steps: TutorialStep[];
}

/**
 * Brain Dump onboarding flow - the first tutorial users see
 */
export const brainDumpOnboardingFlow: TutorialFlow = {
  id: 'brain-dump-onboarding',
  name: 'Brain Dump Introduction',
  steps: [
    {
      id: 'brain-dump-welcome',
      title: 'Brain Dump: Clear the Noise',
      whyText:
        'Racing thoughts drain your focus. Getting them out of your head and into the app frees up mental space.',
      howText:
        'This is your capture zone. Type to dump everything on your mind. Audio capture is planned for a later update.',
      iconName: 'brain',
    },
    {
      id: 'brain-dump-capture',
      title: 'Capture Everything',
      whyText:
        'ADHD brains are great at generating ideas, not holding them. Externalizing prevents mental overflow.',
      howText:
        "Type freely. Don't organize yet - just get it all out. You'll sort later.",
      iconName: 'microphone',
    },
    {
      id: 'brain-dump-sort',
      title: 'Sort with AI',
      whyText:
        'Decision fatigue is real. Let AI categorize so you can focus on doing, not organizing.',
      howText:
        'When you\'re done dumping, tap "Sort" and AI will organize your thoughts into actionable tasks.',
      iconName: 'sort-variant',
    },
    {
      id: 'brain-dump-complete',
      title: "You're Ready",
      whyText: 'Progress, not perfection. Even capturing one thought is a win.',
      howText:
        'Start dumping whenever your mind feels cluttered. Use the TOUR button here anytime you want to replay this guide.',
      iconName: 'check-circle',
    },
  ],
};

/**
 * Anchor breathing tutorial flow
 */
export const anchorOnboardingFlow: TutorialFlow = {
  id: 'anchor-onboarding',
  name: 'Anchor Breathing Introduction',
  steps: [
    {
      id: 'anchor-welcome',
      title: 'Anchor: Find Your Breath',
      whyText:
        "When anxiety spikes, your breath is always there — it's the fastest way to signal safety to your nervous system.",
      howText:
        'Choose a breathing pattern, press Start, and follow the circle. Your attention follows the rhythm.',
      iconName: 'anchor',
    },
    {
      id: 'anchor-patterns',
      title: 'Pick Your Pattern',
      whyText:
        'Different patterns serve different needs. Box breathing calms, 4-7-8 deeply relaxes.',
      howText:
        'Box (4-4-4-4): Great for focus. 4-7-8: Best before sleep. Pick whichever feels right.',
      iconName: 'grid',
    },
    {
      id: 'anchor-attention',
      title: 'Follow the Circle',
      whyText:
        'The expanding and contracting circle gives your wandering attention something to track — no willpower needed.',
      howText:
        'Inhale as the circle grows. Hold when full. Exhale as it shrinks. Let thoughts pass without chasing them.',
      iconName: 'circle-outline',
    },
    {
      id: 'anchor-complete',
      title: "You're Anchored",
      whyText:
        'Even one session resets your baseline. Consistency beats intensity.',
      howText:
        'Use Anchor whenever you feel scattered or overwhelmed. Replay this tour with the TOUR button.',
      iconName: 'check-circle',
    },
  ],
};

/**
 * Pomodoro tutorial flow
 */
export const pomodoroOnboardingFlow: TutorialFlow = {
  id: 'pomodoro-onboarding',
  name: 'Pomodoro Technique Introduction',
  steps: [
    {
      id: 'pomodoro-welcome',
      title: 'Pomodoro: Work in Bursts',
      whyText:
        'ADHD brains struggle with open-ended tasks. A timer creates artificial urgency that boosts follow-through.',
      howText:
        'Work for 25 minutes, then take a 5-minute break. After 4 pomodoros, take a longer 15-30 minute break.',
      iconName: 'timer-sand',
    },
    {
      id: 'pomodoro-start',
      title: 'Start the Timer',
      whyText:
        'The first 5 minutes are the hardest. Once you start, momentum takes over.',
      howText:
        'Press START. Commit to focusing until the timer rings. If a thought intrudes, jot it and return.',
      iconName: 'play-circle',
    },
    {
      id: 'pomodoro-break',
      title: 'Honor the Break',
      whyText:
        'Your brain consolidates learning during breaks. Moving helps — stretch, grab water, look away from screens.',
      howText:
        'When the timer rings, stop immediately. Stand up, move for 5 minutes. The break is not optional.',
      iconName: 'coffee',
    },
    {
      id: 'pomodoro-complete',
      title: "You're a Pomodoro Pro",
      whyText:
        "Four focused sessions is a solid day. Don't guilt yourself if you need more breaks.",
      howText:
        'Replay this tour anytime with the TOUR button. Track your sessions in your weekly metrics.',
      iconName: 'check-circle',
    },
  ],
};

/**
 * Fog Cutter tutorial flow
 */
export const fogCutterOnboardingFlow: TutorialFlow = {
  id: 'fog-cutter-onboarding',
  name: 'Fog Cutter Introduction',
  steps: [
    {
      id: 'fogcutter-welcome',
      title: 'Fog Cutter: Slice the Overwhelm',
      whyText:
        'A vague sense of "this is too much" triggers avoidance. Breaking it down makes it doable.',
      howText:
        'Enter the overwhelming task at the top. Then add micro-steps — tiny actions you can do right now.',
      iconName: 'weather-windy',
    },
    {
      id: 'fogcutter-microsteps',
      title: 'The Power of Micro-Steps',
      whyText:
        'ADHD brains respond to small, concrete actions. "Write essay" is paralyzing. "Open document" is not.',
      howText:
        'Each micro-step should take 1-5 minutes. "Open the essay template" beats "Start the essay."',
      iconName: 'format-list-numbered',
    },
    {
      id: 'fogcutter-ai',
      title: 'AI Helps You Start',
      whyText:
        'Starting is the hardest part. AI can suggest micro-steps to get you moving.',
      howText:
        'Tap "Get Help" to let AI suggest micro-steps for your task. Edit or accept — you\'re in control.',
      iconName: 'robot',
    },
    {
      id: 'fogcutter-complete',
      title: 'Fog Cleared',
      whyText:
        'A task that felt impossible is now a checklist. Progress is momentum.',
      howText:
        'Use Fog Cutter whenever a task feels too big. Replay with the TOUR button.',
      iconName: 'check-circle',
    },
  ],
};

/**
 * Check In tutorial flow
 */
export const checkInOnboardingFlow: TutorialFlow = {
  id: 'check-in-onboarding',
  name: 'Check In Introduction',
  steps: [
    {
      id: 'checkin-welcome',
      title: 'Check In: Track Your Baseline',
      whyText:
        'Patterns in mood and energy reveal triggers and predict capacity. Self-awareness is the foundation of self-regulation.',
      howText:
        "Rate how you're feeling and your energy level right now. It takes 20 seconds.",
      iconName: 'chart-bar',
    },
    {
      id: 'checkin-mood',
      title: 'Name Your Mood',
      whyText:
        'Labeling emotion reduces its intensity. "I\'m anxious" is less overwhelming than sitting in unnamed dread.',
      howText:
        "Select the word that best describes your current state. Don't overthink — go with your first instinct.",
      iconName: 'emoticon-outline',
    },
    {
      id: 'checkin-energy',
      title: 'Rate Your Energy',
      whyText:
        'Energy and motivation fluctuate daily. Matching tasks to your energy level prevents frustration.',
      howText:
        "Scale is 1 (depleted) to 5 (energized). A 2 trying to do a 5's worth of work leads to burnout.",
      iconName: 'lightning-bolt',
    },
    {
      id: 'checkin-complete',
      title: "You're Checked In",
      whyText:
        "Regular checking in builds self-awareness over time. You'll start to see patterns.",
      howText:
        'Check in daily for best results. Your history is private and stored on this device only.',
      iconName: 'check-circle',
    },
  ],
};

interface TutorialState {
  /** Global setting for whether first-run guided tutorials should auto-show */
  tutorialsEnabled: boolean;
  // Persistence state
  /** Whether the user has completed or skipped the onboarding */
  onboardingCompleted: boolean;
  /** Set of completed tutorial flow IDs */
  completedFlows: string[];
  /** Timestamp of last tutorial interaction */
  lastTutorialAt: number | null;

  // Transient UI state
  /** Currently active tutorial flow */
  activeFlow: TutorialFlow | null;
  /** Current step index within the active flow */
  currentStepIndex: number;
  /** Whether the tutorial overlay is visible */
  isVisible: boolean;

  // Actions
  startTutorial: (flow: TutorialFlow) => void;
  setTutorialsEnabled: (enabled: boolean) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorials: () => void;
  hasCompletedFlow: (flowId: string) => boolean;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set, get) => ({
      // Persistence defaults
      tutorialsEnabled: true,
      onboardingCompleted: false,
      completedFlows: [],
      lastTutorialAt: null,

      // Transient defaults
      activeFlow: null,
      currentStepIndex: 0,
      isVisible: false,

      startTutorial: (flow: TutorialFlow) => {
        UXMetricsService.track('tutorial_started', {
          flowId: flow.id,
          flowName: flow.name,
          stepCount: flow.steps.length,
        });

        set({
          activeFlow: flow,
          currentStepIndex: 0,
          isVisible: true,
        });
      },

      setTutorialsEnabled: (enabled: boolean) => {
        set({ tutorialsEnabled: enabled });
      },

      nextStep: () => {
        const { activeFlow, currentStepIndex } = get();
        if (!activeFlow) {
          return;
        }

        const currentStep = activeFlow.steps[currentStepIndex];
        const nextIndex = currentStepIndex + 1;

        // Track step completion
        UXMetricsService.track('tutorial_step_completed', {
          flowId: activeFlow.id,
          stepId: currentStep.id,
          stepIndex: currentStepIndex,
          stepTitle: currentStep.title,
        });

        if (nextIndex < activeFlow.steps.length) {
          set({ currentStepIndex: nextIndex });
        } else {
          // Complete the tutorial
          get().completeTutorial();
        }
      },

      previousStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set({ currentStepIndex: currentStepIndex - 1 });
        }
      },

      skipTutorial: () => {
        const { activeFlow, currentStepIndex } = get();
        if (!activeFlow) {
          return;
        }

        const currentStep = activeFlow.steps[currentStepIndex];

        UXMetricsService.track('tutorial_skipped', {
          flowId: activeFlow.id,
          atStepId: currentStep?.id,
          atStepIndex: currentStepIndex,
          stepTitle: currentStep?.title,
        });

        set({
          isVisible: false,
          activeFlow: null,
          currentStepIndex: 0,
          onboardingCompleted: true,
          lastTutorialAt: Date.now(),
        });
      },

      completeTutorial: () => {
        const { activeFlow, completedFlows } = get();
        if (!activeFlow) {
          return;
        }

        const updatedCompletedFlows = [...completedFlows];
        if (!updatedCompletedFlows.includes(activeFlow.id)) {
          updatedCompletedFlows.push(activeFlow.id);
        }

        UXMetricsService.track('tutorial_completed', {
          flowId: activeFlow.id,
          flowName: activeFlow.name,
        });

        set({
          isVisible: false,
          activeFlow: null,
          currentStepIndex: 0,
          onboardingCompleted: true,
          completedFlows: updatedCompletedFlows,
          lastTutorialAt: Date.now(),
        });
      },

      resetTutorials: () => {
        UXMetricsService.track('tutorial_reset', {});

        set({
          tutorialsEnabled: true,
          onboardingCompleted: false,
          completedFlows: [],
          lastTutorialAt: null,
          isVisible: false,
          activeFlow: null,
          currentStepIndex: 0,
        });
      },

      hasCompletedFlow: (flowId: string) => {
        return get().completedFlows.includes(flowId);
      },
    }),
    {
      name: 'spark-tutorial-storage',
      storage: createJSONStorage(() => zustandStorage),
      // Only persist these fields
      partialize: (state) => ({
        tutorialsEnabled: state.tutorialsEnabled,
        onboardingCompleted: state.onboardingCompleted,
        completedFlows: state.completedFlows,
        lastTutorialAt: state.lastTutorialAt,
      }),
    },
  ),
);

export default useTutorialStore;
