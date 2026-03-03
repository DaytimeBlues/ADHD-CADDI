# Capture Bubble v1 — Design & Implementation Spec

> Branch: `ui-ux-redesign` | Theme: Cosmic | Last updated: 2026-02-20

---

## Overview

The **Capture Bubble** is a persistent in-app Floating Action Button (FAB+) that lives at the bottom-right of every screen. Tapping it opens a **Capture Drawer** (bottom sheet) with multiple input modes. Every captured item lands in an **Inbox** triage queue before being promoted to a task, note, or session.

This is v1 — no system overlays (Android overlay = v2).

---

## 1. States

| State          | Visual                        | Badge                     | Interaction                              |
| -------------- | ----------------------------- | ------------------------- | ---------------------------------------- |
| `idle`         | Violet FAB, soft glow         | None                      | Tap → opens drawer                       |
| `recording`    | Pulsing teal FAB, strong glow | Mic icon animates         | Tap → stops recording                    |
| `processing`   | Spinning loader FAB           | None                      | Non-interactive                          |
| `needs-review` | Violet FAB + red badge        | Count of unreviewed items | Tap → opens drawer (Inbox tab active)    |
| `failed`       | Rose FAB, 1× shake            | Error icon 3s             | Tap → opens drawer with error toast      |
| `offline`      | Muted FAB, no glow            | Cloud-off icon            | Tap → opens drawer, shows offline banner |

---

## 2. Capture Drawer

Bottom sheet that slides up over content. Dismissible by swipe-down or tapping backdrop.

### Header

- Title: "CAPTURE" (caps, mist text)
- Close button (×) top-right
- If `needs-review` state: shows "INBOX (N)" tab highlighted

### Capture Modes (tab row)

| Mode      | Icon      | Label   | Behavior                                                         |
| --------- | --------- | ------- | ---------------------------------------------------------------- |
| `voice`   | mic       | VOICE   | Starts/stops recording via RecordingService                      |
| `text`    | keyboard  | TEXT    | Multiline text input, auto-focus                                 |
| `photo`   | camera    | PHOTO   | Camera + gallery picker (v1: web file input, native ImagePicker) |
| `paste`   | clipboard | PASTE   | Auto-pastes clipboard content into text field                    |
| `meeting` | people    | MEETING | Pre-fills template: "Meeting: [date/time]\n\nNotes:"             |

### Capture Flow (per mode)

```
[Mode selected] → [User inputs] → [Confirm ▶ or Enter]
  → CaptureService.save(item)
  → item lands in Inbox with status: 'unreviewed'
  → drawer closes
  → bubble state → needs-review (badge++)
```

### Inline States (inside drawer)

- **Recording active**: full-width waveform / pulsing bar, elapsed time, STOP button
- **Processing** (after stop): spinner + "Transcribing…" text
- **Transcription ready**: text shown in editable field, confirm or discard
- **Error**: inline rose-colored error message + retry button
- **Offline**: amber banner "Offline — will sync when reconnected"

---

## 3. Inbox Screen

New screen (`InboxScreen`) accessible via:

- Capture Bubble (needs-review state)
- Navigation tab (future) or home card

### Layout

```
INBOX  [N unreviewed]
────────────────────────────
[Filter: ALL | VOICE | TEXT | PHOTO | MEETING]

[CaptureItem]
  ├── Source badge (VOICE / TEXT / PHOTO / PASTE / MEETING)
  ├── Timestamp (relative: "2m ago")
  ├── Preview (1–2 lines, truncated)
  ├── [→ TASK]  [→ NOTE]  [🗑 DISCARD]
  └── Expand to see full content + edit

[Empty state: "All clear — nothing to review"]
```

### Inbox Item Data Model

```ts
interface CaptureItem {
  id: string; // uuid
  source: CaptureSource; // 'voice' | 'text' | 'photo' | 'paste' | 'meeting'
  status: CaptureStatus; // 'unreviewed' | 'promoted' | 'discarded'
  raw: string; // original input (transcript text, user text, etc.)
  attachmentUri?: string; // photo URI
  createdAt: number; // Date.now()
  promotedTo?: "task" | "note"; // set on promotion
  promotedAt?: number;
  transcript?: string; // for voice mode, AI transcript
  syncError?: string; // if offline save failed
}

type CaptureSource = "voice" | "text" | "photo" | "paste" | "meeting";
type CaptureStatus = "unreviewed" | "promoted" | "discarded";
```

---

## 4. CaptureService

New service: `src/services/CaptureService.ts`

```ts
interface CaptureService {
  // Save a new capture item to Inbox
  save(
    item: Omit<CaptureItem, "id" | "createdAt" | "status">,
  ): Promise<CaptureItem>;

  // Get all capture items, optionally filtered by status
  getAll(filter?: { status?: CaptureStatus }): Promise<CaptureItem[]>;

  // Get unreviewed count (for badge)
  getUnreviewedCount(): Promise<number>;

  // Promote item to task or note
  promote(id: string, to: "task" | "note"): Promise<void>;

  // Discard item
  discard(id: string): Promise<void>;

  // Subscribe to changes (for badge reactivity)
  subscribe(callback: (count: number) => void): () => void;
}
```

**Storage key**: `STORAGE_KEYS.captureInbox` → stored as `CaptureItem[]` JSON

---

## 5. New Files to Create

```
src/
├── components/
│   └── capture/
│       ├── CaptureBubble.tsx      # FAB + state management
│       ├── CaptureDrawer.tsx      # Bottom sheet + mode tabs
│       ├── CaptureVoiceMode.tsx   # Voice recording UI
│       ├── CaptureTextMode.tsx    # Text input UI
│       ├── CapturePhotoMode.tsx   # Photo capture UI
│       ├── CapturePasteMode.tsx   # Clipboard paste UI
│       ├── CaptureMeetingMode.tsx # Meeting template UI
│       └── index.ts               # Barrel export
├── screens/
│   └── InboxScreen.tsx            # Inbox/triage screen
├── services/
│   └── CaptureService.ts          # Capture CRUD + badge
└── ui/cosmic/
    └── BottomSheet.tsx            # Reusable bottom sheet primitive
```

---

## 6. Navigation Changes

Add `INBOX` route:

```ts
// routes.ts addition
INBOX: 'Inbox' as const,
```

Add to `AppNavigator.tsx` as a modal stack screen (like FOG_CUTTER).

---

## 7. AppNavigator Integration

`CaptureBubble` must render **outside** the tab navigator but **inside** the root stack, so it appears on all tab screens. Use a wrapper component in `AppNavigatorContent`:

```tsx
const AppNavigatorContent = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.MAIN} component={TabNavigatorWithBubble} />
    {/* modals */}
  </Stack.Navigator>
);

const TabNavigatorWithBubble = () => (
  <View style={{ flex: 1 }}>
    <TabNavigator />
    <CaptureBubble /> {/* Rendered above all tabs */}
  </View>
);
```

---

## 8. Error Handling

| Error                       | Handling                                                     |
| --------------------------- | ------------------------------------------------------------ |
| Mic permission denied       | Show inline prompt in Voice mode with "Grant Permission" CTA |
| Recording start fails       | `failed` bubble state + drawer error message                 |
| Recording stop/unload fails | Show error in drawer, keep raw audio URI if available        |
| Transcription fails         | Show transcript error + allow manual text fallback           |
| Storage full / write error  | Rose toast "Capture failed — storage error"                  |
| Offline (no connectivity)   | Amber banner, save to local queue, sync on reconnect         |
| Photo picker cancelled      | Silent dismissal (no error)                                  |

---

## 9. ADHD UX Principles

- **One primary action per drawer state** — never show competing CTAs
- **Glow = state feedback** — recording uses teal, error uses rose, processing uses violet pulse
- **Auto-dismiss on success** — drawer closes automatically after confirmed capture
- **Badge count is prominent** — ADHD users need external working memory
- **No data loss** — items saved immediately to storage before processing
- **Offline-first** — all captures work offline; sync is background
- **Escape hatches** — every state has a Cancel/Close path

---

## 10. Test IDs (for E2E)

| Element          | testID                    |
| ---------------- | ------------------------- |
| Capture FAB      | `capture-bubble`          |
| Bubble badge     | `capture-bubble-badge`    |
| Capture drawer   | `capture-drawer`          |
| Voice mode tab   | `capture-mode-voice`      |
| Text mode tab    | `capture-mode-text`       |
| Photo mode tab   | `capture-mode-photo`      |
| Paste mode tab   | `capture-mode-paste`      |
| Meeting mode tab | `capture-mode-meeting`    |
| Text input       | `capture-text-input`      |
| Confirm button   | `capture-confirm`         |
| Record toggle    | `capture-record-toggle`   |
| Stop recording   | `capture-stop-recording`  |
| Inbox screen     | `inbox-screen`            |
| Inbox item (nth) | `inbox-item-{id}`         |
| Promote to task  | `inbox-promote-task-{id}` |
| Promote to note  | `inbox-promote-note-{id}` |
| Discard item     | `inbox-discard-{id}`      |

---

## 11. Acceptance Criteria

- [ ] Bubble is visible on Home, Focus, Tasks, Calendar, Chat tabs
- [ ] Bubble does NOT appear on fullscreen modal screens (Pomodoro, Anchor, FogCutter)
- [ ] All 5 capture modes accept input and save to Inbox
- [ ] Voice mode integrates with existing `RecordingService`
- [ ] Badge count increments on each capture, decrements on promote/discard
- [ ] Offline captures queue and display amber banner
- [ ] Permission denial shows inline recovery path
- [ ] `lsp_diagnostics` clean, `npx tsc --noEmit` passes
- [ ] Unit tests cover `CaptureService` CRUD and badge logic
- [ ] E2E tests cover teacher persona capture flows (voice, text, paste, meeting)
