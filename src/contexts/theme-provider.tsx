"use client";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import type { ResolvedTheme } from "@/types/resolved-theme";
import type { Theme } from "@/types/theme";
import type { ThemeContextValue } from "@/types/theme-context-value";

const ThemeContext = createContext<ThemeContextValue | null>(null);

// useLayoutEffect on client (no flash), useEffect on server (SSR no-op)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function getInitialResolvedTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
  initialTheme = "system",
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    getInitialResolvedTheme(initialTheme),
  );

  useIsomorphicLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const resolve = () => {
      const resolved: ResolvedTheme =
        theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle("dark", resolved === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
    };

    resolve();

    if (theme === "system") {
      mediaQuery.addEventListener("change", resolve);
      return () => mediaQuery.removeEventListener("change", resolve);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if ("cookieStore" in window && window.cookieStore) {
      window.cookieStore.set({
        name: "theme",
        value: newTheme,
        path: "/",
        expires: Date.now() + 60 * 60 * 24 * 365 * 1000,
        sameSite: "lax",
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
