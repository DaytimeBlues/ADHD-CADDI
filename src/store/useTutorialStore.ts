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
  /** Optional: tutorial target id to spotlight on the active screen */
  targetId?: string;
  /** Optional: preferred placement for the tutorial card */
  placement?: 'auto' | 'top' | 'bottom' | 'center';
}

/**
 * TutorialFlow interface - defines a complete tutorial sequence
 */
export interface TutorialFlow {
  id: string;
  name: string;
  steps: TutorialStep[];
  autoStart?: boolean;
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
      targetId: 'brain-dump-input',
      placement: 'bottom',
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
        'Start dumping whenever your mind feels cluttered. Use Replay Guide here anytime you want to see this guide again.',
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
        'Use Anchor whenever you feel scattered or overwhelmed. Use Replay Guide whenever you want to review these steps again.',
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
        'Use Replay Guide anytime you want to review how this screen works. Track your sessions in your weekly metrics.',
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
        'Use Fog Cutter whenever a task feels too big. Use Replay Guide if you want to walk through this screen again.',
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

export const inboxOnboardingFlow: TutorialFlow = {
  id: 'inbox-onboarding',
  name: 'Capture Inbox Introduction',
  autoStart: false,
  steps: [
    {
      id: 'inbox-purpose',
      title: 'Inbox: Review Captured Items',
      whyText:
        'Quick capture is only useful if you can process it later without losing anything important.',
      howText:
        'This screen holds captured notes until you decide whether each one should become a task, note, or be discarded.',
      iconName: 'inbox-arrow-down',
    },
    {
      id: 'inbox-filters',
      title: 'Filter by Status',
      whyText:
        'Separating unreviewed, promoted, and discarded items reduces clutter and helps you focus on the next decision.',
      howText:
        'Use the tabs to narrow the list when you only want to review fresh captures or check what you already processed.',
      iconName: 'filter-variant',
    },
    {
      id: 'inbox-actions',
      title: 'Choose the Next Home',
      whyText:
        'ADHD-friendly capture works best when the review step is short and decisive.',
      howText:
        'For each item, send it to Task, keep it as a Note, or discard it if it is no longer useful.',
      iconName: 'check-circle',
    },
  ],
};

export const chatOnboardingFlow: TutorialFlow = {
  id: 'chat-onboarding',
  name: 'Chat Guide',
  autoStart: false,
  steps: [
    {
      id: 'chat-purpose',
      title: 'Chat: Ask for a Next Step',
      whyText:
        'When your brain is stuck, a short back-and-forth can reduce the effort needed to decide what to do next.',
      howText:
        'Use this screen to ask for help reframing, clarifying, or reducing a task into something more doable.',
      iconName: 'message-text-outline',
    },
    {
      id: 'chat-thread',
      title: 'Keep the Thread Focused',
      whyText:
        'Short, focused prompts reduce overwhelm and make the response easier to act on.',
      howText:
        'Read the conversation area from top to bottom. Keep each question narrow so the answer stays useful.',
      iconName: 'format-list-bulleted',
    },
    {
      id: 'chat-compose',
      title: 'Send One Clear Prompt',
      whyText:
        'A single clear prompt is easier to answer well than a long tangled paragraph.',
      howText:
        'Type what you are stuck on, then press Send. If needed, follow up with one more question rather than rewriting everything.',
      iconName: 'send',
    },
  ],
};

export const tasksOnboardingFlow: TutorialFlow = {
  id: 'tasks-onboarding',
  name: 'Tasks Guide',
  autoStart: false,
  steps: [
    {
      id: 'tasks-purpose',
      title: 'Tasks: See the Work Clearly',
      whyText:
        'A visible task list lowers cognitive load because you do not have to keep everything in working memory.',
      howText:
        'Use this screen to capture tasks, review active work, and keep completed items from mixing with what still needs attention.',
      iconName: 'text-box-outline',
    },
    {
      id: 'tasks-add',
      title: 'Add the Next Task Fast',
      whyText:
        'The faster you can write a task down, the less likely it is to disappear while you are trying to stay focused.',
      howText:
        'Type a short task into the input and add it immediately. Keep it concrete enough that you can imagine starting it.',
      iconName: 'plus-circle',
    },
    {
      id: 'tasks-review',
      title: 'Review by Status',
      whyText:
        'Switching between all, active, and done helps you narrow attention to what matters right now.',
      howText:
        'Use the stats and filter tabs to scan the list, then complete or delete items to keep the queue current.',
      iconName: 'check-circle',
    },
  ],
};

interface TutorialState {
  /** Whether the guide selection modal is visible */
  isGuideMenuVisible: boolean;
  /** Global setting for whether first-run guided tutorials should auto-show */
  tutorialsEnabled: boolean;
  // Persistence state
  /** Whether the user has completed or skipped the onboarding */
  onboardingCompleted: boolean;
  /** Set of completed tutorial flow IDs */
  completedFlows: string[];
  /** Set of flows the user has dismissed or completed at least once */
  interactedFlows: string[];
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
  setGuideMenuVisible: (visible: boolean) => void;
  setTutorialsEnabled: (enabled: boolean) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorials: () => void;
  hasCompletedFlow: (flowId: string) => boolean;
  hasInteractedWithFlow: (flowId: string) => boolean;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set, get) => ({
      // Persistence defaults
      tutorialsEnabled: true,
      onboardingCompleted: false,
      completedFlows: [],
      interactedFlows: [],
      lastTutorialAt: null,

      // Transient defaults
      activeFlow: null,
      currentStepIndex: 0,
      isVisible: false,
      isGuideMenuVisible: false,

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
          isGuideMenuVisible: false,
        });
      },

      setGuideMenuVisible: (visible: boolean) => {
        set({ isGuideMenuVisible: visible });
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
        const { activeFlow, currentStepIndex, interactedFlows } = get();
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

        const updatedInteractedFlows = [...interactedFlows];
        if (!updatedInteractedFlows.includes(activeFlow.id)) {
          updatedInteractedFlows.push(activeFlow.id);
        }

        set({
          isVisible: false,
          isGuideMenuVisible: false,
          activeFlow: null,
          currentStepIndex: 0,
          onboardingCompleted: true,
          interactedFlows: updatedInteractedFlows,
          lastTutorialAt: Date.now(),
        });
      },

      completeTutorial: () => {
        const { activeFlow, completedFlows, interactedFlows } = get();
        if (!activeFlow) {
          return;
        }

        const updatedCompletedFlows = [...completedFlows];
        if (!updatedCompletedFlows.includes(activeFlow.id)) {
          updatedCompletedFlows.push(activeFlow.id);
        }

        const updatedInteractedFlows = [...interactedFlows];
        if (!updatedInteractedFlows.includes(activeFlow.id)) {
          updatedInteractedFlows.push(activeFlow.id);
        }

        UXMetricsService.track('tutorial_completed', {
          flowId: activeFlow.id,
          flowName: activeFlow.name,
        });

        set({
          isVisible: false,
          isGuideMenuVisible: false,
          activeFlow: null,
          currentStepIndex: 0,
          onboardingCompleted: true,
          completedFlows: updatedCompletedFlows,
          interactedFlows: updatedInteractedFlows,
          lastTutorialAt: Date.now(),
        });
      },

      resetTutorials: () => {
        UXMetricsService.track('tutorial_reset', {});

        set({
          tutorialsEnabled: true,
          onboardingCompleted: false,
          completedFlows: [],
          interactedFlows: [],
          lastTutorialAt: null,
          isVisible: false,
          isGuideMenuVisible: false,
          activeFlow: null,
          currentStepIndex: 0,
        });
      },

      hasCompletedFlow: (flowId: string) => {
        return get().completedFlows.includes(flowId);
      },
      hasInteractedWithFlow: (flowId: string) => {
        return get().interactedFlows.includes(flowId);
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
        interactedFlows: state.interactedFlows,
        lastTutorialAt: state.lastTutorialAt,
      }),
    },
  ),
);

export default useTutorialStore;
