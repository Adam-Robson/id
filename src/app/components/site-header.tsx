import { Show, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Navigation from '@/app/components/navigation';
import '@/app/components/site-header.css';
import ThemeToggle from '@/app/components/theme-toggle';

type Props = {
  variant: 'home' | 'interior';
};

export default function SiteHeader({ variant }: Props) {
  return (
    <header className='site-header'>
      {variant === 'home' ? (
        <>
          <a href='/' className='brand-stamp' aria-label='LE FOG — home'>
            <Image src='/images/logo.svg' alt='' width={52} height={52} />
          </a>
          <Navigation />
        </>
      ) : (
        <a href='/' className='back-link'>
          ← LE FOG
        </a>
      )}
      <ThemeToggle />
      <div className='site-header-actions'>
        <Show when='signed-in'>
          <UserButton />
        </Show>
        <Show when='signed-out'>
          <a href='/sign-in' className='site-header-signin'>
            Sign in
          </a>
        </Show>
      </div>
    </header>
  );
}
