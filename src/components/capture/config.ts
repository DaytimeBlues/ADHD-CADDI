/**
 * Capture configuration and constants
 */

import type { CaptureSource } from '../../services/CaptureService';

export type DrawerMode = CaptureSource | 'task';

export const MODES: Array<{ id: DrawerMode; icon: string; label: string }> = [
  { id: 'task', icon: 'T', label: 'TASK' },
  { id: 'voice', icon: 'V', label: 'VOICE' },
  { id: 'text', icon: 'TXT', label: 'TEXT' },
  { id: 'photo', icon: 'P', label: 'PHOTO' },
  { id: 'paste', icon: 'PS', label: 'PASTE' },
  { id: 'meeting', icon: 'M', label: 'MEETING' },
  { id: 'checkin', icon: 'CI', label: 'CHECK-IN' },
];

export const MODE_COPY: Record<
  DrawerMode,
  { title: string; description: string; outcome: string }
> = {
  task: {
    title: 'Create a task now',
    description:
      'Use this when you already know the action and do not need triage.',
    outcome: 'Saves directly to your active task list.',
  },
  voice: {
    title: 'Talk it out',
    description:
      'Record first, review the captured note, then send it to the inbox.',
    outcome: 'Best for fast capture when typing would slow you down.',
  },
  text: {
    title: 'Type a quick note',
    description:
      'Good for thoughts, reminders, and rough tasks that need sorting later.',
    outcome: 'Saves to the inbox for review.',
  },
  photo: {
    title: 'Save a visual reference',
    description:
      'Useful for whiteboards, receipts, notes, or anything easier to snap than type.',
    outcome: 'Stores the image with an optional caption in the inbox.',
  },
  paste: {
    title: 'Drop copied text',
    description:
      'Ideal for messages, links, snippets, or notes you grabbed from somewhere else.',
    outcome: 'Lets you trim the text before saving it to the inbox.',
  },
  meeting: {
    title: 'Capture meeting notes',
    description:
      'Starts with a simple template so you can focus on listening, not formatting.',
    outcome: 'Saves structured notes to the inbox.',
  },
  checkin: {
    title: 'Reset your focus',
    description:
      'A quick prompt to notice what you are doing and what you meant to be doing.',
    outcome: 'Logs a check-in note to the inbox.',
  },
};

export const MEETING_TEMPLATE = (now: Date): string => {
  const date = now.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const time = now.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `Meeting: ${date} at ${time}\n\nAttendees:\n\nNotes:\n\nAction items:\n`;
};

// Cosmic colors
export const C = {
  violet: '#8B5CF6',
  teal: '#2DD4BF',
  rose: '#FB7185',
  gold: '#F6C177',
  starlight: '#EEF2FF',
  mist: '#B9C2D9',
  mutedText: 'rgba(238,242,255,0.56)',
  surface: 'rgba(18, 26, 52, 0.96)',
  border: 'rgba(185, 194, 217, 0.12)',
  activeModeTab: 'rgba(139, 92, 246, 0.15)',
} as const;
