# Android-First Strategy Document

> **Effective Date**: March 2026  
> **Status**: Active  
> **Owner**: Engineering Team

## Overview

ADHD-CADDI is now an **Android-first** application. This document defines what that means and how it affects development, testing, and release processes.

## What Android-First Means

### 1. Android is the Primary Platform

- All features are designed and built for Android first
- Android receives full feature support and native integrations
- Web is maintained for development convenience and limited testing only
- iOS is not currently supported

### 2. Feature Parity Matrix

| Feature                   | Android | Web     | Notes                        |
| ------------------------- | ------- | ------- | ---------------------------- |
| **Core Features**         |         |         |                              |
| Ignite Timer              | ✓       | ✓       | Full support                 |
| Fog Cutter                | ✓       | ✓       | Full support                 |
| Pomodoro                  | ✓       | ✓       | Full support                 |
| Anchor                    | ✓       | ✓       | Full support                 |
| Check In                  | ✓       | ✓       | Full support                 |
| Brain Dump                | ✓       | ✓       | Full support                 |
| **Android-Only Features** |         |         |                              |
| Floating Overlay          | ✓       | ✗       | System-wide quick access     |
| Push Notifications        | ✓       | ✗       | Native notification system   |
| Biometric Lock            | ✓       | ✗       | Fingerprint/face unlock      |
| Background Sync           | ✓       | ✗       | Sync when app closed         |
| System Share              | ✓       | ✗       | Share to app from other apps |
| Deep Links                | ✓       | Limited | From overlay to screens      |
| **Storage**               |         |         |                              |
| SQLite (op-sqlite)        | ✓       | ✗       | Robust local storage         |
| AsyncStorage              | ✓       | ✓       | Fallback for web             |

### 3. Development Workflow

#### Android-First Development

1. **Build on Android first**: All new features start on Android
2. **Test on device/emulator**: Use `npm run android` for development
3. **Verify native integrations**: Test with actual Android APIs
4. **Then adapt to web**: Port to web only if it makes sense

#### Web for UI Iteration

1. **Quick UI changes**: Use `npm run web` for rapid iteration
2. **Component development**: Build components in web first
3. **Always verify on Android**: Final testing must be on Android

### 4. Testing Strategy

#### Android Testing (Primary)

- **Unit tests**: Jest for business logic
- **Integration tests**: Component testing with React Native Testing Library
- **E2E tests**: Detox for full user flows on Android
- **Device testing**: Physical devices and emulators
- **CI/CD**: GitHub Actions builds Android APKs

#### Web Testing (Secondary)

- **Unit tests**: Jest for shared logic
- **Manual testing**: UI development only
- **No E2E**: Web E2E tests are deprioritized

### 5. Release Process

#### Android Releases

1. **Internal Beta**: Firebase App Distribution
2. **Closed Beta**: Google Play Console closed testing
3. **Production**: Google Play Store

#### Web Releases

1. **Development**: Local development server
2. **Friend Testing**: Firebase Hosting limited deployment
3. **No Production**: Web is not a production release target

### 6. Documentation Updates

All documentation must reflect Android-first:

- `README.md` - Primary quick start is Android
- `docs/PRD.md` - Platform strategy section
- `docs/TECH_SPEC.md` - Android-first architecture
- `docs/ARCHITECTURE_RULES.md` - Platform-specific guidelines
- `docs/ANDROID_INTERNAL_BETA.md` - Tester guide
- `docs/FIREBASE_APP_DISTRIBUTION.md` - Distribution guide

### 7. Code Organization

```
src/
├── android-specific/     # Android-only code
│   ├── overlay/         # Floating overlay feature
│   ├── notifications/   # Push notifications
│   └── biometric/       # Biometric authentication
├── shared/              # Cross-platform code
│   ├── components/      # UI components
│   ├── screens/         # Screen components
│   └── services/        # Business logic
└── web-specific/        # Web-only code (minimal)
    └── stubs/           # Android feature stubs for web
```

### 8. Decision Framework

When adding a new feature, ask:

1. **Does this need native Android APIs?**

   - Yes → Android only
   - No → Consider both platforms

2. **Is this core to the ADHD-CADDI experience?**

   - Yes → Must work on Android
   - No → Can be Android-only

3. **Can web support this meaningfully?**
   - Yes → Build for both
   - No → Android only with web stub

### 9. Success Metrics

- **Android**: 100% feature availability
- **Web**: Development convenience only
- **CI/CD**: Android builds pass on every commit
- **Testing**: >80% coverage on Android-specific code

### 10. Migration Notes

The project has transitioned from cross-platform to Android-first:

- ✅ Tutorial system: Now supports Android onboarding
- ✅ Overlay: Android-only floating bubble
- ✅ Deep links: Android navigation from overlay
- ✅ Storage: SQLite on Android, AsyncStorage on web
- 🔄 In progress: Documentation updates
- 📋 Planned: Remove web-specific complexity

## Communication

- **Slack**: #android-first-announcements
- **Docs**: This document is the source of truth
- **Questions**: Tag @android-lead in PRs

## Appendix: Android-Only Features

These features will never work on web and should not be attempted:

1. **Floating Overlay**: Requires `SYSTEM_ALERT_WINDOW` permission
2. **Background Services**: Android foreground services
3. **Native Notifications**: `NotificationManager` system integration
4. **Biometric Auth**: `BiometricPrompt` API
5. **Hardware Integration**: Haptics, sensors, etc.

## Appendix: Web Limitations

When developing for web, know these limitations:

1. **No persistent storage**: Data may be cleared
2. **No background sync**: App must be active
3. **No system integration**: Cannot interact with other apps
4. **Online-only**: No offline support (intentionally disabled)

---

**Last Updated**: March 2026  
**Next Review**: June 2026
