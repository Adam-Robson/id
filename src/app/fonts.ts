import { EB_Garamond, JetBrains_Mono, Karla } from 'next/font/google';

export const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-display-face',
  style: ['normal', 'italic'],
});

export const karla = Karla({
  subsets: ['latin'],
  variable: '--font-body-face',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-face',
});
