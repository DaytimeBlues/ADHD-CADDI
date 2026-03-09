/**
 * CaptureBubble
 *
 * Persistent Floating Action Button (FAB+) for the Capture feature.
 * Rendered above all tab screens. Manages bubble state reactively
 * via CaptureService subscription.
 *
 * States: idle | recording | processing | needs-review | failed | offline
 */

import React, { memo } from 'react';
import { CaptureDrawer } from './CaptureDrawer';
import { CaptureBubbleFab } from './CaptureBubbleFab';
import { useCaptureBubbleState } from './useCaptureBubbleState';

export const CaptureBubble = memo(function CaptureBubble() {
  const {
    drawerOpen,
    bubbleState,
    badgeCount,
    totalBadgeCount,
    pulseAnim,
    spinAnim,
    shakeAnim,
    setDrawerOpen,
    handleDrawerClose,
    handleStateChange,
  } = useCaptureBubbleState();

  return (
    <>
      <CaptureBubbleFab
        bubbleState={bubbleState}
        badgeCount={badgeCount}
        totalBadgeCount={totalBadgeCount}
        pulseAnim={pulseAnim}
        spinAnim={spinAnim}
        shakeAnim={shakeAnim}
        drawerOpen={drawerOpen}
        onDrawerOpen={() => setDrawerOpen(true)}
      />

      <CaptureDrawer
        visible={drawerOpen}
        onClose={handleDrawerClose}
        onStateChange={handleStateChange}
        currentBubbleState={bubbleState}
      />
    </>
  );
});

export default CaptureBubble;
