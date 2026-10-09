'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/components/styles/sign-in-prompt.css';

/**
 * The pinned sign-in bar for signed-out visitors
 */
export default function SignInPrompt() {
  const pathname = usePathname();

  if (pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up')) {
    return null;
  }

  return (
    <div className='sign-in-prompt'>
      <div className='sign-in-prompt-inner'>
        <p className='sign-in-prompt-text'>
          Listen to every song for free, with an account
        </p>
        <div className='sign-in-prompt-links'>
          <Link href='/sign-up' className='sign-in-prompt-cta'>
            Sign up free
          </Link>
          <Link href='/sign-in'>Sign in</Link>
          <Link href='/privacy' className='user-menu-link'>Privacy</Link>
        </div>
      </div>
    </div>
  );
}
