# Android Interactive Tutorial Overlay Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current inline tutorial cards with a shared interactive overlay that highlights real UI targets, uses `Tutorial` and `Replay Tutorial` triggers, and stays within Android screen bounds.

**Architecture:** Keep tutorial progression in the existing Zustand store, but move rendering to one shared overlay attached near the app shell. Introduce target registration and measured highlight positioning so tutorial steps can point at real controls across all supported screens. Enforce safe-area-aware placement and viewport clamping in one shared layout layer rather than per-screen logic.

**Tech Stack:** React Native, React Native Web, Zustand, React Navigation, react-native-safe-area-context, Jest, Playwright

---

### Task 1: Extend Tutorial Data Model

**Files:**
- Modify: `src/store/useTutorialStore.ts`
- Test: `__tests__/useTutorialStore.test.ts`

**Step 1: Write failing tests for step metadata**

- Add expectations that a tutorial step can include `targetId` and optional placement metadata.
- Add expectations that dismissing a flow still leaves it replayable.

**Step 2: Run the focused test**

Run: `npm test -- --runInBand __tests__/useTutorialStore.test.ts`

**Step 3: Implement minimal store/type updates**

- Extend `TutorialStep` with target metadata.
- Add any small derived state needed for `Tutorial` vs `Replay Tutorial`.

**Step 4: Re-run the focused test**

Run: `npm test -- --runInBand __tests__/useTutorialStore.test.ts`

**Step 5: Commit**

```bash
git add src/store/useTutorialStore.ts __tests__/useTutorialStore.test.ts
git commit -m "refactor: extend tutorial step metadata"
```

### Task 2: Add Shared Tutorial Target Registration

**Files:**
- Create: `src/components/tutorial/TutorialTarget.tsx`
- Create: `src/components/tutorial/useTutorialTargetRegistry.ts`
- Modify: `src/components/tutorial/index.ts` or existing tutorial exports if present
- Test: `__tests__/TutorialTargetRegistry.test.tsx`

**Step 1: Write failing tests for target registration**

- Verify targets can register/unregister by id.
- Verify the current step can resolve the matching target rect.

**Step 2: Run the focused test**

Run: `npm test -- --runInBand __tests__/TutorialTargetRegistry.test.tsx`

**Step 3: Implement minimal registry**

- Add a shared registry/context or module for target measurement.
- Create a wrapper that exposes a stable tutorial target id.

**Step 4: Re-run the focused test**

Run: `npm test -- --runInBand __tests__/TutorialTargetRegistry.test.tsx`

**Step 5: Commit**

```bash
git add src/components/tutorial/TutorialTarget.tsx src/components/tutorial/useTutorialTargetRegistry.ts __tests__/TutorialTargetRegistry.test.tsx
git commit -m "feat: add tutorial target registry"
```

### Task 3: Replace Inline Card With Shared Overlay Shell

**Files:**
- Modify: `src/components/tutorial/FeatureTutorialOverlay.tsx`
- Modify: `src/components/tutorial/TutorialBubble.tsx`
- Create: `src/components/tutorial/TutorialSpotlightOverlay.tsx`
- Test: `__tests__/FeatureTutorialOverlay.test.tsx`

**Step 1: Write failing overlay rendering tests**

- Verify a full-screen overlay appears when a step is active.
- Verify the card includes an `X` dismiss button.
- Verify `TutorialBubble` explains what and why.

**Step 2: Run the focused test**

Run: `npm test -- --runInBand __tests__/FeatureTutorialOverlay.test.tsx`

**Step 3: Implement minimal overlay shell**

- Convert the tutorial renderer into a true overlay layer.
- Add scrim, highlight box, and bounded explanation card.
- Add the prominent `X` dismiss control.

**Step 4: Re-run the focused test**

Run: `npm test -- --runInBand __tests__/FeatureTutorialOverlay.test.tsx`

**Step 5: Commit**

```bash
git add src/components/tutorial/FeatureTutorialOverlay.tsx src/components/tutorial/TutorialBubble.tsx src/components/tutorial/TutorialSpotlightOverlay.tsx __tests__/FeatureTutorialOverlay.test.tsx
git commit -m "feat: convert tutorials to spotlight overlay"
```

### Task 4: Enforce Android Safe-Area And Bounds Clamping

**Files:**
- Modify: `src/components/tutorial/TutorialSpotlightOverlay.tsx`
- Create: `src/components/tutorial/tutorialLayout.ts`
- Test: `__tests__/tutorialLayout.test.ts`

**Step 1: Write failing layout tests**

- Cover top, bottom, and edge targets.
- Verify the card and highlight are clamped within viewport-safe bounds.

**Step 2: Run the focused test**

Run: `npm test -- --runInBand __tests__/tutorialLayout.test.ts`

**Step 3: Implement placement and clamp helpers**

- Use safe insets and screen dimensions.
- Add `auto` placement fallback and centered fallback when needed.

**Step 4: Re-run the focused test**

Run: `npm test -- --runInBand __tests__/tutorialLayout.test.ts`

**Step 5: Commit**

```bash
git add src/components/tutorial/TutorialSpotlightOverlay.tsx src/components/tutorial/tutorialLayout.ts __tests__/tutorialLayout.test.ts
git commit -m "fix: clamp tutorial overlay within android bounds"
```

### Task 5: Update Tutorial Entry Buttons

**Files:**
- Modify: `src/components/tutorial/FeatureGuideButton.tsx`
- Modify: supported screens that render tutorial triggers:
  - `src/screens/HomeScreen.tsx`
  - `src/screens/TasksScreen.tsx`
  - `src/screens/BrainDumpScreen.tsx`
  - `src/screens/FogCutterScreen.tsx`
  - `src/screens/PomodoroScreen.tsx`
  - `src/screens/AnchorScreen.tsx`
  - `src/screens/CheckInScreen.tsx`
  - `src/screens/InboxScreen.tsx`
  - `src/screens/ChatScreen.tsx`
- Test: `__tests__/LoginScreen.authOptions.test.tsx` only if affected indirectly
- Test: add or update a tutorial trigger test file as needed

**Step 1: Write failing tests for labels**

- Verify the primary button label is `Tutorial`.
- Verify dismissed/completed flows show `Replay Tutorial`.

**Step 2: Run the focused test**

Run: `npm test -- --runInBand __tests__/FeatureGuideButton.test.tsx`

**Step 3: Implement button label/state updates**

- Change primary entry text.
- Add secondary replay behavior after dismissal/completion.

**Step 4: Re-run the focused test**

Run: `npm test -- --runInBand __tests__/FeatureGuideButton.test.tsx`

**Step 5: Commit**

```bash
git add src/components/tutorial/FeatureGuideButton.tsx src/screens/HomeScreen.tsx src/screens/TasksScreen.tsx src/screens/BrainDumpScreen.tsx src/screens/FogCutterScreen.tsx src/screens/PomodoroScreen.tsx src/screens/AnchorScreen.tsx src/screens/CheckInScreen.tsx src/screens/InboxScreen.tsx src/screens/ChatScreen.tsx __tests__/FeatureGuideButton.test.tsx
git commit -m "feat: update tutorial entry and replay controls"
```

### Task 6: Add Tutorial Targets To All Supported Screens

**Files:**
- Modify:
  - `src/screens/HomeScreen.tsx`
  - `src/screens/TasksScreen.tsx`
  - `src/screens/BrainDumpScreen.tsx`
  - `src/screens/FogCutterScreen.tsx`
  - `src/screens/PomodoroScreen.tsx`
  - `src/screens/AnchorScreen.tsx`
  - `src/screens/CheckInScreen.tsx`
  - `src/screens/InboxScreen.tsx`
  - `src/screens/ChatScreen.tsx`
- Modify: `src/store/useTutorialStore.ts`
- Test: screen-specific tests already present under `__tests__/`

**Step 1: Write failing tests for at least one representative screen**

- Example: Brain Dump overlay highlights the input first, then sort action.
- Example: Tasks overlay highlights add-task input and filter controls.

**Step 2: Run the representative focused tests**

Run: `npm test -- --runInBand __tests__/BrainDumpScreen.test.tsx __tests__/TasksScreen.test.tsx`

**Step 3: Implement target wrappers and step metadata**

- Wrap teachable controls in `TutorialTarget`.
- Attach target ids to every step across all flows.

**Step 4: Re-run the representative focused tests**

Run: `npm test -- --runInBand __tests__/BrainDumpScreen.test.tsx __tests__/TasksScreen.test.tsx`

**Step 5: Commit**

```bash
git add src/screens/HomeScreen.tsx src/screens/TasksScreen.tsx src/screens/BrainDumpScreen.tsx src/screens/FogCutterScreen.tsx src/screens/PomodoroScreen.tsx src/screens/AnchorScreen.tsx src/screens/CheckInScreen.tsx src/screens/InboxScreen.tsx src/screens/ChatScreen.tsx src/store/useTutorialStore.ts __tests__/BrainDumpScreen.test.tsx __tests__/TasksScreen.test.tsx
git commit -m "feat: attach spotlight targets to tutorial flows"
```

### Task 7: Keep Bubble And Tutorial Interaction Safe

**Files:**
- Modify: bubble visibility logic where needed
- Test:
  - `e2e/tutorial-bubble-smoke.spec.ts`
  - `e2e/bubble-features.spec.ts`

**Step 1: Write or update failing browser checks**

- Verify the bubble is hidden while tutorial overlay is active.
- Verify it returns after dismissal.

**Step 2: Run the focused browser test**

Run: `npm run e2e:core`

**Step 3: Implement minimal interaction fixes**

- Adjust bubble suppression conditions if the shared overlay changes visibility timing.

**Step 4: Re-run the focused browser test**

Run: `npm run e2e:core`

**Step 5: Commit**

```bash
git add e2e/tutorial-bubble-smoke.spec.ts e2e/bubble-features.spec.ts
git commit -m "test: verify bubble behavior with tutorial spotlight"
```

### Task 8: Add Android-Sized End-To-End Coverage

**Files:**
- Modify: `e2e/tutorial-bubble-smoke.spec.ts`
- Modify: `e2e/release-hardening/visual.spec.ts` if needed
- Possibly add: `e2e/release-hardening/tutorial-android-bounds.spec.ts`

**Step 1: Write failing viewport assertions**

- Verify overlay card stays within screen bounds on Android-like viewport.
- Verify no part of the dismiss button or text card is clipped.

**Step 2: Run the focused browser test**

Run: `npx playwright test e2e/tutorial-bubble-smoke.spec.ts --project=chromium`

**Step 3: Implement any minimal layout refinements**

- Tighten clamp math or responsive card sizing as needed.

**Step 4: Re-run the focused browser test**

Run: `npx playwright test e2e/tutorial-bubble-smoke.spec.ts --project=chromium`

**Step 5: Commit**

```bash
git add e2e/tutorial-bubble-smoke.spec.ts e2e/release-hardening/tutorial-android-bounds.spec.ts
git commit -m "test: cover android tutorial overlay bounds"
```

### Task 9: Update Documentation

**Files:**
- Modify: `docs/TUTORIAL_GUIDE.md`
- Modify: `docs/TEST_MATRIX.md`

**Step 1: Update docs to match shipped behavior**

- Describe the overlay spotlight model.
- Document `Tutorial`, `Replay Tutorial`, and `X` dismiss.
- Add Android bounds expectations.

**Step 2: Review docs against implementation**

Run: manual review and `git diff -- docs/TUTORIAL_GUIDE.md docs/TEST_MATRIX.md`

**Step 3: Commit**

```bash
git add docs/TUTORIAL_GUIDE.md docs/TEST_MATRIX.md
git commit -m "docs: refresh tutorial overlay guidance"
```

### Task 10: Final Verification And Ship Readiness

**Files:**
- No new source files expected

**Step 1: Run full verification**

Run:

```bash
npm run verify
npm run e2e:smoke
npm run e2e:core
npx playwright test e2e/guest-mode.spec.ts --project=chromium
```

**Step 2: Review worktree**

Run:

```bash
git status --short
```

**Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "chore: finalize android tutorial overlay rollout"
```
