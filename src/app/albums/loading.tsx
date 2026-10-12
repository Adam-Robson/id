import PageShell from '@/components/page-shell';
import '@/components/styles/interior-pages.css';
import '@/components/styles/skeleton.css';

/**
 * Streams the page shell while the bucket listing is in flight, so a slow
 * R2 response shows the header and a placeholder shelf rather than a blank
 * document.
 */
export default function Loading() {
  return (
    <PageShell pattern='poppies'>
      <main className='page-content'>
        <h1 className='page-eyebrow'>Albums</h1>
        <div className='skeleton-shelf' aria-hidden='true'>
          {[0, 1, 2].map((i) => (
            <div key={i} className='skeleton-card'>
              <div className='skeleton-block skeleton-cover' />
              <div className='skeleton-block skeleton-line skeleton-line--short' />
              <div className='skeleton-block skeleton-line skeleton-line--title' />
              <div className='skeleton-block skeleton-line' />
              <div className='skeleton-block skeleton-line' />
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
