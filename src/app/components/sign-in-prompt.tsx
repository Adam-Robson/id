'use client';

import { usePathname } from 'next/navigation';
import '@/app/components/sign-in-prompt.css';

/**
 * The pinned sign-in bar. Rendered once from the root layout for signed-out
 * visitors, so every page carries a way in without each page opting in.
 *
 * It hides itself on the auth routes: the sign-in form is already on screen
 * there, and a bar urging you to sign in would duplicate it and sit on top of
 * the Clerk card.
 */
export default function SignInPrompt() {
  const pathname = usePathname();

  if (pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up')) {
    return null;
  }

  return (
    <div className='sign-in-prompt'>
      <div className='sign-in-prompt-inner'>
        <p className='sign-in-prompt-text'>Sign in to stream the catalog</p>
        <div className='sign-in-prompt-links'>
          <a href='/sign-up'>Create account</a>
          <a href='/sign-in'>Sign in</a>
        </div>
      </div>
    </div>
  );
}
