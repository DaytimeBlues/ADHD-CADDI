const WEB_ICON_GLYPHS: Record<string, string> = {
  anchor: '⚓',
  brain: '◉',
  calendar: '□',
  'chart-bar': '▥',
  check: '✓',
  'check-circle': '✓',
  'check-circle-outline': '✓',
  close: '×',
  fire: '♦',
  google: 'G',
  home: '⌂',
  'message-text-outline': '✉',
  microphone: '◌',
  'play-circle': '▷',
  'sort-variant': '⇅',
  'text-box-outline': '☰',
  'timer-sand': '⌛',
  'weather-windy': '≋',
};

export const getWebIconGlyph = (name: string): string => {
  return WEB_ICON_GLYPHS[name] ?? '•';
};
