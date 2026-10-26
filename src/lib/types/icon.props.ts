import type { AriaAttributes, ElementType } from 'react';
import type { IconSize } from '@/lib/types/icon-size';

export type IconProps = AriaAttributes & {
  as: ElementType;
  className?: string;
  size?: IconSize;
  weight?: string;
};
