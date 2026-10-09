import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import ThemeToggle from '@/components/theme-toggle';
import UserMenu from '@/components/user-menu';

type Props = {
  variant: 'home' | 'interior';
};

export default function SiteHeader({ variant }: Props) {
  return (
    <header className='site-header'>

      {variant === 'home' ? (
        <Link href='/' className='brand-stamp' aria-label='LE FOG — home'>
          <Image src='/images/logo.svg' alt='' width={52} height={52} />
        </Link>
      ) : (
        <Link href='/' className='back-link'>
          ← LE FOG
        </Link>
      )}
      <Navigation />
      <div className='site-header-actions'>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
