# ADHD-CADDI 9/10 Upgrade Workflow

## Executive Summary

This workflow reflects the **current repository state** after the latest code-health refactor pass.

**Current State:** 4 hard cap violations remain
**Target State:** 0 hard cap violations, stable public APIs, and repeatable local verification

Latest verified hard-cap offenders from `npm run quality:report`:

- `src/components/capture/CaptureBubble.tsx` (483)
- `src/screens/HomeScreen.tsx` (469)
- `src/theme/cosmicTokens.ts` (459)
- `src/screens/BrainDumpScreen.tsx` (457)

## Completed Work

### Guardrails (done)

- `docs/ARCHITECTURE_RULES.md` defines file-size and architecture limits
- `scripts/quality/file-size-check.js` reports soft and hard cap violations
- `.husky/pre-commit` uses Windows-safe `lint-staged --no-stash`
- `package.json` includes `npm run verify` and `npm run quality:report`

### Services (done)

Google sync is now split into focused modules while keeping the public import stable:

```text
src/services/google-sync/
|- GoogleSyncCoordinator.ts
|- GoogleImportService.ts
|- GoogleExportService.ts
|- GooglePollingService.ts
|- GoogleSyncSupport.ts
|- constants.ts
|- storage.ts
`- types.ts
```

OAuth is now shared through a common core with thin platform adapters:

```text
src/services/oauth/
|- OAuthShared.ts
|- OAuthBase.ts
|- OAuthWebAdapter.ts
|- OAuthNativeAdapter.ts
`- index.ts
```

Stable public entrypoints retained:

- `src/services/GoogleTasksSyncService.ts`
- `src/services/OAuthService.ts`
- `src/services/OAuthService.web.ts`

### Screens (done)

The following screens were reduced to orchestration shells:

- `src/screens/FogCutterScreen.tsx`
- `src/screens/IgniteScreen.tsx`
- `src/screens/CheckInScreen.tsx`
- `src/screens/TasksScreen.tsx`
- `src/screens/CBTGuideScreen.tsx`

Supporting feature modules added:

- `src/screens/fog-cutter/FogCutterTaskComposer.tsx`
- `src/screens/fog-cutter/FogCutterTaskList.tsx`
- `src/screens/ignite/useIgniteController.ts`
- `src/screens/ignite/IgniteTimerDisplay.tsx`
- `src/screens/check-in/checkInData.ts`
- `src/screens/check-in/CheckInOptionGroup.tsx`
- `src/screens/cbt-guide/cbtGuideData.ts`
- `src/screens/cbt-guide/cbtGuideStyles.ts`
- `src/screens/cbt-guide/CbtGuideOverviewCard.tsx`
- `src/screens/cbt-guide/CbtGuideCategoryCard.tsx`

## Verified State

Focused test coverage added for the new seams:

- `__tests__/OAuthShared.test.ts`
- `__tests__/cbtGuideData.test.ts`

Focused regression tests currently passing:

```bash
npm test -- --runInBand __tests__/FogCutterScreen.test.tsx __tests__/GoogleTasksSyncService.test.ts __tests__/OAuthShared.test.ts __tests__/cbtGuideData.test.ts __tests__/CheckInScreen.test.tsx __tests__/IgniteScreen.test.tsx __tests__/CBTGuideScreen.test.tsx
```

TypeScript was also run during this pass:

```bash
npx tsc --noEmit
```

## Remaining Work

### 1. Remove the final hard-cap violations

Priority order:

1. `src/components/capture/CaptureBubble.tsx`
2. `src/screens/HomeScreen.tsx`
3. `src/screens/BrainDumpScreen.tsx`
4. `src/theme/cosmicTokens.ts`

Notes:

- `cosmicTokens.ts` should only remain over the hard cap if you document it as an explicit exception and update the checker policy accordingly.
- `CaptureBubble.tsx` is now the largest remaining interactive file and is the best next target.

### 2. Re-run full project verification

After the remaining hard-cap files are addressed, run:

```bash
npm run quality:report
npm run verify
```

### 3. Optional follow-up architecture cleanup

These are no longer the main blockers for the hard-cap target:

- CI/CD workflow deduplication
- lifecycle ownership normalization
- storage gateway normalization

Do them only after the final four hard-cap files are cleared, unless one of them blocks verification.
