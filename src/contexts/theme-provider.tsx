'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { THEME_COOKIE_NAME } from '@/lib/theme-cookie';
import type { ResolvedTheme } from '@/types/resolved-theme';
import type { Theme } from '@/types/theme';
import type { ThemeContextValue } from '@/types/theme-context-value';

const ThemeContext = createContext<ThemeContextValue | null>(null);

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// useLayoutEffect on client (no flash), useEffect on server (SSR no-op)
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function resolveTheme(
  theme: Theme,
  prefersDark: boolean,
): ResolvedTheme {
  return theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
}

// Must match SSR output exactly — the layout effect below resolves the
// real value (matchMedia) before first paint, so no window reads here.
function getInitialResolvedTheme(theme: Theme): ResolvedTheme {
  return resolveTheme(theme, false);
}

function writeThemeCookie(value: Theme) {
  if ('cookieStore' in window && window.cookieStore) {
    window.cookieStore.set({
      name: THEME_COOKIE_NAME,
      value,
      path: '/',
      expires: Date.now() + ONE_YEAR_SECONDS * 1000,
      sameSite: 'lax',
    });
  } else {
    // Safari and Firefox don't implement the Cookie Store API — this is the fallback.
    const secure = location.protocol === 'https:' ? '; secure' : '';
    // biome-ignore lint/suspicious/noDocumentCookie: cookieStore is unavailable in this branch
    document.cookie = `${THEME_COOKIE_NAME}=${value}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax${secure}`;
  }
}

export function ThemeProvider({
  children,
  initialTheme = 'system',
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    getInitialResolvedTheme(initialTheme),
  );

  useIsomorphicLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolve = () => {
      const resolved = resolveTheme(theme, mediaQuery.matches);
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
      document.documentElement.classList.toggle('light', theme === 'light');
    };

    resolve();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', resolve);
      return () => mediaQuery.removeEventListener('change', resolve);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    writeThemeCookie(newTheme);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
