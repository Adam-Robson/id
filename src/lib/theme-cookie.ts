import { THEMES, type Theme } from '@/types/theme';

export const THEME_COOKIE_NAME = 'theme';

export function parseTheme(value: string | undefined | null): Theme {
  return value && (THEMES as readonly string[]).includes(value)
    ? (value as Theme)
    : 'system';
}
