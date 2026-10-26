'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import PagePlate from '@/components/page-plate';
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
    <div className='page-wrapper' data-pattern='pastels'>
      <PagePlate pattern='pastels' />
      <main className='page-content status-page'>
        <h1 className='page-eyebrow'>Something went wrong</h1>
        <p className='page-body'>
          This page ran into a problem while loading. It's usually temporary, so
          trying again often fixes it.
        </p>
        <div className='status-page-actions'>
          <button type='button' className='button' onClick={reset}>
            Try again
          </button>
          <Link href='/'>Back home</Link>
        </div>
        {error.digest && (
          <p className='status-page-digest label'>Reference: {error.digest}</p>
        )}
      </main>
    </div>
  );
}
