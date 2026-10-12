import PageShell from '@/components/page-shell';
import '@/components/styles/album-shelf.css';
import '@/components/styles/interior-pages.css';
import '@/components/styles/skeleton.css';

/**
 * Stands in for the shelf while the bucket listing is in flight. It is
 * built from the shelf's own grid and tile classes, not copies of them, so
 * every cover lands exactly where the real one will and nothing moves when
 * the albums arrive.
 *
 * It draws the same shell as the page because Next scrolls to the top of the
 * page segment after a navigation: with the shell outside the page, the
 * page would start below the print and a click from far down the previous
 * page would land mid-page instead of at the top.
 */
export default function Loading() {
  return (
    <PageShell pattern='poppies'>
      <main className='page-content'>
        <h1 className='page-eyebrow'>Albums</h1>
        <div className='album-shelf' aria-hidden='true'>
          {[0, 1, 2].map((i) => (
            <div key={i} className='album-tile'>
              <div className='album-tile-cover skeleton-block' />
              <div className='skeleton-stack'>
                <div className='skeleton-block skeleton-line skeleton-line--short' />
                <div className='skeleton-block skeleton-line skeleton-line--title' />
                <div className='skeleton-block skeleton-line' />
                <div className='skeleton-block skeleton-line' />
              </div>
            </div>
          ))}
        </div>
        <p className='skeleton-status label' role='status'>
          Loading albums…
        </p>
      </main>
    </PageShell>
  );
}
