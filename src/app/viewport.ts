import type { Viewport } from 'next';
import { THEME_COLOUR } from '@/lib/constants/app-colours';

export const viewport: Viewport = {
  themeColor: THEME_COLOUR,
  width: 'device-width',
  initialScale: 1,
};
