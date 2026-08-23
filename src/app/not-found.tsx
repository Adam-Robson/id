import type { Metadata } from 'next';
import SiteHeader from '@/app/components/site-header';
import '@/app/components/interior-pages.css';
import '@/app/components/status-page.css';

export const metadata: Metadata = {
  title: 'Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main status-page'>
        <p className='status-page-code'>404</p>
        <h1 className='page-eyebrow'>Nothing here</h1>
        <p className='page-body'>
          That page does not exist; it may have moved, or the link may be
          broken.
        </p>
        <p className='status-page-actions'>
          <a href='/albums'>Browse the albums</a>
          <a href='/'>Back home</a>
        </p>
      </main>
    </div>
  );
}
