# ADHD-CADDI - Android-First React Native App

> [!IMPORTANT] > **Android-First Strategy**: Android is the primary release target and receives full feature support. Web is maintained for development convenience and limited friend testing, but does not have feature parity with Android.

## Platform Strategy

### Android (Primary)

- **Full feature support**: All features work natively on Android
- **System integrations**: Floating overlay, notifications, deep linking
- **Offline-first**: SQLite local storage with sync when online
- **Distribution**: Firebase App Distribution for internal beta, Play Store for production
- **CI/CD**: Automated builds via `.github/workflows/android.yml`

### Web (Secondary/Development)

- **Purpose**: Local development, UI iteration, limited friend testing
- **Limitations**: No overlay, limited offline support, no native integrations
- **Hosting**: Firebase Hosting only
- **Scope**: Home, Focus, Tasks, Brain Dump, Check In, Chat, Diagnostics

## Quick Start (Android)

### Prerequisites

- Node.js 20
- JDK 17
- Android Studio (for emulator)

### Install Dependencies

```bash
npm install
```

### Run on Android Emulator

```bash
# Start emulator and run app
npm run android

# Or with logging
npm run android & adb logcat -s "ReactNative:V" "ADHD-CADDI:V" "AndroidRuntime:E"
```

### Run on Physical Device

```bash
# Development build (fastest, debuggable)
npm run install:android:dev

# Preview build (release-like, no signing required)
npm run install:android:preview

# Production build (requires release keystore)
npm run build:android:prod
```

## Android-First Features

These features are **Android-only** and will not work on web:

| Feature            | Android | Web     | Description                         |
| ------------------ | ------- | ------- | ----------------------------------- |
| Floating Overlay   | ✓       | ✗       | Quick-access bubble over other apps |
| Push Notifications | ✓       | ✗       | Native notification system          |
| Background Sync    | ✓       | ✗       | Sync when app is closed             |
| Biometric Lock     | ✓       | ✗       | Fingerprint/face unlock             |
| System Share       | ✓       | ✗       | Share to app from other apps        |
| Deep Links         | ✓       | Limited | Navigate from overlay to screens    |

## Web Development (Secondary)

Use web only for UI development and quick iteration.

```bash
# Local web dev server
npm run web

# Build for Firebase beta
npm run build:web
npm run deploy:firebase
```

## Project Structure

```
android/              # Native Android code (Java/Kotlin)
src/
  components/         # React components
  screens/           # Screen components
  services/          # Business logic, native bridges
  store/             # Zustand state management
  tutorial/          # Tutorial flow registry (new)
  navigation/        # Navigation configuration
docs/                # Documentation
```

## Documentation

- `docs/ANDROID_INTERNAL_BETA.md` - Internal tester guide
- `docs/FIREBASE_APP_DISTRIBUTION.md` - Distribution setup
- `docs/PRD.md` - Product requirements
- `docs/TECH_SPEC.md` - Technical specification
- `docs/ARCHITECTURE_RULES.md` - Architecture decisions

## Development Workflow

1. **Android-first development**: Build and test on Android emulator/device first
2. **Web for UI iteration**: Use web for quick UI changes
3. **Verify on Android**: Always verify features work on Android before committing
4. **Logcat monitoring**: Use `adb logcat` to monitor app behavior

## Testing

```bash
# Unit tests
npm test

# Android e2e tests (requires emulator)
npm run test:e2e:android

# Lint and type-check
npm run lint
npx tsc --noEmit
```

## Monitoring

```bash
# View React Native logs
adb logcat -s "ReactNative:V" "ReactNativeJS:V"

# View app-specific logs
adb logcat -s "ADHD-CADDI:V"

# View all logs with filtering
adb logcat | grep -i "adhdcaddi\|reactnative"
```

## License

MIT
