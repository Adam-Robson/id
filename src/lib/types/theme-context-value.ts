import type { Theme } from '@@/types/theme';
import type { ResolvedTheme } from '@@/types/resolved-theme';

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}
