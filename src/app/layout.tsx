import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Barlow } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "./contexts/theme-provider";
import { AudioProvider } from "./contexts/audio-provider";
import type { Theme } from '@@/types/theme';

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#333333ff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  applicationName: "LE FOG",
  title: {
    default: "LE FOG",
    template: "%s — LE FOG",
  },
  description: "Website for LE FOG; Portland, Oregon, US",
  generator: "none",
  referrer: "no-referrer",

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  appleWebApp: {
    title: "LE FOG",
    capable: true,
    statusBarStyle: "black",
  },

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicon-196x196.png", sizes: "196x196", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon-57x57.png", sizes: "57x57" },
      { url: "/apple-touch-icon-60x60.png", sizes: "60x60" },
      { url: "/apple-touch-icon-72x72.png", sizes: "72x72" },
      { url: "/apple-touch-icon-76x76.png", sizes: "76x76" },
      { url: "/apple-touch-icon-114x114.png", sizes: "114x114" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120" },
      { url: "/apple-touch-icon-144x144.png", sizes: "144x144" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152" },
    ],
  },

  alternates: {
    canonical: "https://lefog.me/",
  },

  other: {
    // Geo tags
    icbm: "45.5152, -122.6784",
    "geo.position": "45.5152;-122.6784",
    "geo.region": "US-OR",
    "geo.placename": "Portland, Oregon",
    // Content classification
    subject: "LE FOG",
    rating: "general",
    // MS Application tiles
    "msapplication-TileColor": "#333333ff",
    "msapplication-square70x70logo": "/mstile-70x70.png",
    "msapplication-TileImage": "/mstile-144x144.png",
    "msapplication-square150x150logo": "/mstile-150x150.png",
    "msapplication-wide310x150logo": "/mstile-310x150.png",
    "msapplication-square310x310logo": "/mstile-310x310.png",
  },
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
      <head>
        {/* DNS prefetch control — not in Metadata API, must be inline */}
        <meta httpEquiv="x-dns-prefetch-control" content="off" />
        <link rel="dns-prefetch" href="//lefog.me/" />
        <link rel="preconnect" href="https://lefog.me/" />
      </head>
      <body className={`${barlow.variable} antialiased`}>
        <ThemeProvider initialTheme={theme}>
          <AudioProvider>
            {children}
          </AudioProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
