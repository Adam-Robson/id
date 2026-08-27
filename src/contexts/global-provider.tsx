import type { ReactNode } from 'react';
import MiniPlayer from '@/app/components/mini-player';
import { AudioProvider } from '@/contexts/audio-provider';
import { IconProvider } from '@/contexts/icon-provider';
import { ThemeProvider } from '@/contexts/theme-provider';
import type { Theme } from '@/types/theme';

export default function GlobalProvider({
  children,
  theme,
}: {
  children: ReactNode;
  theme: Theme;
}) {
  return (
    <ThemeProvider initialTheme={theme}>
      <IconProvider value={{ size: 24, weight: 'regular', className: 'icon' }}>
        <AudioProvider>
          {children}
          <MiniPlayer />
        </AudioProvider>
      </IconProvider>
    </ThemeProvider>
  );
}
