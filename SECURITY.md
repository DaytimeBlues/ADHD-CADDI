# Security Policy

## Supported Versions

We actively maintain the following branches and recommend all users stay up to date with the latest release.

- `main` – actively supported
- Other branches – no security support guarantees

## Reporting a Vulnerability

If you believe you have found a security vulnerability in ADHD-CADDI:

- Do **not** open a public GitHub issue.
- Email: security@yourdomain.example (or use GitHub Security Advisories if enabled).
- Include: a description of the issue, steps to reproduce, expected vs actual behaviour, and any potential impact you see.

We aim to:

- Acknowledge reports within 3 business days.
- Provide an initial assessment and next steps within 7 business days.
- Coordinate a fix and release, and credit you if desired.

If your report involves exposed secrets (API keys, tokens, passwords), please revoke or rotate the secret immediately before or after contacting us.

## Scope

This policy covers:

- The ADHD-CADDI source code in this repository.
- GitHub Actions workflows defined under `.github/workflows`.
- Sample configurations or scripts shipped with this project.

It does **not** cover:

- Third-party services or libraries we depend on.
- Forks or private deployments managed by others.

## Security Practices

We follow these development and operational practices:

- Use of GitHub’s code security features (Dependabot, code scanning, secret scanning and push protection) on the `main` branch.
- Protected `main` branch with required status checks for tests and security scans.
- Principle of least privilege for GitHub permissions and repository secrets.
- Regular review of dependency vulnerabilities and GitHub security alerts.

## Safe Communication

We support encrypted communication for sensitive reports:

- (Optional) Public PGP key: link or fingerprint here.
- Please avoid sending active credentials; redact or rotate them first.

## Responsible Disclosure

We ask that you:

- Give us reasonable time to remediate before public disclosure.
- Avoid privacy violations, data destruction, or service disruption while testing.
- Comply with applicable laws and only test systems you are authorized to test.

We commit to treating all good-faith security research with respect and without legal threats.
