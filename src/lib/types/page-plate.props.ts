import type { PatternKey } from '@/lib/types/pattern-key';
import type { PlateSize } from '@/lib/types/plate-size';

export interface PagePlateProps {
  pattern: PatternKey;
  size?: PlateSize;
}
