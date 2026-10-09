import type { AriaAttributes, ElementType } from 'react';

export type IconProps = AriaAttributes & {
  as: ElementType;
  className?: string;
  size?: number;
  weight?: string;
};
