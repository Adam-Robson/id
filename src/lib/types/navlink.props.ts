import type { ReactNode } from 'react';

export interface NavlinkProps {
  href: string;
  className?: string;
  value?: string;
  children?: ReactNode;
}
