# Firebase Authentication Setup Documentation

**Last Updated:** March 19, 2026  
**Project:** ADHD-CADDI  
**Firebase Project ID:** `adhd-3f643`  
**Firebase Plan:** Spark (Free)

---

## Overview

This document describes the Firebase Authentication setup completed for ADHD-CADDI on March 19, 2026. It serves as a reference for LLMs and developers to understand the current auth configuration, project structure, and implementation details.

---

## Firebase Console Configuration

### Project Details

- **Project Name:** ADHD
- **Project ID:** `adhd-3f643`
- **Project Number:** `239988407398`
- **Console URL:** https://console.firebase.google.com/u/0/project/adhd-3f643
- **Plan:** Spark (Free) — sufficient for Firebase Authentication
- **Repository `.firebaserc`:** Points to `adhd-3f643` as the default project

### Authentication Providers Enabled

Both providers are **enabled** in Firebase Console → Authentication → Sign-in method:

1. **Email/Password** ✅
   - Allows users to sign up with email + password
   - Password recovery and email verification supported by Firebase SDK
   - No additional configuration needed

2. **Google** ✅
   - OAuth 2.0 provider for Google Sign-In
   - Support email configured: `stevehye29@gmail.com`
   - Scopes configured in `src/services/firebase.ts`:
     - `https://www.googleapis.com/auth/tasks` (Google Tasks API)
     - `https://www.googleapis.com/auth/calendar.events` (Google Calendar API)
   - **Requires OAuth Client IDs** (see Google Cloud Platform section below)

### Web App Registration

A web app was registered in Firebase Console → Project Settings → Your apps:

- **App Nickname:** ADHD-CADDI
- **Registered:** March 19, 2026
- **Platform:** Web
- **Config exported** to `src/services/firebase.ts` (see below)

---

## Firebase SDK Configuration

### File: `src/services/firebase.ts`

**Location:** `src/services/firebase.ts`  
**Committed:** March 19, 2026 (commit `584e9fb`)  
**Purpose:** Initialize Firebase app singleton and export auth instance + providers

#### Key Features

1. **App Singleton with Hot Reload Safety**
   - Uses `getApps()` guard to prevent duplicate initialization
   - Safe for Expo hot reload and development builds

2. **Cross-Platform Persistence**
   - Automatically detects environment (web vs native)
   - Uses `AsyncStorage` for React Native/Expo
   - Falls back to `localStorage` for web builds

3. **Pre-configured Providers**
   - Google provider with Tasks + Calendar scopes
   - Email/Password provider ready for use

4. **Environment Variable Support**
   - Config values use `EXPO_PUBLIC_FIREBASE_*` env vars with hardcoded fallbacks
   - Allows swapping projects via `.env` without code changes

#### Exports

- `auth` — Firebase Auth instance (with proper persistence)
- `firebaseApp` — Firebase app singleton
- `googleProvider` — Pre-configured Google OAuth provider
- `emailProvider` — Pre-configured Email/Password provider

---

## Firebase Config Object

The following config was generated from Firebase Console and embedded in `src/services/firebase.ts`:

```javascript
{
  apiKey: "AIzaSyAlO-f1PEwV4C8cOUYCc5LiJ02IWh3IoPA",
  authDomain: "adhd-3f643.firebaseapp.com",
  projectId: "adhd-3f643",
  storageBucket: "adhd-3f643.firebasestorage.app",
  messagingSenderId: "239988407398",
  appId: "1:239988407398:web:d085da279a7a70f6e301a7",
  measurementId: "G-QPP8H2B002"
}
```

**Security Note:** Firebase API keys are **not secrets**. They identify the project but do not grant admin access. Security is enforced via Firebase Security Rules on the backend.

---

## Google Cloud Platform Configuration

### OAuth Client IDs

Google Sign-In requires OAuth 2.0 Client IDs from Google Cloud Console:

1. **Web Client ID** (Required for Android Google Sign-In)
   - Type: Web application
   - Used by: `OAuthWebAdapter.ts` and `OAuthNativeAdapter.ts`
   - Environment variable: `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
   - Format: `*.apps.googleusercontent.com`

2. **Android Client ID** (Auto-created by Firebase)
   - Type: Android
   - Linked to: Package `com.adhdcaddi` + SHA-1/SHA-256 fingerprints
   - Created when SHA fingerprints are added to Firebase Console

3. **iOS Client ID** (Optional, for iOS builds)
   - Type: iOS
   - Environment variable: `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
   - Bundle ID: `com.adhdcaddi`

### APIs Enabled

The following Google Cloud APIs are enabled for the project:

- ✅ **Google Tasks API** — for task sync
- ✅ **Google Calendar API** — for calendar events sync

### OAuth Consent Screen

Configured in Google Cloud Console → APIs & Services → OAuth consent screen:

- **User Type:** External
- **Scopes Added:**
  - `https://www.googleapis.com/auth/tasks`
  - `https://www.googleapis.com/auth/calendar.events`

---

## Existing OAuth Architecture

ADHD-CADDI currently uses a **backend-based OAuth flow** (not direct Firebase Auth SDK sign-in). The existing architecture:

### Files

- `src/services/oauth/OAuthBase.ts` — Abstract OAuth service base class
- `src/services/oauth/OAuthWebAdapter.ts` — Web OAuth popup flow
- `src/services/oauth/OAuthNativeAdapter.ts` — Native OAuth flow (In-App Browser)
- `src/services/oauth/OAuthShared.ts` — Shared types and utilities

### Flow

1. App calls backend `/api/google-init` or `/api/todoist-init`
2. Backend returns `authUrl` + `state` token
3. Client opens popup/in-app browser with `authUrl`
4. OAuth provider redirects to backend `/api/google-callback`
5. Backend exchanges code for tokens, returns tokens to client
6. Client stores tokens in AsyncStorage (native) or localStorage (web)

### Integration Point

The new `src/services/firebase.ts` **does not replace** this flow. It provides:

- Firebase Auth SDK initialization
- Direct client-side Google Sign-In (alternative to backend flow)
- Email/Password authentication (new capability)

---

## Next Steps (Not Yet Implemented)

### 1. Firebase Auth Service Wrapper

Create `src/services/FirebaseAuthService.ts` to wrap Firebase Auth SDK methods for sign-in, sign-up, and sign-out.

### 2. Integrate with Existing OAuth Adapters

**Option A:** Dual Mode — Keep backend OAuth for Todoist, use Firebase Auth SDK for Google + Email/Password

**Option B:** Migrate — Replace backend OAuth entirely with Firebase Auth SDK (requires server-side token exchange for Todoist)

### 3. Update Environment Variables

Add Firebase config to `.env` (optional, fallbacks exist in code)

### 4. Add Dependencies

Ensure these packages are installed:
- `firebase`
- `@react-native-async-storage/async-storage`

### 5. Update Tests

Add unit tests for firebase.ts initialization and auth service methods.

---

## Troubleshooting

### "API not enabled" Error

Go to Google Cloud Console and enable Google Tasks API and Google Calendar API.

### "Sign-in failed: DEVELOPER_ERROR" (Android)

Run `keytool` to get SHA-1/SHA-256 fingerprints and add them to Firebase Console.

### "Invalid client ID"

Verify `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is set correctly in `.env` and matches Google Cloud Console.

---

## Security Considerations

### What's Public (Safe to Commit)

- Firebase API Key, Auth Domain, Project ID, Storage Bucket, etc.
- Google OAuth Web Client ID
- Google OAuth iOS Client ID

### What's Secret (Never Commit)

- `google-services.json` (gitignored)
- Service account JSON keys (never use in client code)
- Refresh tokens (stored in AsyncStorage/localStorage)
- Backend API secrets (in server environment variables)

### Security Enforcement

Firebase enforces security via Firebase Security Rules and OAuth scopes. The Firebase API key **identifies the project** but does not grant write access.

---

## Plan Considerations

### Spark Plan (Free) Limits

✅ **Unlimited Firebase Authentication**  
✅ 50K Firestore reads/day (not used yet)  
✅ 20K Firestore writes/day (not used yet)  
❌ **No Cloud Functions** (requires Blaze plan)

### When to Upgrade to Blaze

Upgrade if you need Cloud Functions, higher Firestore limits, or Cloud Storage beyond 1GB.

**Current Status:** Spark plan is **sufficient** for Firebase Authentication alone.

---

## References

- **Firebase Console:** https://console.firebase.google.com/u/0/project/adhd-3f643
- **Firebase Auth Docs:** https://firebase.google.com/docs/auth
- **Google Sign-In for Android:** https://developers.google.com/identity/sign-in/android
- **Expo Firebase Guide:** https://docs.expo.dev/guides/using-firebase/

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-19 | Created `src/services/firebase.ts` with Email/Password + Google providers |
| 2026-03-19 | Enabled Email/Password and Google auth in Firebase Console |
| 2026-03-19 | Registered ADHD-CADDI web app in Firebase Console |
| 2026-03-19 | Created this documentation |

---

**End of Document**
