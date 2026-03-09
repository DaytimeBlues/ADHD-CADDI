# Android APK Release Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Android `APK-ready` status explicit and trustworthy through CI contract hardening, explicit signing boundaries, and aligned documentation.

**Architecture:** Strengthen the existing Android workflow, verifier, app bootstrap marker, and release docs instead of replacing the pipeline.

**Tech Stack:** GitHub Actions, Bash, React Native, Android Gradle, Jest, Markdown docs

---

## Status Update

Completed:

- Task 1: formalized the release smoke contract in tests, workflow naming, and verifier checks
- Task 2: added the in-app `APP_READY` marker from `App.tsx`
- Task 3: added signed sideload helper and signing-boundary tests
- Task 4: aligned release docs, tech spec, audit, and test matrix
- Task 5: merged the feature branch to `main` as `a67ef8a`
- Task 6: pushed the follow-up documentation update on `main` as `88580a7`

Verification completed:

- focused Android contract tests pass
- TypeScript `npx tsc --noEmit` passes
- `npm run admin:android-health` passes
- merged `main` worktree re-verifies with the same results
- `npm run lint` still reports the same pre-existing 20 warnings and 0 errors
- post-push workflow state for `a67ef8a`:
  - `CI`: success
  - `CodeQL Security Analysis`: success
  - `Secret Scanning (Gitleaks)`: success
  - `Deploy to GitHub Pages`: success
  - `Android CI`: still running during this update, specifically the `Android Release Build Check` job

Open follow-up:

- monitor the `Android CI` run for `a67ef8a` until the `Android Release Build Check` job completes
- decide separately whether to clean up the pre-existing repo-wide lint warnings outside this batch

## Next Session Checklist

1. Review the latest `Android CI` run for commit `a67ef8a`
2. Confirm the `Android Release Build Check` job finishes green
3. If it fails, inspect the workflow logs before making further Android release claims
4. Separately triage the repo-wide lint warnings if they become a priority
