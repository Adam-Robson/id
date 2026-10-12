'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavlinkProps } from '@/lib/types/navlink.props';

export default function Navlink({
  href,
  className,
  value,
  children,
}: NavlinkProps) {
  const pathname = usePathname();
  // Now that the nav rides along on every page, it has to say where you
  // already are. A record page counts as being in Albums, so match the
  // section rather than only the exact path.
  const isCurrent = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={className}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {value}
      {children}
    </Link>
  );
}
