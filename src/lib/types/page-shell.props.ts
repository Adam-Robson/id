import type { ReactNode } from 'react';
import type { PatternKey } from '@/lib/types/pattern-key';
import type { PlateSize } from '@/lib/types/plate-size';

export interface PageShellProps {
  pattern: PatternKey;
  plate?: PlateSize;
  children: ReactNode;
}
