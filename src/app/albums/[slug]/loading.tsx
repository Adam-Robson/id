import Link from 'next/link';
import PageShell from '@/components/page-shell';
import '@/components/styles/interior-pages.css';
import '@/components/styles/skeleton.css';
import '@/app/albums/[slug]/album-page.css';

/**
 * Stands in for an album while its tracks load. It is built from the album
 * page's own layout classes, not copies of them, so the cover and title
 * land where the real ones will and nothing moves when the album arrives.
 * The back link needs no data, so it is the real one.
 *
 * It draws the same shell as the page because Next scrolls to the top of the
 * page segment after a navigation: with the shell outside the page, the
 * page would start below the print and a click from far down the previous
 * page would land mid-page instead of at the top.
 */
export default function Loading() {
  return (
    <PageShell pattern='dahlias'>
      <main className='page-content album-page'>
        <nav className='album-page-back label'>
          <Link href='/albums'>← All albums</Link>
        </nav>

        <div className='album-page-header' aria-hidden='true'>
          <div className='album-page-cover skeleton-block skeleton-cover' />
          <div className='album-page-meta skeleton-stack'>
            <div className='skeleton-block skeleton-line skeleton-line--title' />
            <div className='skeleton-block skeleton-line skeleton-line--short' />
          </div>
        </div>

        <div className='skeleton-tracks' aria-hidden='true'>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='skeleton-block skeleton-line' />
          ))}
        </div>
        <p className='skeleton-status label' role='status'>
          Loading album…
        </p>
      </main>
    </PageShell>
  );
}
