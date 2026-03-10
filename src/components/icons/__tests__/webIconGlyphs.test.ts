import { getWebIconGlyph } from '../webIconGlyphs';

describe('getWebIconGlyph', () => {
  it('returns the configured glyph for a known icon name', () => {
    expect(getWebIconGlyph('home')).toBe('⌂');
    expect(getWebIconGlyph('google')).toBe('G');
    expect(getWebIconGlyph('check-circle')).toBe('✓');
  });

  it('falls back to a generic marker for unknown icon names', () => {
    expect(getWebIconGlyph('not-a-real-icon')).toBe('•');
  });
});
