# Security Research Codespace

This devcontainer is pre-configured to run the [GitHub Security Lab Taskflow Agent](https://github.com/GitHubSecurityLab/seclab-taskflow-agent) for AI-powered security research on ADHD-CADDI.

## One-Time Setup

1. Create a fine-grained PAT at https://github.com/settings/personal-access-tokens/new (add the **Models** permission)
2. Add Codespace secrets at https://github.com/settings/codespaces/secrets/new:
   - `GH_TOKEN` -> your PAT
   - `AI_API_TOKEN` -> same PAT
   - Grant access to **DaytimeBlues/ADHD-CADDI**
3. Start a Codespace from this repo (Code -> Codespaces -> New)

## Running the Taskflow Agent

Wait for `(.venv)` in the terminal prompt, then:

```bash
python -m seclab_taskflow_agent --help
```

## Automated Security Scans (GitHub Actions)

| Workflow | Trigger | Purpose |
|---|---|---|
| codeql.yml | push / PR / weekly | Static analysis for JS/TS security bugs |
| dependency-review.yml | PR only | Flags vulnerable npm packages |
| gitleaks.yml | push / PR | Detects leaked secrets/tokens |

View results under **Security -> Code scanning alerts** on GitHub.
