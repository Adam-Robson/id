import Link from 'next/link';
import Logo from '@/components/logo';
import Navigation from '@/components/navigation';
import ThemeToggle from '@/components/theme-toggle';
import UserMenu from '@/components/user-menu';
import type { SiteHeaderProps } from '@/lib/types/site-header.props';

export default function SiteHeader({ cycleLogo = false }: SiteHeaderProps) {
  return (
    <header className='site-header'>
      <Link href='/' className='site-wordmark'>
        <Logo cycle={cycleLogo} />
      </Link>
      <div className='site-header-end'>
        <Navigation />
        <div className='site-header-actions'>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
