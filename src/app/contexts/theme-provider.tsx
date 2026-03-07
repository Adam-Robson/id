'use client';
import type { Theme } from '@@/types/theme';
import type { ResolvedTheme } from '@@/types/resolved-theme';
import type { ThemeContextValue } from '@@/types/theme-context-value';
import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';

const ThemeContext = createContext<ThemeContextValue | null>(null);

// useLayoutEffect on client (no flash), useEffect on server (SSR no-op)
const useIsomorphibrickoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function ThemeProvider({
  children,
  initialTheme = 'system',
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  useIsomorphibrickoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolve = () => {
      const resolved: ResolvedTheme =
        theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme;
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    };

    resolve();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', resolve);
      return () => mediaQuery.removeEventListener('change', resolve);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.cookie = `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
