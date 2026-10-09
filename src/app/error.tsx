'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import '@/components/styles/interior-pages.css';
import '@/components/styles/status-page.css';

/**
 * Catches render and data-fetching failures
 * below the root layout.
 */
export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error', error);
  }, [error]);

  return (
    <div className='page-wrapper page-wrapper--interior'>
      <main className='interior-main status-page'>
        <h1 className='page-eyebrow'>Page Not Found</h1>
        <p className='page-body'>
          The page didn't load properly. It's usually temporary — try again.
        </p>
        <div className='status-page-actions'>
          <button type='button' onClick={reset}>
            Try again
          </button>
          <p>
            Or navigate<Link href='/'> Back home</Link>.
          </p>
        </div>
        {error.digest && (
          <p className='status-page-digest'>Reference: {error.digest}</p>
        )}
      </main>
    </div>
  );
}
