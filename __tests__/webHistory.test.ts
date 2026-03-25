import { getHistoryUpdateMode } from '../src/navigation/webHistory';

describe('getHistoryUpdateMode', () => {
  it('replaces the initial browser url sync on navigation ready', () => {
    expect(getHistoryUpdateMode('/', '/focus', 'ready')).toBe('replace');
  });

  it('does not auto-push history entries for state changes', () => {
    expect(getHistoryUpdateMode('/', '/focus', 'state-change')).toBeNull();
  });

  it('does nothing when the target path already matches the current path', () => {
    expect(getHistoryUpdateMode('/focus', '/focus', 'state-change')).toBeNull();
  });

  it('treats trailing-slash variants as the same path', () => {
    expect(
      getHistoryUpdateMode('/focus', '/focus/', 'state-change'),
    ).toBeNull();
  });
});
