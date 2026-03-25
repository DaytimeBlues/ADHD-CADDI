# Android Interactive Tutorial Overlay Design

**Date:** 2026-03-25

## Goal

Replace the current screen-local tutorial card pattern with a shared interactive overlay for Android that sits on top of the active screen, highlights the relevant control for each step, explains what it does and why it matters, and stays fully inside visible device bounds.

## Current State

- Tutorials are driven by `useTutorialStore` and `useFeatureTutorial`.
- Each screen renders `FeatureTutorialOverlay` inline in its own layout.
- `TutorialBubble` shows generic step content and navigation controls.
- Supported screens already expose per-screen tutorial flows, but steps do not reference specific UI targets.
- Replay controls currently use `Replay Guide` as the primary label.

## Problems To Solve

1. The current tutorial appears as a separate text card rather than an interactive layer on top of the active UI.
2. Steps do not isolate or spotlight the feature being explained.
3. The overlay layout is not centralized, so Android-safe clamping and safe-area behavior are hard to enforce consistently.
4. The button language does not match the requested `Tutorial` and `Replay Tutorial` entry points.

## Recommended Architecture

Use a shared target-registry overlay architecture.

### Core Model

- Keep tutorial progression in the shared tutorial store.
- Extend each `TutorialStep` with:
  - `targetId`
  - optional `placement` hint such as `auto`, `top`, `bottom`, `center`
  - optional fallback behavior if the target cannot be measured
- Add a shared tutorial target registration layer so screens can mark specific controls as tutorial anchors.

### Overlay Placement

- Render one shared tutorial overlay near the app shell instead of inline per screen.
- The overlay measures the active target and draws:
  - a dimmed full-screen scrim
  - a bounded highlight box around the target
  - an explanation card positioned near the target
- Clamp both the highlight rectangle and the explanation card to safe area insets and viewport bounds.

### Android Boundaries

- Use `useSafeAreaInsets()` and current window dimensions to derive a safe content frame.
- Keep the tutorial card inside that frame with max width and max height constraints.
- Prevent overlap with status bars, navigation bars, and gesture areas.
- If the target is too close to an edge, auto-switch card placement or fall back to a centered card while keeping the target highlight visible.

## UI Specification

### Entry Buttons

- Primary entry control label: `Tutorial`
- Secondary replay control label after completion or dismissal: `Replay Tutorial`
- Do not use standalone `Replay`

### Overlay Content

- A prominent `X` dismiss control in the tutorial card header
- Step title
- Explanation text that covers:
  - what the highlighted feature does
  - why the user would use it
- Step progress indicator
- Previous and Next/Finish controls

### Highlight Behavior

- The active target is visually isolated with a focus ring or box.
- The rest of the UI is dimmed, but the underlying active screen remains visible.
- The flow should feel like the user is being guided through the real interface, not sent to a separate instructions page.

## Screen Coverage

Apply the new system to all currently tutorial-supported flows:

- Home replay guide chooser
- Tasks
- Brain Dump
- Fog Cutter
- Pomodoro
- Anchor
- Check In
- Inbox
- Chat

Each flow must define meaningful targets for every step or provide an explicit centered fallback step when a specific target does not make sense.

## State And Behavior Rules

- Auto-start behavior remains controlled by the existing tutorial settings.
- Dismiss via `X` should count the same as dismiss/skip for replay availability.
- After a tutorial is dismissed or completed, the screen should show `Replay Tutorial`.
- The overlay should suppress conflicting UI such as the capture bubble while active.

## Testing Strategy

### Unit/Component

- Tutorial store behavior for complete, dismiss, replay visibility
- Overlay clamping logic
- Target registration and measurement fallback behavior
- Button label updates from `Replay Guide` to `Tutorial` / `Replay Tutorial`

### Browser/E2E

- Tutorial opens from `Tutorial`
- `X` dismiss works on the overlay
- `Replay Tutorial` appears after dismissal/completion
- Tutorial overlay stays within viewport on Android-like dimensions
- Bubble remains hidden while tutorial is active
- Existing guided flows still progress correctly on the real screen

## Risks

- Measuring target elements consistently across React Native Web and Android layout primitives
- Preventing highlight/card overflow on smaller Android devices
- Updating every supported screen without missing stale selectors or duplicate target ids

## Out Of Scope

- Redesigning tutorial copy beyond minor wording needed for the new overlay
- Creating new tutorial-supported screens beyond the current set
- Reworking the Android persistent overlay service itself
