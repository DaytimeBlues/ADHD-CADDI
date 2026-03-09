# Dependency Review — ADHD-CADDI

**Date:** 2026-03-09  
**Scope:** `package.json` (all direct dependencies) + full transitive tree  
**Total installed packages:** 1 681 (960 prod / 680 dev / 31 optional / 37 peer)  
**Lock-file version:** `package-lock.json` v3

---

## 1. Known Vulnerabilities

| Source | Result |
|---|---|
| `npm audit` | ✅ **0 vulnerabilities** (info / low / moderate / high / critical) |
| GitHub Advisory Database (all 55 direct deps) | ✅ **0 advisories** |

No CVEs were identified against any installed version of any direct dependency.

---

## 2. Outdated Production Dependencies

Packages where a newer version is available and the difference is notable.

| Package | Installed | Latest | Notes |
|---|---|---|---|
| `react-native` | **0.74.3** | 0.84.1 | ~10 minor releases behind; RN 0.76 introduced the New Architecture as default |
| `react` | **18.2.0** | 19.2.4 | React 19 is stable; upgrade requires RN 0.76+ |
| `react-dom` | **18.2.0** | 19.2.4 | Follows `react` |
| `@react-navigation/native` | **6.1.18** | 7.1.33 | v7 is a breaking-change release |
| `@react-navigation/stack` | **6.4.1** | 7.8.4 | v7 is a breaking-change release |
| `@react-navigation/bottom-tabs` | **6.6.1** | 7.15.5 | v7 is a breaking-change release |
| `@op-engineering/op-sqlite` | **14.1.4** | 15.2.5 | Minor major bump; review changelog |
| `@react-native-async-storage/async-storage` | **1.24.0** | 3.0.1 | **Two major versions** behind |
| `react-native-reanimated` | **3.11.0** | 4.2.2 | v4 dropped bare RN support; requires RN New Arch |
| `react-native-safe-area-context` | **4.14.1** | 5.7.0 | Major bump |
| `react-native-screens` | **3.37.0** | 4.24.0 | Major bump |
| `react-native-gesture-handler` | **2.16.2** | 2.30.0 | Minor only; safe to update |
| `react-native-sound` | **0.11.2** | 0.13.0 | Minor only; see section 5 |
| `@sentry/react-native` | **8.1.0** | 8.3.0 | Minor patch; safe to update |
| `expo-notifications` | **0.32.16** | 55.0.11 | **Major** – Expo SDK version renaming changed scheme |
| `expo-local-authentication` | **17.0.8** | 55.0.8 | **Major** – same Expo SDK renaming |

> **Recommendation:** The core blocker is `react-native` 0.74 → 0.76 (New Architecture). Most major-version jumps for navigation, reanimated, screens, and gesture-handler are gated behind that RN upgrade. Plan a single coordinated RN + ecosystem upgrade sprint rather than individual package bumps.

---

## 3. Outdated Dev Dependencies

| Package | Installed | Latest | Notes |
|---|---|---|---|
| `eslint` | **8.57.1** | 9.x | ESLint 8 is officially deprecated (see §4) |
| `prettier` | **3.3.2** | 3.5.x | Patch updates available |
| `@playwright/test` | **1.58.1** | current (tracks itself) | Already at a very recent version |

---

## 4. Deprecated Packages

### 4a. Deprecated Direct Dependencies

| Package | Deprecation Message | Recommended Alternative |
|---|---|---|
| `eslint` v8 | "This version is no longer supported" | Upgrade to ESLint v9 with flat config |
| `react-native-vector-icons` | "Package has moved to per-icon-family packages" | Use `@react-native-vector-icons/<family>` packages |

### 4b. Deprecated Transitive Packages (not directly controllable)

These are introduced by direct dependencies; the deprecation warnings are informational.

| Package | Deprecated By | Root Cause |
|---|---|---|
| `glob` v7/v8 | `@expo/config`, `@expo/config-plugins`, `@expo/fingerprint` | Expo SDK internals; resolves on Expo upgrade |
| `rimraf` v3 | `mv`, `temp`, `@rnx-kit/chromium-edge-launcher`, `flat-cache` | Build/tooling internals |
| `inflight` | `glob` v7/v8 | Memory-leak risk; mitigated by Expo upgrade |
| `sudo-prompt` | `@react-native-community/cli-tools` | React Native CLI; resolves on RN upgrade |
| `querystring` (Node.js built-in) | `@react-native/community-cli-plugin` | RN CLI; resolves on RN upgrade |
| `@humanwhocodes/config-array` / `object-schema` | `eslint` v8 | Resolves on ESLint v9 upgrade |
| `@babel/plugin-proposal-*` (×8) | `@react-native/babel-preset` | Babel proposals merged to spec; benign |

> **Key takeaway:** All deprecated transitive packages trace back to either **Expo SDK**, **React Native CLI**, or **ESLint 8**. Upgrading those three roots would eliminate all deprecation warnings.

---

## 5. Package-Specific Risk Notes

### `react-native-sound` v0.11.2
- Last npm publish: **2020-03-01** (6 years old).
- No official deprecation but the project is visibly low-maintenance on GitHub.
- Latest release is v0.13.0 (2024), which adds bare React Native 0.73+ support.
- **Recommendation:** Update to v0.13.0 or evaluate replacing with `expo-av` (already a dependency) for the audio use-cases.

### `@react-native-async-storage/async-storage` v1.x → v3.x
- v3.0.1 was released in early 2025 with a rewritten native layer.
- The API surface is largely backward-compatible but there are breaking changes in the advanced multi-get/multi-set APIs.
- **Recommendation:** Plan a dedicated upgrade; run the test suite carefully.

### `@sentry/react-native` v8.1.0
- v8.1.0 is the pinned minor; v8.3.0 is the latest patch.
- Sentry minor releases are generally safe to absorb.
- **Recommendation:** Bump to `^8.3.0`.

---

## 6. Version-Range Strategy

| Range style | Count | Assessment |
|---|---|---|
| Exact pin (e.g. `"18.2.0"`) | 10 | ✅ Best reproducibility |
| Caret `^` (minor/patch updates) | 45 | ⚠️ Acceptable; relies on lock-file to freeze |
| Tilde `~` (patch only) | 0 | — |
| Permissive (`>=`, `*`, `latest`) | 0 | ✅ None |

**Observations:**
- The lock-file (`package-lock.json` v3) is present and committed, which mitigates the risk of `^` ranges pulling unexpected updates in CI.
- Critical runtime packages (`react`, `react-native`, `react-native-gesture-handler`, `react-native-reanimated`, `react-test-renderer`, `@react-native/*`) are already exact-pinned — good practice.
- Consider tightening `^` to exact pins for a handful of security-sensitive runtime packages: `@sentry/react-native`, `expo-local-authentication`, `expo-notifications`.

---

## 7. Lock-File & Supply Chain Hygiene

| Check | Result |
|---|---|
| Lock-file present (`package-lock.json`) | ✅ Yes |
| Lock-file version | v3 (npm 7+) |
| All packages have integrity hashes | ✅ Yes (0 missing) |
| All packages have resolved URLs | ✅ Yes (0 missing) |
| Packages sourced from git / GitHub URLs | ✅ None |
| Packages sourced from local `file:` paths | ✅ None |
| All packages resolve from the official npm registry | ✅ Yes |

The dependency supply-chain is clean: all packages are sourced exclusively from `registry.npmjs.org`, every entry carries an `integrity` (SRI) hash, and there are no git-source or local-path dependencies.

---

## 8. License Scan

| Category | Finding |
|---|---|
| MIT / Apache-2.0 / BSD | Vast majority of the tree |
| GPL family | `node-forge` v1.3.3 — `(BSD-3-Clause OR GPL-2.0)` |

### `node-forge` Dual License
- Introduced transitively by `@expo/code-signing-certificates`, `@expo/cli`, and `selfsigned` (webpack-dev-server).
- The `OR` means the consumer may choose the BSD-3-Clause option — **there is no GPL obligation for this project**.
- No other GPL/AGPL/LGPL/proprietary licenses were found in the full 1 681-package tree.

---

## 9. GitHub Actions Supply-Chain

All workflow files use **major-version tags** (e.g. `actions/checkout@v4`, `github/codeql-action/init@v3`). This is the GitHub-recommended default.

| Posture | Major-tag | SHA-pinned |
|---|---|---|
| Current state | ✅ (all actions) | ❌ |

**Note:** For higher-assurance environments, SHA-pinning (e.g. `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2`) eliminates the risk of a compromised tag being silently replaced. Tools like **Dependabot Actions version updates** or **`pin-github-action`** automate this. For a personal/open-source project, major-tag pinning is generally acceptable.

---

## 10. Existing Security Controls

The repository already has strong automated controls in place:

| Control | Workflow | Coverage |
|---|---|---|
| `npm audit` on every PR | `ci.yml` (via `npm ci`) | CVE detection |
| GitHub Dependency Review | `dependency-review.yml` | Blocks PRs that introduce `moderate+` vulns |
| CodeQL SAST | `codeql.yml` | JavaScript/TypeScript; weekly + every PR |
| Secret scanning | `gitleaks.yml` | Every push and PR to `main` |

---

## 11. Summary & Recommendations

### Immediate (low-risk, no breaking changes)

1. **Bump `@sentry/react-native`** from 8.1.0 → 8.3.0 (patch).
2. **Bump `react-native-sound`** from 0.11.2 → 0.13.0 (patch/minor).
3. **Bump `@react-native-google-signin/google-signin`** to 16.1.2 (patch).
4. **Bump `expo-modules-core`** to 55.0.14 and `react-dom` to 18.3.1 (patch).

### Medium-term (upgrade ESLint 8 → 9)

5. **Upgrade `eslint`** to v9 with the flat config format. Eliminates the `eslint`, `@humanwhocodes/config-array`, and `@humanwhocodes/object-schema` deprecation warnings.
6. **Migrate `react-native-vector-icons`** to the new `@react-native-vector-icons/<family>` model.

### Planned sprint (React Native platform upgrade)

7. **Upgrade `react-native`** 0.74 → 0.76 (enables New Architecture by default). This is the unlock for:
   - `react` + `react-dom` 18.2 → 19.x
   - `react-native-reanimated` 3.x → 4.x
   - `@react-navigation/*` v6 → v7
   - `react-native-screens` v3 → v4
   - `react-native-safe-area-context` v4 → v5
   - `expo-*` packages from SDK 52 → SDK 53 naming scheme
8. **After RN upgrade:** update `@react-native-async-storage/async-storage` v1 → v3 (two major versions; test carefully).
