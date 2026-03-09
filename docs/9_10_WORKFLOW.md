# ADHD-CADDI 9/10 Upgrade Workflow

## Executive Summary

This document provides a step-by-step workflow for upgrading the ADHD-CADDI repository to a 9/10 quality rating. The workflow is designed for execution by an LLM with minimal ambiguity.

**Current State:** 11 hard cap violations (files >450 lines)
**Target State:** 0 hard cap violations, clean architecture, reliable tooling

---

## Phase 0: Establish Guardrails (MUST DO FIRST)

### 0.1 Architecture Rules Document

**File:** `docs/ARCHITECTURE_RULES.md`

Create this file with these rules:

- Soft cap: 350 lines for interactive logic files
- Hard cap: 450 lines for interactive logic files
- Screens should orchestrate hooks/components, not contain heavy domain logic
- Services should own one concern only
- Platform variants should share a common core

### 0.2 File Size Enforcement Script

**File:** `scripts/quality/file-size-check.js`

This script exists. Verify it works:

```bash
node scripts/quality/file-size-check.js --report-top 30
```

### 0.3 npm Scripts

**File:** `package.json`

Verify these scripts exist:

```json
{
  "verify": "npm run lint && npx tsc --noEmit && npm test -- --runInBand && npm run admin:check",
  "quality:report": "node scripts/quality/file-size-check.js --report-top 30"
}
```

### 0.4 Husky Pre-commit Hook

**File:** `.husky/pre-commit`

Should contain:

```bash
#!/bin/sh
npx lint-staged --no-stash
```

### Phase 0 Verification

```bash
npm run quality:report  # Should show current violations
npm run verify          # Should pass (may have warnings)
```

---

## Phase 1: Split Major Components

### 1.1 CaptureDrawer (DONE ✓)

**Before:** 1,306 lines
**After:** 259 lines (shell) + mode components

**Structure created:**

```
src/components/capture/
├── CaptureDrawer.tsx          # 259 lines - shell only
├── config.ts                  # Mode metadata and constants
├── styles.ts                  # Shared styles
├── modes/
│   ├── index.ts              # Exports
│   ├── VoiceCaptureMode.tsx  # Voice recording state machine
│   ├── TextCaptureMode.tsx   # Text input
│   ├── PasteCaptureMode.tsx  # Clipboard paste
│   ├── PhotoCaptureMode.tsx  # Photo capture
│   ├── MeetingCaptureMode.tsx # Meeting notes
│   ├── TaskCaptureMode.tsx   # Direct task creation
│   └── CheckInCaptureMode.tsx # Check-in capture
```

**Key patterns:**

- Each mode is a memoized component with single responsibility
- Shared styles extracted to `styles.ts`
- Configuration extracted to `config.ts`
- Main drawer only handles orchestration and state

### 1.2 CalendarScreen (DONE ✓)

**Before:** 897 lines
**After:** 90 lines (screen) + feature module

**Structure created:**

```
src/screens/calendar/
├── calendarUtils.ts           # Pure date functions
├── calendarStyles.ts          # Styles (418 lines - acceptable for styles)
├── useCalendarMonth.ts        # Month navigation hook
├── useCalendarConnection.ts   # Google connection hook
├── CalendarGrid.tsx           # Day grid component
├── CalendarHeader.tsx         # Month navigation header
├── CalendarRationale.tsx      # Explanation card
└── GoogleCalendarConnection.tsx # Google auth UI
```

**Key patterns:**

- Date math extracted to pure functions in `calendarUtils.ts`
- State split between month navigation and connection status
- UI components are thin and focused

### 1.3 GoogleTasksSyncService (PENDING)

**Current:** 655 lines
**Target:** <350 lines per file

**Proposed structure:**

```
src/services/google-sync/
├── GoogleSyncCoordinator.ts      # Public API facade (keep existing exports)
├── GoogleImportService.ts        # Import from Google Tasks
├── GoogleExportService.ts        # Export to Tasks/Calendar
├── GooglePollingService.ts       # Polling and NetInfo
├── GoogleAuthWrapper.ts          # Auth service wrapper
├── types.ts                      # Shared types
├── constants.ts                  # Already exists
└── storage.ts                    # Already exists
```

**Implementation steps:**

1. Create `GoogleImportService.ts` - Move `syncToBrainDump` logic
2. Create `GoogleExportService.ts` - Move `syncSortedItemsToGoogle` logic
3. Create `GooglePollingService.ts` - Move `startForegroundPolling`, `stopForegroundPolling`
4. Keep `GoogleTasksSyncService.ts` as a facade that delegates to new services
5. Maintain backward compatibility with existing exports

**Key logic to extract:**

- Import workflow (lines 324-493): Task fetching, filtering, storage
- Export workflow (lines 184-318): Item categorization, API calls
- Polling lifecycle (lines 495-612): Intervals, NetInfo, queue processing

### 1.4 OAuthService Unification (PENDING)

**Current:** OAuthService.ts (527 lines) + OAuthService.web.ts (432 lines) = 959 lines
**Target:** Shared core + thin adapters

**Proposed structure:**

```
src/services/oauth/
├── OAuthShared.ts           # PKCE, storage keys, types (~350 lines)
├── OAuthWebAdapter.ts       # Web-specific implementation (~100 lines)
├── OAuthNativeAdapter.ts    # Native-specific implementation (~100 lines)
└── index.ts                 # Platform-selected export
```

**Shared code to extract (from both files):**

- PKCE helpers: `generateCodeVerifier`, `generateCodeChallenge`, `base64URLEncode`
- Storage keys and interfaces
- Auth data types
- State validation logic

**Platform-specific differences:**

- Web: Uses `localStorage`, popup window handling
- Native: Uses `AsyncStorage`, different redirect handling

---

## Phase 2: Screen Refactoring

### 2.1 FogCutterScreen

**Current:** 744 lines
**Target:** <250 lines

**Extract:**

- `useFogCutter.ts` already exists - verify it's not too large
- Create `FogCutterMicroStepList.tsx` for the step list UI
- Create `FogCutterInput.tsx` for the task input section
- Move styles to `FogCutterScreen.styles.ts` (already exists, verify size)

### 2.2 IgniteScreen

**Current:** 605 lines
**Target:** <250 lines

**Extract:**

- `useIgniteTimer.ts` - Timer logic, session management
- `IgniteControls.tsx` - Play/pause/stop buttons
- `IgniteDisplay.tsx` - Timer display component
- Keep only orchestration in screen

### 2.3 CheckInScreen

**Current:** 594 lines
**Target:** <250 lines

**Extract:**

- `useCheckIn.ts` - Mood/energy state, recommendation logic
- `CheckInMoodSelector.tsx` - Mood button grid
- `CheckInEnergySelector.tsx` - Energy button grid
- `CheckInRecommendation.tsx` - Recommendation display

### 2.4 TasksScreen

**Current:** 589 lines
**Target:** <250 lines

**Extract:**

- Task list is already in `TasksScreen.TaskItem.tsx`
- Create `TasksFilterBar.tsx` for filter controls
- Create `TasksEmptyState.tsx` for empty state
- Move any remaining business logic to hooks

### 2.5 BrainDumpScreen

**Current:** 457 lines
**Target:** <250 lines

**Extract:**

- Most components already extracted to `src/components/brain-dump/`
- Verify screen only orchestrates
- May already be close to target after verification

### 2.6 HomeScreen

**Current:** 469 lines
**Target:** <250 lines

**Extract:**

- `HomeScreen.styles.ts` already exists
- Create `HomeGreeting.tsx` for personalized greeting
- Create `HomeQuickActions.tsx` for action buttons
- Create `HomeStats.tsx` for statistics display

---

## Phase 3: Platform & State Boundaries

### 3.1 Lifecycle Ownership Review

**Files to audit:**

- `useGoogleSyncPolling.ts` - Should not duplicate AppLifecycleService
- `useOverlayEvents.ts` - Should use AppLifecycleService
- `BiometricService.ts` - Verify lifecycle handling
- `DriftService.ts` - Verify lifecycle handling
- `AppLifecycleService.ts` - Should be single source of truth

**Rule:** App-wide background/foreground concerns belong in AppLifecycleService

### 3.2 Storage Access Patterns

**Current issue:** Storage keys scattered across features

**Create feature-level gateways:**

```
src/services/storage/
├── StorageService.ts           # Existing low-level service
├── BrainDumpStorage.ts         # Brain dump operations
├── SyncStateStorage.ts         # Google sync state
├── SettingsStorage.ts          # App settings
└── BackupStorage.ts            # Backup operations
```

### 3.3 Env/Secret Handling

**Verify:**

- `src/config/runtimeConfig.ts` is the only place reading env vars
- No direct `process.env` access in feature code
- Documentation clearly marks which vars are public vs server-only

---

## Phase 4: CI/CD Deduplication

### 4.1 Create Reusable Workflows

**Directory:** `.github/workflows/`

**Create:**

```yaml
# .github/workflows/setup-node.yml
name: Setup Node
on:
  workflow_call:
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
```

```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates
on:
  workflow_call:
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test -- --runInBand
```

### 4.2 Update Existing Workflows

**Files:** `ci.yml`, `pages.yml`, `android.yml`

**Replace duplicated steps with:**

```yaml
jobs:
  quality:
    uses: ./.github/workflows/quality-gates.yml
```

---

## Phase 5: Documentation

### 5.1 Update ARCHITECTURE_RULES.md

Add sections:

- Platform split guide: `.web.ts` vs `.native.ts` vs shared
- Integration guide: Google sync, OAuth, backup
- Testing requirements for new seams

### 5.2 Create CONTRIBUTING.md

Include:

- Branch workflow
- Local verification steps
- Commit hook expectations
- What to do when hooks fail

---

## Execution Checklist for LLM

### Before Starting Each Phase

- [ ] Run `npm run quality:report` to establish baseline
- [ ] Run `npm run verify` to ensure starting from green state
- [ ] Read target files completely before modifying

### During Each Refactor

- [ ] Preserve all existing exports (backward compatibility)
- [ ] Move pure logic first, then UI components
- [ ] Keep imports stable when possible
- [ ] Add tests for new seams
- [ ] Run `npx tsc --noEmit` after each file change
- [ ] Run `npm run lint` after each file change

### After Each Phase

- [ ] Run `npm run verify` - must pass
- [ ] Run `npm run quality:report` - verify violations reduced
- [ ] Test affected user flows manually
- [ ] Commit changes before moving to next phase

### Forbidden Actions

- NEVER use `--no-verify` to bypass hooks
- NEVER suppress TypeScript errors with `@ts-ignore`
- NEVER delete tests to make build pass
- NEVER combine multiple major refactors in one commit
- NEVER change public API and implementation in same commit

---

## Current Violations Summary (As of Last Check)

```
HARD CAP VIOLATIONS (11 files):
   744 lines: screens/FogCutterScreen.tsx
   655 lines: services/GoogleTasksSyncService.ts
   605 lines: screens/IgniteScreen.tsx
   594 lines: screens/CheckInScreen.tsx
   589 lines: screens/TasksScreen.tsx
   527 lines: services/OAuthService.ts
   483 lines: components/capture/CaptureBubble.tsx
   472 lines: screens/CBTGuideScreen.tsx
   469 lines: screens/HomeScreen.tsx
   459 lines: theme/cosmicTokens.ts (static data - acceptable)
   457 lines: screens/BrainDumpScreen.tsx
```

**Priority order:**

1. GoogleTasksSyncService.ts (architectural hotspot)
2. OAuthService.ts + OAuthService.web.ts (duplication)
3. FogCutterScreen.tsx (largest screen)
4. IgniteScreen.tsx, CheckInScreen.tsx, TasksScreen.tsx (medium screens)
5. HomeScreen.tsx, BrainDumpScreen.tsx (smaller screens)
6. CBTGuideScreen.tsx, CaptureBubble.tsx (lower priority)

---

## Testing Strategy

### Unit Tests for New Seams

Each extracted service/hook should have:

- Pure function tests (input/output verification)
- Error handling tests
- Mock external dependencies

### Integration Tests

After each major refactor:

- Run existing Playwright smoke tests
- Verify no regressions in user flows

### Test Commands

```bash
npm test -- --testPathPattern="calendar"  # Test calendar module
npm run e2e:smoke                          # Smoke tests
npm run verify                             # Full verification
```

---

## Success Criteria for 9/10

- [ ] No files over 450 lines (except static data/style files)
- [ ] No duplicated service implementations
- [ ] `npm run verify` passes cleanly
- [ ] Husky hooks work on Windows without `--no-verify`
- [ ] CI workflows use reusable components
- [ ] All new seams have unit tests
- [ ] Documentation reflects actual architecture

---

## Emergency Procedures

### If Build Breaks

1. STOP all further edits
2. Run `git status` to see what changed
3. Run `git diff` to identify breaking changes
4. Revert to last known good state: `git checkout -- <files>`
5. Fix issues before proceeding

### If TypeScript Errors Cascade

1. Check for circular imports
2. Verify all new files are included in tsconfig
3. Check that type exports are explicit
4. Run `npx tsc --noEmit --traceResolution` to debug

### If Tests Fail

1. Identify if failure is pre-existing or caused by changes
2. For pre-existing: document and move on
3. For new failures: fix before committing

---

## Questions for Human Review

If you encounter any of these, ask for clarification:

- Ambiguous requirements in original code
- Unclear business logic intent
- Security-sensitive code sections
- Performance-critical paths

---

## Document History

- Created: After Phase 0 and Phase 1.1, 1.2 completion
- Status: Ready for Phase 1.3, 1.4, and Phase 2 execution
