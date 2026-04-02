import type { ResolvedTheme } from "@/types/resolved-theme";
import type { Theme } from "@/types/theme";

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}
