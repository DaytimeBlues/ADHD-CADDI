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
