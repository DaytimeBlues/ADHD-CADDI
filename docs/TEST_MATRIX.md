# ADHD-CADDI Test Matrix

> Current stance: the browser/web workflow is the primary verified path, and the shipped web app is web-first and online-first. Offline/PWA support is intentionally disabled; treat service-worker-driven offline behavior as out of scope unless a dedicated pass re-enables it.
>
> Integration note: Google Tasks and Todoist UI entry points ship in the Brain Dump flow, but live OAuth coverage is config-dependent. Authenticated browser coverage is opportunistic and only runs when a real Playwright storage state already exists.

## Page/Button Inventory

### Navigation Structure (from AppNavigator.tsx)

- **Tab Navigator**: HOME, FOCUS, TASKS, CALENDAR, CHAT
- **Stack Screens**: MAIN, FOG_CUTTER, POMODORO, ANCHOR, INBOX

### All Screens & Components

#### HomeScreen

- [ ] Page loads without crash
- [ ] Displays streak summary (STREAK.XXX format)
- [ ] Displays mode cards: ignite, fogcutter, pomodoro, anchor, checkin, cbtguide
- [ ] Bottom tab navigation visible (HOME, FOCUS, TASKS, CALENDAR)
- [ ] System status badge (SYS.ONLINE)
- [ ] Weekly metrics display
- [ ] Capture bubble visible
- [ ] Navigate to Fog Cutter from card
- [ ] Navigate to all mode screens

#### IgniteScreen (FOCUS tab)

- [ ] IGNITE_PROTOCOL header visible
- [ ] Timer display functional
- [ ] Start/pause/reset controls
- [ ] Brown noise toggle
- [ ] Task input field
- [ ] Complete session flow

#### TasksScreen (TASKS tab)

- [ ] TASKS header visible
- [ ] NEBULA QUEUE subtitle visible
- [ ] Replay Guide button visible
- [ ] Task list displays
- [ ] Add new task
- [ ] Toggle task completion
- [ ] Delete task
- [ ] Filter tabs (ALL, ACTIVE, DONE)
- [ ] Priority badges display
- [ ] Stats dashboard (URGENT, ACTIVE, DONE)
- [ ] Sync button (placeholder for integrations)
- [ ] BRAIN DUMP button opens the separate Brain Dump screen

#### BrainDumpScreen (separate route opened from TasksScreen)

- [ ] BRAIN_DUMP header visible
- [ ] Replay Guide button visible
- [ ] Text input for new items
- [ ] Add item via Enter key
- [ ] Voice recording toggle
- [ ] AI Sort button
- [ ] Clear all button
- [ ] Delete individual items
- [ ] Items persist across reload
- [ ] Items persist across tab navigation
- [ ] Google Tasks connect button visible
- [ ] Todoist connect button visible
- [ ] Integration status indicators visible

#### CalendarScreen

- [ ] CALENDAR header visible
- [ ] Monthly view renders
- [ ] Navigation between months
- [ ] Event display

#### ChatScreen

- [ ] CADDI_ASSISTANT header visible
- [ ] Replay Guide button visible
- [ ] Message input field
- [ ] Send button
- [ ] Message history display
- [ ] Mock API response handling
- [ ] Error handling for failed API

#### FogCutterScreen

- [ ] FOG_CUTTER header visible
- [ ] Replay Guide button visible
- [ ] Task input field
- [ ] Micro-step input
- [ ] Add micro-step button
- [ ] EXECUTE_SAVE button
- [ ] Display saved tasks
- [ ] ACTIVE_OPERATIONS display after save

#### PomodoroScreen

- [ ] Replay Guide button visible
- [ ] START TIMER button
- [ ] PAUSE button (after start)
- [ ] Timer display decrements
- [ ] Phase transition to REST
- [ ] Timer persists across reload
- [ ] Timer continues after tab switch

#### AnchorScreen

- [ ] BREATHING EXERCISES header
- [ ] Replay Guide button visible
- [ ] Pattern selection (4-7-8, Box, Energize)
- [ ] BREATHE IN animation
- [ ] HOLD animation
- [ ] Session completion

#### CheckInScreen

- [ ] HOW ARE YOU FEELING RIGHT NOW? header
- [ ] Replay Guide button visible
- [ ] Mood selection (1-5 options)
- [ ] Energy selection (1-5 options)
- [ ] RECOMMENDED FOR YOU display
- [ ] Recommendation action button
- [ ] Literary vignettes display

#### CBTGuideScreen

- [ ] EVIDENCE-BASED STRATEGIES header
- [ ] Strategy content display
- [ ] Navigation between strategies

#### InboxScreen

- [ ] INBOX header visible
- [ ] Replay Guide button visible
- [ ] Unreviewed items list
- [ ] Promote to task button
- [ ] Discard button
- [ ] Filter tabs (unreviewed, all, promoted)
- [ ] Empty state display

### Capture Bubble Features

- [ ] Bubble visible on home screen
- [ ] Badge count when unreviewed items exist
- [ ] Tap opens drawer
- [ ] All 5 capture modes visible (voice, text, photo, paste, meeting)
- [ ] Text capture in ≤3 interactions
- [ ] Meeting mode accepts multi-line
- [ ] Cancel closes drawer without saving
- [ ] Bubble hidden on fullscreen modals
- [ ] Bubble hidden while guided tutorial overlays are visible
- [ ] Bubble hidden while the Home replay-guide menu is visible

### Guided Tutorial Features

- [ ] Guided tutorials setting visible in Diagnostics
- [ ] Guided tutorials can be disabled globally
- [ ] Tutorial progress can be reset from Diagnostics
- [ ] Brain Dump guide auto-starts on first visit
- [ ] Tasks guide is replay-only by default
- [ ] Chat guide is replay-only by default
- [ ] Inbox guide is replay-only by default
- [ ] Home replay-guide menu lists supported screens
- [ ] Replay Guide launches the expected flow
- [ ] Skipping a guide dismisses it cleanly
- [ ] Completing a guide prevents auto-start on the same flow

### Integration Features (Config-dependent)

#### Google OAuth

- [ ] Connect Google button visible in task pages
- [ ] OAuth flow initiates when Google client IDs are configured
- [ ] Success callback handled
- [ ] Token stored securely
- [ ] User email displayed after connection
- [ ] Disconnect option
- [ ] Token refresh on expiry
- [ ] Error states: denied, network, timeout

#### Todoist Integration

- [ ] Connect Todoist button visible
- [ ] OAuth flow initiates
- [ ] Project selection
- [ ] Sync tasks to Todoist
- [ ] Two-way sync status
- [ ] Disconnect option
- [ ] Error handling
- [ ] Graceful degraded state when Todoist is not connected

## Test Tags

## Android APK-Ready Acceptance

- [ ] Clean install launch
- [ ] Returning-user local data launch
- [ ] No-signal launch degrades gracefully without PWA assumptions
- [ ] Tutorial visibility
- [ ] Capture entry
- [ ] Tab navigation survivability
- [ ] Denied optional permissions do not crash launch
- [ ] Disconnected optional integrations do not block launch

### @critical (must pass for release)

- All navigation flows
- Task CRUD operations
- Timer functionality
- Data persistence
- Anonymous auth entry path
- Disconnected optional integrations do not block launch

### @smoke (quick validation)

- Page loads
- Tab navigation
- Basic CRUD
- Timer start/stop

### @edge (error/edge cases)

- Local-only behavior while the app is disconnected
- API failures (429, 500, timeout)
- Corrupted storage
- Rapid interactions
- Background/foreground transitions

### @oauth (Google integration)

- Sign-in flow when client IDs are configured
- Token management
- Refresh logic
- Error states

### @todoist (Todoist integration)

- Connection flow
- Task export
- Sync status
- Error handling
- Disconnected/degraded fallback state

### @android (native specific)

- Navigation
- Permissions
- Recording
- Overlay
- OAuth native flow

## Browser Coverage

### Desktop

- [ ] Chromium (primary)
- [ ] Firefox
- [ ] WebKit (Safari)

### Mobile Viewports

- [ ] iPhone SE (375x667)
- [ ] iPhone 14 (390x844)
- [ ] Pixel 7 (412x915)
- [ ] iPad Mini (768x1024)

## Error Scenarios

### Network

- [ ] Local features degrade gracefully while disconnected
- [ ] Slow 3G simulation
- [ ] API timeout (30s+)
- [ ] API 429 rate limit
- [ ] API 500 server error
- [ ] API 503 unavailable
- [ ] Intermittent connectivity

### Storage

- [ ] LocalStorage full
- [ ] Corrupted storage data
- [ ] Storage quota exceeded
- [ ] Private browsing mode

### Authentication

- [ ] OAuth popup blocked
- [ ] OAuth denied by user
- [ ] Token expired mid-session
- [ ] Token revoked externally
- [ ] Network failure during OAuth

## Accessibility

- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Screen reader labels
- [ ] Color contrast
- [ ] Touch target sizes

## Performance

- [ ] First paint < 3s
- [ ] Interactive < 5s
- [ ] No layout shift on load
- [ ] Smooth animations (60fps)
