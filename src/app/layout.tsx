import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Barlow, Changa_One } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import type { Theme } from '@/types/theme';

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "LE FOG",
  description: "Website for LE FOG",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = (cookieStore.get("theme")?.value ?? "system") as Theme;

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body
        className={`${barlow.variable} antialiased`}
      >
        <ThemeProvider initialTheme={theme}>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
