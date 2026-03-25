export type TutorialInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type TutorialRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TutorialCardPlacement = 'auto' | 'top' | 'bottom' | 'center';

type ResolveTutorialCardPositionArgs = {
  targetRect: TutorialRect | null;
  cardSize: { width: number; height: number };
  safeFrame: TutorialRect;
  placement: TutorialCardPlacement;
  gap: number;
};

export const getSafeFrame = ({
  viewportWidth,
  viewportHeight,
  insets,
  margin,
}: {
  viewportWidth: number;
  viewportHeight: number;
  insets: TutorialInsets;
  margin: number;
}): TutorialRect => ({
  x: insets.left + margin,
  y: insets.top + margin,
  width: Math.max(0, viewportWidth - insets.left - insets.right - margin * 2),
  height: Math.max(0, viewportHeight - insets.top - insets.bottom - margin * 2),
});

export const clampRectToFrame = (
  rect: TutorialRect,
  frame: TutorialRect,
): TutorialRect => ({
  x: Math.min(Math.max(rect.x, frame.x), frame.x + frame.width - rect.width),
  y: Math.min(Math.max(rect.y, frame.y), frame.y + frame.height - rect.height),
  width: Math.min(rect.width, frame.width),
  height: Math.min(rect.height, frame.height),
});

export const resolveTutorialCardPosition = ({
  targetRect,
  cardSize,
  safeFrame,
  placement,
  gap,
}: ResolveTutorialCardPositionArgs): {
  x: number;
  y: number;
  placement: Exclude<TutorialCardPlacement, 'auto'>;
} => {
  const centered = {
    x: safeFrame.x + (safeFrame.width - cardSize.width) / 2,
    y: safeFrame.y + (safeFrame.height - cardSize.height) / 2,
    placement: 'center' as const,
  };

  if (!targetRect || placement === 'center') {
    return {
      ...centered,
      x: Math.round(centered.x),
      y: Math.round(centered.y),
    };
  }

  const centeredX = targetRect.x + targetRect.width / 2 - cardSize.width / 2;
  const bottomY = targetRect.y + targetRect.height + gap;
  const topY = targetRect.y - cardSize.height - gap;

  const bottomFits =
    bottomY + cardSize.height <= safeFrame.y + safeFrame.height;
  const topFits = topY >= safeFrame.y;

  let resolvedPlacement: Exclude<TutorialCardPlacement, 'auto'> = 'bottom';
  if (placement === 'top') {
    resolvedPlacement = 'top';
  } else if (placement === 'bottom') {
    resolvedPlacement = 'bottom';
  } else if (bottomFits || !topFits) {
    resolvedPlacement = 'bottom';
  } else {
    resolvedPlacement = 'top';
  }

  const rawY = resolvedPlacement === 'bottom' ? bottomY : topY;
  const clamped = clampRectToFrame(
    {
      x: centeredX,
      y: rawY,
      width: cardSize.width,
      height: cardSize.height,
    },
    safeFrame,
  );

  return {
    x: Math.round(clamped.x),
    y: Math.round(clamped.y),
    placement: resolvedPlacement,
  };
};
