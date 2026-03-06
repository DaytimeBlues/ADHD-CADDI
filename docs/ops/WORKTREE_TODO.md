# Worktree Todo

This is the repo-tracked mirror of the local multi-worktree todo note. The
local file in `C:\dev` is still useful for machine-local continuity; this file
is the shared version that can be pushed with the repo.

## Current State

- `main`: clean
- `W7`: clean, committed accessibility work
- `W8`: clean, committed logging/reliability work
- `W9`: active refactor work in progress
- `INT`: clean integration branch
- `REC-*`: preserved recovery folders, not active development branches

## Execution Order

1. Finish and validate `W9`
2. Review `REC-*` folders and record whether each is already captured, needs cherry-pick, or can be discarded
3. Merge `W7` into `INT`
4. Merge `W8` into `INT`
5. Merge `W9` into `INT`
6. Complete remaining audit/tooling/doc cleanup
7. Run full validation from the integrated branch

## Validation Defaults

- `npm run lint`
- `npx tsc --noEmit`
- targeted Jest tests for the files brought in by a branch
- full `npm test -- --runInBand`
- `npm run e2e:smoke` before release/deploy work

## Resume Commands

```powershell
git -C "C:\dev\ADHD-CADDI-V1" worktree list
git -C "C:\dev\ADHD-CADDI-V1-INT" status --short --branch
git -C "C:\dev\ADHD-CADDI-V1-W9" status --short --branch
```
