import { config } from '../config';
import { LoggerService } from './LoggerService';
import { createOperationContext } from './OperationContext';
import { fetchWithPolicy } from './network/requestPolicy';

export interface MicroStep {
  id: string;
  text: string;
}

interface MicroStepsResponse {
  steps: string[];
}

const DEFAULT_FALLBACK_STEPS: MicroStep[] = [
  { id: '1', text: 'Write down what this task involves' },
  { id: '2', text: 'Identify the very first physical action' },
  { id: '3', text: 'Set a 5-minute timer and start only that first action' },
];

const buildFallbackSteps = (taskTitle: string): MicroStep[] => {
  const title = taskTitle.trim();
  if (!title) {
    return DEFAULT_FALLBACK_STEPS;
  }

  const normalizedTitle = title.toLowerCase();
  const stepTexts = normalizedTitle.includes('email')
    ? [
        'Open your email app and start a new draft',
        'Write a short subject line for the email',
        'Add one sentence saying why you are writing',
        'Add the single next detail or request the person needs',
        'Read it once, then send or save the draft',
      ]
    : normalizedTitle.includes('bug')
      ? [
          `Write down the exact bug you need to fix in "${title}"`,
          'Reproduce the bug once and note what actually happens',
          'Find the smallest file or function connected to the problem',
          'Make one focused change and test that specific path again',
          'Save a note for the next follow-up if anything is still unclear',
        ]
      : normalizedTitle.includes('study')
        ? [
            `Pick the single topic you need to study first for "${title}"`,
            'Open the notes or textbook to the exact section you need',
            'Set a 10-minute timer for one focused review block',
            'Write down one key idea or question from that block',
            'Decide the next tiny review step before you stop',
          ]
        : normalizedTitle.includes('clean')
          ? [
              `Choose one visible area to start cleaning for "${title}"`,
              'Throw away obvious trash first',
              'Put similar items into one pile or basket',
              'Clean one surface completely before moving on',
              'Stop after one pass or set a short timer for the next round',
            ]
          : [
              `Write one clear outcome for "${title}"`,
              `List the first visible action you can do for "${title}"`,
              'Set a short timer and start only that first action',
              'Capture the next action before you lose momentum',
              'Stop or save your place once the first tiny chunk is done',
            ];

  return stepTexts.map((text, index) => ({
    id: String(index + 1),
    text,
  }));
};

function parseMicroSteps(payload: unknown): MicroStep[] {
  if (
    !payload ||
    typeof payload !== 'object' ||
    !Array.isArray((payload as MicroStepsResponse).steps)
  ) {
    return DEFAULT_FALLBACK_STEPS;
  }

  const steps = (payload as MicroStepsResponse).steps
    .filter((s) => typeof s === 'string' && s.trim().length > 0)
    .slice(0, 5);

  if (steps.length === 0) {
    return DEFAULT_FALLBACK_STEPS;
  }

  return steps.map((text, index) => ({
    id: String(index + 1),
    text: text.trim(),
  }));
}

/**
 * FogCutterAIService
 *
 * Given a vague task title, returns 3–5 concrete ADHD-friendly micro-steps.
 * Falls back to a sensible default list if AI is unavailable.
 */
const FogCutterAIService = {
  async generateMicroSteps(taskTitle: string): Promise<MicroStep[]> {
    const title = taskTitle.trim();
    if (!title) {
      return DEFAULT_FALLBACK_STEPS;
    }

    const operationContext = createOperationContext({
      feature: 'fog-cutter-ai',
    });

    try {
      const response = await fetchWithPolicy(
        `${config.apiBaseUrl}/api/microsteps`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: title }),
        },
        {
          timeoutMs: config.aiTimeout,
          operationContext,
        },
      );

      if (!response.ok) {
        LoggerService.warn({
          service: 'FogCutterAIService',
          operation: 'generateMicroSteps',
          message: 'FogCutterAI API error, using fallback steps',
        });
        return buildFallbackSteps(title);
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        return buildFallbackSteps(title);
      }

      return parseMicroSteps(payload);
    } catch (err) {
      // Network errors / timeouts / CORS → silent fallback, not a UI crash
      LoggerService.warn({
        service: 'FogCutterAIService',
        operation: 'generateMicroSteps',
        message: 'FogCutterAI unavailable, using fallback steps',
        error: err,
      });
      return buildFallbackSteps(title);
    }
  },

  /** Default steps exposed for testing and offline display */
  defaultSteps: DEFAULT_FALLBACK_STEPS,
};

export default FogCutterAIService;
