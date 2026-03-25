import {
  clampRectToFrame,
  getSafeFrame,
  resolveTutorialCardPosition,
} from '../src/components/tutorial/tutorialLayout';

describe('tutorialLayout', () => {
  it('builds a safe frame inside the viewport insets', () => {
    expect(
      getSafeFrame({
        viewportWidth: 360,
        viewportHeight: 800,
        insets: { top: 24, right: 0, bottom: 32, left: 0 },
        margin: 16,
      }),
    ).toEqual({
      x: 16,
      y: 40,
      width: 328,
      height: 712,
    });
  });

  it('clamps an edge target rectangle fully into the safe frame', () => {
    expect(
      clampRectToFrame(
        { x: -12, y: 760, width: 140, height: 80 },
        { x: 16, y: 40, width: 328, height: 712 },
      ),
    ).toEqual({
      x: 16,
      y: 672,
      width: 140,
      height: 80,
    });
  });

  it('places the card below the target when there is room', () => {
    expect(
      resolveTutorialCardPosition({
        targetRect: { x: 32, y: 120, width: 160, height: 48 },
        cardSize: { width: 280, height: 220 },
        safeFrame: { x: 16, y: 40, width: 328, height: 712 },
        placement: 'bottom',
        gap: 12,
      }),
    ).toEqual({
      x: 16,
      y: 180,
      placement: 'bottom',
    });
  });

  it('falls back above the target when bottom placement would overflow', () => {
    expect(
      resolveTutorialCardPosition({
        targetRect: { x: 120, y: 620, width: 120, height: 48 },
        cardSize: { width: 280, height: 220 },
        safeFrame: { x: 16, y: 40, width: 328, height: 712 },
        placement: 'auto',
        gap: 12,
      }),
    ).toEqual({
      x: 40,
      y: 388,
      placement: 'top',
    });
  });
});
