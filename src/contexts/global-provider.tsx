import { cookies } from "next/headers";
import type { ReactNode } from "react";
import MiniPlayer from "@/app/components/mini-player";
import { AudioProvider } from "@/contexts/audio-provider";
import { IconProvider } from "@/contexts/icon-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import type { Theme } from "@/types/theme";

export default async function GlobalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();

  const theme = (cookieStore.get("theme")?.value ?? "system") as Theme;
  return (
    <ThemeProvider initialTheme={theme}>
      <IconProvider value={{ size: 24, weight: "regular", className: "icon" }}>
        <AudioProvider>
          {children}
          <MiniPlayer />
        </AudioProvider>
      </IconProvider>
    </ThemeProvider>
  );
}
