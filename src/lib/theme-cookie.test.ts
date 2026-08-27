import { describe, expect, it } from 'vitest';
import { parseTheme } from '@/lib/theme-cookie';

describe('parseTheme', () => {
  it('passes through each valid theme', () => {
    expect(parseTheme('light')).toBe('light');
    expect(parseTheme('dark')).toBe('dark');
    expect(parseTheme('system')).toBe('system');
  });

  it('falls back to system for a missing value', () => {
    expect(parseTheme(undefined)).toBe('system');
    expect(parseTheme(null)).toBe('system');
    expect(parseTheme('')).toBe('system');
  });

  it('falls back to system for an invalid value', () => {
    expect(parseTheme('banana')).toBe('system');
    expect(parseTheme('Dark')).toBe('system');
  });
});
