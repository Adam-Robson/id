import { describe, expect, it } from 'vitest';
import { resolveTheme } from '@/contexts/theme-provider';

describe('resolveTheme', () => {
  it('resolves an explicit theme regardless of OS preference', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('resolves system to the OS preference', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });
});
