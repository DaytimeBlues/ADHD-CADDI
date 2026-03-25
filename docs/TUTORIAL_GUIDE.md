# Guided Tutorial Guide

This guide explains how the shared guided tutorial system works in the app and
how to verify it during development.

## What The Tutorial System Does

Each guided flow is a short step-by-step overlay for a supported screen. It
explains:

- why the screen exists,
- what the most important controls do,
- how to use the screen effectively,
- and how to replay the guide later.

## User Behavior

- Guided tutorials open automatically the first time a user visits a supported
  screen, as long as `Show guided tutorials` is enabled in Diagnostics.
- Each tutorial now appears as a spotlight overlay on top of the live screen,
  rather than as a separate instructional card inside the page layout.
- The overlay dims the rest of the UI, highlights the current target control,
  and shows a bounded explanation card with what the control does and why it is
  useful.
- Guides can be launched with the `Tutorial` action on a supported screen or
  from the Home tutorial chooser.
- After a guide is completed or dismissed, the screen-level action changes to
  `Replay Tutorial`.
- `Next` advances through the steps.
- `Previous` moves back one step.
- The `X` button dismisses the flow immediately.
- `Skip Tutorial` dismisses the flow and marks onboarding as complete.
- Finishing the last step also marks onboarding as complete.

## Storage

- Tutorial progress is persisted in the Zustand store key
  `spark-tutorial-storage`.
- The global tutorial setting is stored alongside flow completion state.
- Current supported flows include:
  - `brain-dump-onboarding`
  - `anchor-onboarding`
  - `pomodoro-onboarding`
  - `fog-cutter-onboarding`
  - `check-in-onboarding`
  - `inbox-onboarding`
  - `chat-onboarding`
  - `tasks-onboarding`

## QA Checklist

1. Launch the app and open a supported screen such as Brain Dump, Tasks, or
   Chat.
2. Confirm the spotlight tutorial overlay appears automatically when guided
   tutorials are enabled.
3. Confirm the current target control is highlighted and the rest of the screen
   is dimmed.
4. Confirm the explanation card stays within visible screen bounds on an
   Android-sized viewport.
5. Click `Next` and verify the step title and target highlight change.
6. Click `Previous` and verify the earlier step returns.
7. Click the `X` dismiss control and confirm the overlay closes.
8. Confirm the screen now shows `Replay Tutorial`.
9. Reopen the guide and finish the tutorial.
10. Reload the page and confirm the guide does not auto-open after completion.
11. Open Diagnostics and disable `Show guided tutorials`.
12. Revisit a supported screen and confirm the guide does not auto-open, while
    manual replay still works.

## E2E Coverage

The Playwright smoke coverage for this feature should validate:

- first-run tutorial visibility,
- replay via `Tutorial` and `Replay Tutorial`,
- step navigation,
- dismiss via `X`,
- bounded overlay layout on Android-sized viewports,
- bubble suppression while a guide overlay is visible,
- and a successful capture bubble save flow into Inbox.
