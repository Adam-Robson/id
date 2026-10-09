import type { THEMES } from '../constants/theme';

export type Theme = (typeof THEMES)[number];

export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}
