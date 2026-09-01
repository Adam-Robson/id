import Image from 'next/image';
import Navigation from '@/app/components/navigation';
import '@/app/components/site-header.css';
import ThemeToggle from '@/app/components/theme-toggle';
import UserMenu from '@/app/components/user-menu';

type Props = {
  variant: 'home' | 'interior';
};

export default function SiteHeader({ variant }: Props) {
  return (
    <header className='site-header'>
      {/* The variant changes only how the site names itself: the logo on the
          home page, a labelled way back everywhere else. */}
      {variant === 'home' ? (
        <a href='/' className='brand-stamp' aria-label='LE FOG — home'>
          <Image src='/images/logo.svg' alt='' width={52} height={52} />
        </a>
      ) : (
        <a href='/' className='back-link'>
          ← LE FOG
        </a>
      )}
      {/* Carried by every page, so moving between sections never means
          returning to the home page first. */}
      <Navigation />
      <ThemeToggle />
      <div className='site-header-actions'>
        <UserMenu />
      </div>
    </header>
  );
}
