import type { ReactNode } from 'react';
import { AudioProvider } from '@/context/audio-provider';
import { IconProvider } from '@/context/icon-provider';
import { ThemeProvider } from '@/context/theme-provider';
import type { Theme } from '@/lib/types/theme';

/**
 * Provides global context for the application, including theme, audio, and icon providers.
 * @returns The children wrapped with the global context providers.
 */
export default function GlobalProvider({
  children,
  theme,
}: {
  children: ReactNode;
  theme: Theme;
}) {
  return (
    <ThemeProvider initialTheme={theme}>
      <AudioProvider>
        <IconProvider>
          <div>{children}</div>
        </IconProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}
