import Link from 'next/link';
import Navigation from '@/components/navigation';
import ThemeToggle from '@/components/theme-toggle';
import UserMenu from '@/components/user-menu';

export default function SiteHeader() {
  return (
    <header className='site-header'>
      <Link href='/' className='site-wordmark'>
        LE FOG
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
