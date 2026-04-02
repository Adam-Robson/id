'use client';

import Link from 'next/link';
import PhosphorIcon from '@/app/components/phosphor-icon';
import type { NavlinkProps } from '@/types/navlink-props';


export default function Navlink({ 
  href, 
  className, 
  icon, 
  value,
  children
}: NavlinkProps
) {
  return (
    <Link href={href} className={className}>
      {value}
      {children}
      {icon && <PhosphorIcon as={icon} size={24} weight="regular" />}
    </Link>
  );
}
