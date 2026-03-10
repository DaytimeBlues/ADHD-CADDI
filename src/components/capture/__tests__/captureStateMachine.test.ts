import {
  getNextStateForBadgeCount,
  getNextStateForCheckIn,
  getRecoveryStateAfterFailure,
} from '../captureStateMachine';

describe('captureStateMachine', () => {
  describe('getNextStateForBadgeCount', () => {
    it('moves from idle to needs-review when badge count becomes positive', () => {
      expect(getNextStateForBadgeCount('idle', 2)).toBe('needs-review');
    });

    it('moves from needs-review to idle when badge count becomes zero', () => {
      expect(getNextStateForBadgeCount('needs-review', 0)).toBe('idle');
    });

    it('leaves unrelated states unchanged', () => {
      expect(getNextStateForBadgeCount('recording', 3)).toBe('recording');
    });
  });

  describe('getNextStateForCheckIn', () => {
    it('moves to needs-checkin when a check-in becomes pending', () => {
      expect(getNextStateForCheckIn('idle', true, 0)).toBe('needs-checkin');
    });

    it('does not interrupt recording or processing when check-in becomes pending', () => {
      expect(getNextStateForCheckIn('recording', true, 0)).toBe('recording');
      expect(getNextStateForCheckIn('processing', true, 0)).toBe('processing');
    });

    it('returns to needs-review when a pending check-in clears and badges remain', () => {
      expect(getNextStateForCheckIn('needs-checkin', false, 2)).toBe(
        'needs-review',
      );
    });

    it('returns to idle when a pending check-in clears and no badges remain', () => {
      expect(getNextStateForCheckIn('needs-checkin', false, 0)).toBe('idle');
    });
  });

  describe('getRecoveryStateAfterFailure', () => {
    it('returns needs-review when failed state has remaining badges', () => {
      expect(getRecoveryStateAfterFailure('failed', 1)).toBe('needs-review');
    });

    it('returns idle when failed state has no remaining badges', () => {
      expect(getRecoveryStateAfterFailure('failed', 0)).toBe('idle');
    });

    it('leaves non-failed states unchanged', () => {
      expect(getRecoveryStateAfterFailure('processing', 3)).toBe('processing');
    });
  });
});
