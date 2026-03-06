# Worktree Handoff

This is the repo-tracked mirror of the local workspace handoff note. The local
copies in `C:\dev` are convenience files for the current machine; this file is
the shared reference that can be pushed, reviewed, and linked from repo docs.

## Canonical Layout

- Canonical local workspace root: `C:\dev`
- Canonical clone: `C:\dev\ADHD-CADDI-V1`
- Canonical remote: `origin = https://github.com/DaytimeBlues/ADHD-CADDI.git`
- Canonical default branch: `main`
- Canonical integration branch: `codex/road-to-90-integration`

## Worktree Map

- `C:\dev\ADHD-CADDI-V1` -> `main` -> push to `origin/main`
- `C:\dev\ADHD-CADDI-V1-W7` -> `codex/w7-a11y-calendar` -> push to `origin/codex/w7-a11y-calendar`
- `C:\dev\ADHD-CADDI-V1-W8` -> `codex/w8-reliability-catches` -> push to `origin/codex/w8-reliability-catches`
- `C:\dev\ADHD-CADDI-V1-W9` -> `codex/w9-monolith-and-coverage` -> push to `origin/codex/w9-monolith-and-coverage`
- `C:\dev\ADHD-CADDI-V1-INT` -> `codex/road-to-90-integration` -> push to `origin/codex/road-to-90-integration`

## Recovery Worktrees

These folders are preserved rescue snapshots from the old OneDrive copies.
They are local-only recovery branches and should not be treated as active
development locations.

- `C:\dev\ADHD-CADDI-V1-REC-W7` -> `codex/recover-w7-onedrive-20260306`
- `C:\dev\ADHD-CADDI-V1-REC-W9` -> `codex/recover-w9-onedrive-20260306`
- `C:\dev\ADHD-CADDI-V1-REC-W9-ROOT` -> `codex/recover-w9-root-onedrive-20260306`

## Working Rules

- Do not start new work in the old OneDrive copies.
- Work from the folder that matches the branch you intend to update.
- Use plain `git push` from that folder.
- Treat `REC-*` folders as review/cherry-pick sources, not destination branches.
- If a new parallel worker is needed, create a new branch and add a new worktree under `C:\dev`.

## Current Integration Order

1. Validate and finish `W9`
2. Review `REC-*` folders and decide what to cherry-pick
3. Merge `W7` into `INT`
4. Merge `W8` into `INT`
5. Merge `W9` into `INT`
6. Push `INT` to `origin/codex/road-to-90-integration`

## Useful Commands

```powershell
git -C "C:\dev\ADHD-CADDI-V1" worktree list
git -C "C:\dev\ADHD-CADDI-V1-W9" status --short --branch
git -C "C:\dev\ADHD-CADDI-V1-W9" push --dry-run
git -C "C:\dev\ADHD-CADDI-V1-REC-W9-ROOT" status --short --branch
```
