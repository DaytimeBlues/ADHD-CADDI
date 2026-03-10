# Google Sync Setup Guide — ADHD-CADDI

> **Purpose:** Everything you need to wire up Google Sign-In, Google Tasks sync, and Google Calendar sync for the ADHD-CADDI app.
> This file lives at `docs/GOOGLE_SYNC_SETUP.md` and is safe to commit — it contains **no real secrets**.

---

## 1. What You Need From Google (and Where to Get It)

Google hands your app two "identity cards" (OAuth Client IDs) so sign-in and sync are allowed.
Neither of these is a secret — they are safe to put in `.env` as `EXPO_PUBLIC_` variables.

| Credential | Used For | Where it Goes |
|---|---|---|
| **Web Client ID** | Google Sign-In on web + Android token exchange | `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` in `.env` |
| **iOS Client ID** | Google Sign-In on iPhone / future iOS build | `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` in `.env` |
| **`google-services.json`** | Android native Firebase/Google auth | `android/app/google-services.json` (git-ignored) |

---

## 2. Step-by-Step: Getting Your Client IDs

### Step 1 — Open Google Cloud Console

1. Go to <https://console.cloud.google.com/>
2. Select (or create) your project. Suggested name: **ADHD-CADDI**
3. Note your **Project Number** and **Project ID** — you will need them for `google-services.json`

### Step 2 — Enable the APIs you need

In the console go to **APIs & Services → Library** and enable:

- `Google Sign-In` (included in Google Identity / OAuth 2.0 — always on)
- `Google Tasks API` — for Tasks sync
- `Google Calendar API` — for Calendar sync

### Step 3 — Create OAuth 2.0 Credentials

Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**

#### Web Client ID
- Application type: **Web application**
- Name: `ADHD-CADDI Web`
- Authorised JavaScript origins:
  - `http://localhost:3000` (local dev)
  - `https://daytimeblues.github.io` (production)
- Authorised redirect URIs:
  - `http://localhost:3000`
  - `https://daytimeblues.github.io/ADHD-CADDI`
- Click **Create** → copy the **Client ID** (ends in `.apps.googleusercontent.com`)

#### iOS Client ID (for future iPhone / web parity)
- Application type: **iOS**
- Name: `ADHD-CADDI iOS`
- Bundle ID: `com.adhdcaddi`
- Click **Create** → copy the **Client ID**

#### Android Client ID (embedded inside google-services.json — see Section 3)
- Application type: **Android**
- Name: `ADHD-CADDI Android`
- Package name: `com.adhdcaddi`
- SHA-1 certificate fingerprint: run the command below in your project root to get it:
  ```bash
  cd android && ./gradlew signingReport
  ```
  Use the **debug** SHA-1 for development builds.

---

## 3. The `google-services.json` File (Android)

Your repo already has a template at:
```
android/app/google-services.json.example
```

The real file (`android/app/google-services.json`) is **git-ignored** and must never be committed.

### How to generate it

1. In Google Cloud Console → go to your project
2. Click **"Add app"** → choose **Android**
3. Package name: `com.adhdcaddi`
4. App nickname: `ADHD-CADDI`
5. Provide your SHA-1 fingerprint (from `gradlew signingReport`)
6. Download `google-services.json`
7. Place it at `android/app/google-services.json`

### Template structure (from `google-services.json.example`)

```json
{
  "project_info": {
    "project_number": "YOUR_PROJECT_NUMBER",
    "project_id": "your-project-id",
    "storage_bucket": "your-project-id.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:YOUR_PROJECT_NUMBER:android:YOUR_APP_ID",
        "android_client_info": {
          "package_name": "com.adhdcaddi"
        }
      }
    }
  ]
}
```

---

## 4. Wiring the Client IDs Into the App

### `.env` file (copy `.env.example` → `.env`)

```env
# Google OAuth Client IDs — public identifiers, safe as EXPO_PUBLIC_
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=YOUR_IOS_CLIENT_ID.apps.googleusercontent.com
```

The app reads these at runtime via the env vars already defined in `.env.example`.
Do **not** add a `GOOGLE_CLIENT_SECRET` here — secrets belong server-side only.

---

## 5. Which Google Features to Enable First

Recommended order (least → most complex):

| Priority | Feature | Scopes Required |
|---|---|---|
| 1 | **Google Sign-In only** | `openid`, `email`, `profile` |
| 2 | **Google Tasks sync** | `https://www.googleapis.com/auth/tasks` |
| 3 | **Google Calendar sync** | `https://www.googleapis.com/auth/calendar.readonly` |
| 4 | **All of the above** | All scopes above combined |

Start with Sign-In only to confirm auth is working, then add Task and Calendar scopes incrementally.

---

## 6. GitHub Actions / CI Secrets

For CI builds (Android APK via `.github/workflows/android.yml`) add these as **GitHub repository secrets**:

| Secret Name | Value |
|---|---|
| `GOOGLE_SERVICES_JSON` | Full contents of `google-services.json` (base64 encoded recommended) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Your Web Client ID |

In the workflow, decode and write `google-services.json` before the Gradle build step.

---

## 7. Quick Checklist

- [ ] Google Cloud project created
- [ ] Google Tasks API enabled
- [ ] Google Calendar API enabled
- [ ] Web Client ID created and copied
- [ ] iOS Client ID created and copied (optional for now)
- [ ] Android OAuth credential created with correct SHA-1
- [ ] `google-services.json` downloaded and placed at `android/app/google-services.json`
- [ ] `.env` updated with `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- [ ] `.env` updated with `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` (optional)
- [ ] `GOOGLE_SERVICES_JSON` added to GitHub Actions secrets
- [ ] Tested sign-in locally at `http://localhost:3000`

---

## 8. Where Each File Lives in This Repo

```
ADHD-CADDI/
├── .env                          ← your real values (git-ignored)
├── .env.example                  ← template with EXPO_PUBLIC_GOOGLE_* placeholders
├── android/
│   └── app/
│       ├── google-services.json          ← real file (git-ignored)
│       └── google-services.json.example  ← structure template (committed)
└── docs/
    └── GOOGLE_SYNC_SETUP.md      ← this file
```

---

## 9. Useful Links

- Google Cloud Console: <https://console.cloud.google.com/>
- OAuth Credentials page: <https://console.cloud.google.com/apis/credentials>
- Google Tasks API: <https://developers.google.com/tasks>
- Google Calendar API: <https://developers.google.com/calendar>
- `@react-native-google-signin/google-signin` docs: <https://react-native-google-signin.github.io/docs/setting-up/get-config-file>
- Firebase Console (alternative to Cloud Console for Android setup): <https://console.firebase.google.com/>

---

*Last updated: March 2026 — ADHD-CADDI project by DaytimeBlues*


---

## 10. Complete Setup Requirements (Elaborated)

### APIs You MUST Enable

Yes, you need to enable APIs. Go to **APIs & Services → Library** in Google Cloud Console and enable:

1. **Google Sign-In** (OAuth 2.0 / OpenID Connect — usually always on)
2. **Google Tasks API** — required for Tasks sync
3. **Google Calendar API** — required for Calendar sync

Without these enabled, your OAuth tokens won't have permission to access Tasks or Calendar data even if the scopes are requested.

### OAuth Consent Screen

Before creating OAuth credentials, configure the **OAuth consent screen**:

1. Go to **APIs & Services → OAuth consent screen**
2. Choose **External** (for personal use) or **Internal** (if you have a Google Workspace org)
3. Fill in:
   - App name: **ADHD-CADDI**
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/tasks`
   - `https://www.googleapis.com/auth/calendar.events`
5. Add test users if your app is in testing mode (you can add yourself and family/friends)
6. Save and continue

### SHA Fingerprints for Android (Critical)

For Android Google Sign-In to work, you **must** register your app's SHA-1 and SHA-256 fingerprints in Firebase/Google Cloud.

#### Get Your SHA Fingerprints

Run this in your project root:

```bash
cd android && ./gradlew signingReport
```

You'll see output like:

```
Variant: debug
Config: debug
Store: /Users/you/.android/debug.keystore
Alias: AndroidDebugKey
MD5: ...
SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
SHA-256: 11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11
```

Copy both the **SHA-1** and **SHA-256** values.

#### Add SHA Fingerprints to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one: **ADHD-CADDI**)
3. Click **Project settings** (gear icon)
4. Scroll to **Your apps** → select your Android app (package: `com.adhdcaddi`)
5. Click **Add fingerprint**
6. Paste your **SHA-1** → Save
7. Click **Add fingerprint** again
8. Paste your **SHA-256** → Save

For production builds, repeat this process with your **release keystore** SHA fingerprints.

---

## 11. Firebase App Distribution (Testing Without Play Store)

If you want to distribute your app to family/friends for testing **without publishing to Play Store**, Firebase App Distribution is the best option.

### What You Need for Firebase App Distribution

1. A Firebase project (create at [console.firebase.google.com](https://console.firebase.google.com/))
2. Your Android app registered in Firebase with package name `com.adhdcaddi`
3. `google-services.json` (you'll get this when you add the Android app)
4. A signed APK or AAB file to upload
5. Tester email addresses (you can add them later)

### How It Works

1. **You build and upload** an APK/AAB to Firebase App Distribution
2. **Testers get an email invite** with a download link
3. **Testers install the Firebase App Distribution app** on their Android phones
4. **Testers download and install your app** through the Firebase app
5. **You push updates** and testers get notified

### Setup Steps

1. Go to Firebase Console → **App Distribution**
2. Click **Get started**
3. Upload your first build (APK or AAB)
4. Add tester emails or create tester groups
5. Send invite

Testers will receive an email with instructions.

### Direct APK Sharing (Simpler for Your Own Phone)

For **just your own phone**, you don't need Firebase App Distribution:

1. Build the APK:
   ```bash
   npm run build:android:preview
   ```
2. The APK is at `android/app/build/outputs/apk/preview/release/app-preview-release.apk`
3. Transfer it to your phone (USB, Google Drive, etc.)
4. Open the APK file on your phone → Android will prompt you to install it
5. Enable "Install from unknown sources" if prompted

This is the fastest way to test on your own device first.

---

## 12. Important: Google Workspace MCP Server Status

**As of March 2026, there is NO official Google Workspace MCP server.**

Google's own documentation says:
> "Star and subscribe to the feature request for an MCP server to connect to Google Workspace APIs."

What this means:
- **Official Google stance:** Not ready yet for Workspace MCP integration
- **Practical reality:** Third-party Google Workspace MCP servers exist on GitHub
- **Recommendation for ADHD-CADDI:** Do NOT depend on a third-party MCP just to get sign-in/tasks/calendar working

Instead, use **direct OAuth + REST API integration**:
- Sign in with `@react-native-google-signin/google-signin`
- Call Google Tasks API directly with the access token
- Call Google Calendar API directly with the access token

This is more reliable and does not require MCP.

**Sources:**
- [Google Workspace + LLM guide](https://developers.google.com/workspace/guides/build-with-llms)
- [Google Calendar API auth scopes](https://developers.google.com/workspace/calendar/api/auth)
- [Firebase Android setup](https://firebase.google.com/docs/android/setup)

---

## 13. Recommended OAuth Scopes

For your use case (sign-in, Tasks, Calendar), request these scopes:

| Scope | Purpose |
|---|---|
| `openid` | OpenID Connect authentication |
| `email` | User's email address |
| `profile` | User's basic profile info (name, photo) |
| `https://www.googleapis.com/auth/tasks` | Full read/write access to Google Tasks |
| `https://www.googleapis.com/auth/calendar.events` | Read/write access to Calendar events |

Alternatively, for read-only Calendar:
- `https://www.googleapis.com/auth/calendar.readonly`

For the most flexible Calendar access:
- `https://www.googleapis.com/auth/calendar`

---

## 14. Where to Find Your Web Client ID (Step-by-Step)

If you already created OAuth credentials but can't find the Client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (top dropdown)
3. Open **APIs & Services → Credentials**
4. Look under **OAuth 2.0 Client IDs**
5. Find the one with type **Web application**
6. Click on it to open
7. The **Client ID** is displayed at the top (ends in `.apps.googleusercontent.com`)
8. Copy it and paste into your `.env` as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

---

## 15. Next Steps After Setup

Once you have:
- ✅ Web Client ID in `.env`
- ✅ `google-services.json` at `android/app/google-services.json`
- ✅ APIs enabled (Tasks, Calendar)
- ✅ OAuth consent screen configured
- ✅ SHA fingerprints registered in Firebase

**Then:**

1. **Test locally on web first:**
   ```bash
   npm run web
   ```
   Open `http://localhost:3000` → try Google Sign-In

2. **Test on your Android phone:**
   ```bash
   npm run install:android:preview
   ```
   The app will install on your connected phone

3. **If sign-in works, test Tasks and Calendar sync**

4. **Once stable, set up Firebase App Distribution for friends/family**

---

*Last updated: March 2026 — ADHD-CADDI project by DaytimeBlues*
