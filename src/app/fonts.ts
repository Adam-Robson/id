import { Barlow, Crimson_Pro } from 'next/font/google';

export const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["200", "300", "400", "600"],
  style: ["normal", "italic"],
});
