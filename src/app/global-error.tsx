'use client';

import { useEffect } from 'react';

/**
 * This is the global error boundary for the website.
 * It is a self-contained component for handling
 * root level errors.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root layout error', error);
  }, [error]);

  return (
    <html lang='en'>
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f6f4ef',
          color: '#151515',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
          padding: '1.5rem',
        }}
      >
        <main>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 400,
              margin: '0 0 0.75rem',
            }}
          >
            A temporary error has occurred.
          </h1>
          <p style={{ margin: '0 0 1.5rem', color: '#6b6862' }}>
            Something went wrong loading the site. Please try again.
          </p>
          <button
            type='button'
            onClick={reset}
            style={{
              font: 'inherit',
              padding: '0.55rem 1.4rem',
              border: '1px solid #151515',
              background: 'transparent',
              color: '#151515',
              cursor: 'pointer',
            }}
          >
            Try again.
          </button>
        </main>
      </body>
    </html>
  );
}
