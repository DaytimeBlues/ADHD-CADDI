# Test Matrix - ADHD-CADDI Android Emulator

## Phase 1: Orientation

| Item            | Value                                   |
| --------------- | --------------------------------------- |
| Repo Root       | C:\dev\ADHD-CADDI-V1                    |
| Branch          | main                                    |
| Worktree        | main (dirty - 14 modified files)        |
| Emulator        | emulator-5554 (Medium_Phone_API_36.1)   |
| Test Frameworks | Jest, Playwright (web), Detox (Android) |
| Build Command   | `npm run build:android`                 |

## Phase 2: Test Surface Mapping

### Screens (13 total)

| Screen               | Navigation Type | Test Status                       |
| -------------------- | --------------- | --------------------------------- |
| HomeScreen           | Tab (Home)      | Covered by web E2E                |
| IgniteScreen (Focus) | Tab (Focus)     | Covered by web E2E                |
| TasksScreen          | Tab (Tasks)     | Covered by web E2E                |
| CalendarScreen       | Tab (Calendar)  | Covered by web E2E                |
| ChatScreen           | Tab (Chat)      | Covered by web E2E                |
| BrainDumpScreen      | Stack (Modal)   | Covered by braindump-flow.spec.ts |
| FogCutterScreen      | Stack (Modal)   | Not covered                       |
| PomodoroScreen       | Stack (Modal)   | Covered by smoke-basic.spec.ts    |
| AnchorScreen         | Stack (Modal)   | Not covered                       |
| InboxScreen          | Stack (Modal)   | Not covered                       |
| CheckInScreen        | Stack (Modal)   | Covered by checkin-flow.spec.ts   |
| CBTGuideScreen       | Stack (Modal)   | Not covered                       |
| DiagnosticsScreen    | Stack (Modal)   | Not covered                       |

### Key User Flows

| Flow                        | Test Status | Notes                            |
| --------------------------- | ----------- | -------------------------------- |
| Tab navigation (all 5 tabs) | Covered     | smoke-basic.spec.ts              |
| Timer start/pause/reset     | Covered     | smoke-basic.spec.ts              |
| Task creation               | Covered     | smoke-basic.spec.ts              |
| Brain dump flow             | Covered     | braindump-flow.spec.ts           |
| Chat interaction            | Covered     | chat-flow.spec.ts                |
| Check-in flow               | Covered     | checkin-flow.spec.ts             |
| Bubble features             | Covered     | bubble-features.spec.ts          |
| Disconnected behavior       | Covered     | disconnected-degradation.spec.ts |
| Edge cases                  | Covered     | edge-cases.spec.ts               |
| Stability suite             | Covered     | stability-suite.spec.ts          |

### Critical Gaps (Android-specific)

| Flow                    | Status                   | Notes                   |
| ----------------------- | ------------------------ | ----------------------- |
| Overlay permission      | NOT TESTABLE ON EMULATOR | Requires real device    |
| Notification permission | NOT TESTABLE ON EMULATOR | Requires real device    |
| Foreground service      | NOT TESTABLE ON EMULATOR | Requires real device    |
| Biometric hardware      | NOT TESTABLE ON EMULATOR | Emulator lacks hardware |
| Hardware back button    | MANUAL ONLY              | Android back gesture    |
| Multi-window mode       | MANUAL ONLY              | Android feature         |

## Phase 3: Runtime Truth

### Startup Logcat Analysis

- **Build**: ✅ SUCCESS (10s)
- **Install**: ✅ SUCCESS
- **Launch**: ✅ SUCCESS (PID 7552)
- **Displayed**: +2.68s
- **Errors**: None
- **Warnings**: 1 (cosmetic - "File error accessing recents directory")
- **Native libs loaded**: libhermes.so, libfbjni.so, libreactnativejni.so

### Test Status Summary

| Check         | Result                   |
| ------------- | ------------------------ |
| Build         | ✅ PASS                  |
| Install       | ✅ PASS                  |
| Launch        | ✅ PASS                  |
| Logcat        | ✅ CLEAN (no crashes)    |
| Cold restart  | ✅ TESTED (previous run) |
| Fresh install | ✅ TESTED (previous run) |

## Test Execution Log
