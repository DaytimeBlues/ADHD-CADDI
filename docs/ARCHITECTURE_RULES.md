# Engineering Architecture Rules

This document defines the architectural standards for the ADHD-CADDI codebase. These rules are enforced through tooling and code review.

## File Size Limits

- **Soft cap**: 350 lines for interactive logic files
- **Hard cap**: 450 lines for interactive logic files
- **Exceptions**: Static data files, style tokens, and generated code may exceed these limits with explicit documentation

Files exceeding the hard cap will fail CI checks.

## Component Architecture

### Screens

- Screens should orchestrate hooks and components
- Screens should NOT contain heavy domain logic
- Target: Under 250 lines for screen components

### Services

- Each service owns exactly one concern
- Services should be under 350 lines
- Complex workflows should be split into sub-services

### Platform-Specific Code

- Platform variants (`.web.ts`, `.native.ts`) should share a common core
- Do not duplicate entire classes between platforms
- Platform files should be thin adapters (<150 lines)

### Hooks

- Hooks may coordinate UI state
- Side-effectful domain workflows should live in services or clearly-named controllers
- Hooks over 150 lines should be split by responsibility

## Code Organization

### Directory Structure

```
src/
├── screens/          # Feature screens (orchestration only)
├── components/       # Reusable UI components
│   └── [feature]/    # Feature-specific components
├── services/         # Business logic and external integrations
│   └── [feature]/    # Feature-specific services
├── hooks/            # Shared React hooks
├── store/            # State management
├── theme/            # Design tokens and theming
├── ui/               # Cosmic UI primitives
├── config/           # Configuration
├── utils/            # Pure utility functions
└── types/            # Shared TypeScript types
```

### Naming Conventions

- Services: `[Name]Service.ts` or `[Name]ServiceClass` + `export const [name]Service`
- Hooks: `use[Name].ts`
- Screens: `[Name]Screen.tsx`
- Components: `[Name].tsx`
- Platform-specific: `[Name].web.ts`, `[Name].native.ts`

## State Management

### Storage Access

- Use feature-level storage gateways, not direct StorageService calls
- Storage keys should be centralized per feature
- Never scatter raw key/value semantics across feature files

### Lifecycle Ownership

- App-wide background/foreground concerns belong in AppLifecycleService
- Screen-local concerns stay in hooks
- No duplicate ownership of the same subsystem

## Testing Requirements

### Unit Tests

- Pure logic functions must have unit tests
- Service boundaries should be testable with mocks
- New seams created during refactoring require tests

### Coverage Thresholds

- Branches: 35%
- Functions: 40%
- Lines: 45%
- Statements: 45%

## Quality Gates

All changes must pass:

1. ESLint (`npm run lint`)
2. TypeScript (`npx tsc --noEmit`)
3. Unit tests (`npm test`)
4. File size checks (`npm run quality:report`)
5. Admin checks (`npm run admin:check`)

Run `npm run verify` to execute all gates locally.

## CI/CD Standards

- One reusable workflow per concern
- No duplication of setup/install/test/build steps
- Deployment-specific behavior isolated to deployment workflows
- All workflows must work on both Ubuntu and Windows (where applicable)

## Documentation Requirements

- Architecture decisions must be documented
- Complex workflows require inline comments
- Public APIs must have JSDoc comments
- Platform-specific behavior must be documented

## Pre-Commit Hooks

Hooks run automatically on commit:

- ESLint with auto-fix
- Prettier formatting
- Related unit tests

If hooks fail, fix the issues before committing. Do not use `--no-verify` except in exceptional circumstances.

## Migration Guidelines

When refactoring:

1. Preserve external behavior
2. Keep imports stable when possible
3. Add tests for new seams
4. Run typecheck and tests before moving on
5. Use compatibility facades to avoid large import churn
6. Move pure logic first, then UI subcomponents, then orchestration

## Violations

Current known violations (to be addressed):

- CaptureDrawer.tsx (1,306 lines) - Phase 1
- CalendarScreen.tsx (810 lines) - Phase 1
- GoogleTasksSyncService.ts (654 lines) - Phase 1
- OAuthService.ts + OAuthService.web.ts (958 combined) - Phase 1
- FogCutterScreen.tsx (743 lines) - Phase 2
- IgniteScreen.tsx (604 lines) - Phase 2
- CheckInScreen.tsx (593 lines) - Phase 2
- TasksScreen.tsx (591 lines) - Phase 2
- BrainDumpScreen.tsx (456 lines) - Phase 2
- HomeScreen.tsx (468 lines) - Phase 2
