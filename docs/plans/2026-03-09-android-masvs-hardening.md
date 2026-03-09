# Android MASVS Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce the highest-value Android MASVS findings by disabling unrestricted backups and moving cleartext localhost exceptions out of the main release config.

**Architecture:** Add a small file-based regression test that inspects the Android manifests and network security configs directly, then make the minimal Android resource and manifest changes needed to satisfy those expectations. Keep overlay behavior unchanged.

**Tech Stack:** Jest, Node `fs`, Android manifest/resource overlays, Gradle Android variants

---

### Task 1: Add Android config regression tests

**Files:**
- Create: `__tests__/androidConfig.security.test.ts`

**Step 1: Write the failing test**

Add tests that assert:
- `android/app/src/main/AndroidManifest.xml` contains `android:allowBackup="false"`
- `android/app/src/main/AndroidManifest.xml` does not reference `@xml/network_security_config`
- `android/app/src/debug/AndroidManifest.xml` references `@xml/network_security_config`
- `android/app/src/debug/res/xml/network_security_config.xml` allows cleartext only for `10.0.2.2` and `localhost`

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/androidConfig.security.test.ts --runInBand`

Expected:
- fail because main manifest still allows backup and still references the shared network security config

**Step 3: Commit**

```bash
git add __tests__/androidConfig.security.test.ts
git commit -m "test: cover android manifest security config"
```

### Task 2: Harden Android main manifest

**Files:**
- Modify: `android/app/src/main/AndroidManifest.xml`

**Step 1: Write minimal implementation**

Change the main application tag to:
- set `android:allowBackup="false"`
- remove `android:networkSecurityConfig` from the main manifest

**Step 2: Run focused test**

Run: `npx jest __tests__/androidConfig.security.test.ts --runInBand`

Expected:
- still fail because the debug manifest/resources do not exist yet

**Step 3: Commit**

```bash
git add android/app/src/main/AndroidManifest.xml
git commit -m "fix: harden android release manifest defaults"
```

### Task 3: Move cleartext exceptions to debug-only Android resources

**Files:**
- Create: `android/app/src/debug/AndroidManifest.xml`
- Create: `android/app/src/debug/res/xml/network_security_config.xml`

**Step 1: Write minimal implementation**

Add a debug manifest overlay that references `@xml/network_security_config`.

Add a debug-only network security config that allows cleartext only for:
- `10.0.2.2`
- `localhost`

**Step 2: Run focused test**

Run: `npx jest __tests__/androidConfig.security.test.ts --runInBand`

Expected:
- pass

**Step 3: Run type and lint safety checks**

Run:
- `npx tsc --noEmit`

Expected:
- pass

**Step 4: Commit**

```bash
git add android/app/src/debug/AndroidManifest.xml android/app/src/debug/res/xml/network_security_config.xml __tests__/androidConfig.security.test.ts
git commit -m "fix: scope android cleartext config to debug only"
```

### Task 4: Update Android MASVS report

**Files:**
- Modify: `docs/reviews/2026-03-09-masvs-audit.md`

**Step 1: Update findings**

Revise:
- backup finding status after the manifest change
- cleartext finding status after the debug-only move
- Android posture score if appropriate

**Step 2: Verify diff is truthful**

Run:
- `git diff -- docs/reviews/2026-03-09-masvs-audit.md`

Expected:
- report matches current repository state

**Step 3: Commit**

```bash
git add docs/reviews/2026-03-09-masvs-audit.md
git commit -m "docs: refresh masvs audit after android hardening"
```

### Task 5: Final verification and push

**Files:**
- Modify: none

**Step 1: Run final verification**

Run:
- `npx jest __tests__/androidConfig.security.test.ts --runInBand`
- `npx tsc --noEmit`
- `git status --short`

Expected:
- tests pass
- typecheck passes
- worktree is clean except intended changes

**Step 2: Push**

```bash
git push origin main
```
