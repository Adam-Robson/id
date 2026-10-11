import { DM_Mono, DM_Sans, Fraunces } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display-face',
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body-face',
});

export const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono-face',
  weight: ['400', '500'],
});
