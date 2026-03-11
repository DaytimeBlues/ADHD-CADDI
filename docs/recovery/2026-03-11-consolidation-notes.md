# 2026-03-11 Recovery Consolidation Notes

Canonical repo: `C:\dev\ADHD-CADDI-V1`

This recovery consolidated valid ADHD-CADDI history and preserved remaining
snapshot-only diffs without overwriting newer canonical code.

Applied directly into Git history on branch
`codex/recovery-consolidation-20260311`:

- `547b1f6` `W8: Replace silent catches with structured LoggerService logging`
- `9a04158` `refactor: extract screen style helpers`
  - Kept newer canonical implementations for overlapping extracted screen files
  - Preserved the missing `__tests__/CheckInScreen.utils.test.tsx`
- `121e9d9` `Block Pages deployment on e2e:core browser regression tests`
- `2fdd4c2` `android preview proof and repo updates`
- `e351a0a` `capture remaining android proof edits`

Not replayed as raw commits:

- `origin/codex/road-to-90-integration`
- `5a63e55` from `origin/codex/w7-a11y-calendar`
- `cee64a7` from `origin/codex/w7-a11y-calendar`

Reason:

- Those older stacked commits conflicted broadly with the current canonical
  `main` branch in CI workflows, navigation, capture, calendar, and multiple
  screen files.
- Current canonical code already contains newer versions of most W7
  accessibility patterns and later Android/release work.

Recovered but preserved as patch bundles for follow-up review:

- `docs/recovery/patches/from-onedrive-recovery-ADHD-CADDI-V1-uncommitted.patch`
- `docs/recovery/patches/from-onedrive-recovery-ADHD-CADDI-V1-W7-uncommitted.patch`
- `docs/recovery/patches/from-onedrive-recovery-ADHD-CADDI-V1-W9-uncommitted.patch`

These patches capture the exact uncommitted diffs from the valid recovery repos
so no known local work is stranded outside the canonical repo.

Not treated as a valid recovery source:

- `C:\dev\from-onedrive-recovery\old-root-trash-20260306\ADHD-CADDI-V1-W8`

Reason:

- It is a plain folder, not a valid Git worktree or repo at its current path.
- Its contents differ from the canonical repo in many files, but there is no
  trustworthy Git metadata at that location to separate intentional edits from
  stale copied state.
- The canonical repo already absorbed the real committed W8 branch tip from
  `origin/codex/w8-reliability-catches`.
