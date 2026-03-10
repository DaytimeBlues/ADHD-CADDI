import type { BubbleState } from './captureTypes';

export const getNextStateForBadgeCount = (
  currentState: BubbleState,
  badgeCount: number,
): BubbleState => {
  if (badgeCount > 0 && currentState === 'idle') {
    return 'needs-review';
  }

  if (badgeCount === 0 && currentState === 'needs-review') {
    return 'idle';
  }

  return currentState;
};

export const getNextStateForCheckIn = (
  currentState: BubbleState,
  isPending: boolean,
  badgeCount: number,
): BubbleState => {
  if (
    isPending &&
    currentState !== 'recording' &&
    currentState !== 'processing'
  ) {
    return 'needs-checkin';
  }

  if (!isPending && currentState === 'needs-checkin') {
    return badgeCount > 0 ? 'needs-review' : 'idle';
  }

  return currentState;
};

export const getRecoveryStateAfterFailure = (
  currentState: BubbleState,
  badgeCount: number,
): BubbleState => {
  if (currentState !== 'failed') {
    return currentState;
  }

  return badgeCount > 0 ? 'needs-review' : 'idle';
};
