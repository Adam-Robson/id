import type { Theme } from '@/lib//types/theme';
import { THEMES } from '@/lib/constants/theme';
/**
 * Parses the given theme value and returns a valid Theme.
 * @param value The theme value to parse.
 * @returns The parsed Theme, or 'system' if the value is invalid.
 */
export function parseTheme(value: string | undefined | null): Theme {
  return value && (THEMES as readonly string[]).includes(value)
    ? (value as Theme)
    : 'system';
}
