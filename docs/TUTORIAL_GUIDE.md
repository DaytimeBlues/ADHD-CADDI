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
- Guides can be replayed at any time with the `Replay Guide` action on a
  supported screen or from the Home replay-guide chooser.
- `Next` advances through the steps.
- `Previous` moves back one step.
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
2. Confirm the tutorial overlay appears automatically when guided tutorials are
   enabled.
3. Click `Next` and verify the step title changes.
4. Click `Previous` and verify the earlier step returns.
5. Click `Skip Tutorial` and confirm the overlay closes.
6. Click `Replay Guide` and confirm the guide reopens.
7. Finish the tutorial and reload the page.
8. Confirm the guide does not auto-open after completion.
9. Open Diagnostics and disable `Show guided tutorials`.
10. Revisit a supported screen and confirm the guide does not auto-open, while
    manual replay still works.

## E2E Coverage

The Playwright smoke coverage for this feature should validate:

- first-run tutorial visibility,
- replay via `Replay Guide`,
- step navigation,
- bubble suppression while a guide overlay is visible,
- and a successful capture bubble save flow into Inbox.
