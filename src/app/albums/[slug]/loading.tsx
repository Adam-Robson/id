import SiteHeader from '@/components/site-header';
import '@/components/styles/interior-pages.css';
import '@/components/styles/skeleton.css';

/**
 * Streams the page shell while the album's tracks load, so a slow R2 response
 * shows the header and a placeholder rather than a blank document.
 */
export default function Loading() {
  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main'>
        <div className='skeleton-album' aria-hidden='true'>
          <div className='skeleton-block skeleton-cover skeleton-cover--detail' />
          <div className='skeleton-album-meta'>
            <div className='skeleton-block skeleton-line skeleton-line--title' />
            <div className='skeleton-block skeleton-line skeleton-line--short' />
          </div>
        </div>
        <div className='skeleton-tracks' aria-hidden='true'>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='skeleton-block skeleton-line' />
          ))}
        </div>
        <p className='skeleton-status' role='status'>
          Loading album…
        </p>
      </main>
    </div>
  );
}
