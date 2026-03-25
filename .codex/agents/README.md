# Project Subagents

These files are project-specific Codex subagents for `C:\dev\ADHD-CADDI-V1`.

If you are new to this: a subagent is a helper with a narrow specialty. It does not replace the main Codex session. It handles one focused job, then reports back.

Installed for this repo:

- `code-mapper.toml`: traces the real code path before edits
- `docs-researcher.toml`: checks docs and version-specific API behavior
- `mobile-developer.toml`: handles React Native and device-specific app work
- `react-specialist.toml`: focuses on component behavior and state flow
- `typescript-pro.toml`: handles type contracts and compiler-driven fixes
- `ui-fixer.toml`: makes the smallest safe UI patch after reproduction
- `reviewer.toml`: reviews for correctness, regressions, security, and missing tests
- `test-automator.toml`: adds or improves automated regression coverage

Recommended delegation patterns:

- Bug triage:
  `Use code-mapper to trace the owning files, then ui-fixer to patch the smallest safe fix, then test-automator to add regression coverage.`

- React Native feature work:
  `Use mobile-developer for the implementation, typescript-pro for type boundary review, and reviewer for a final risk review.`

- Framework uncertainty:
  `Use docs-researcher to verify the API behavior first, then continue with react-specialist or mobile-developer.`

Important limitation:

Codex does not automatically spawn custom subagents just because these files exist. They are now installed and ready, but they still need explicit delegation in the prompt or from a Codex workflow that chooses to call them.
