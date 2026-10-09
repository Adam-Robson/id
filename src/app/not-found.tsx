import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/site-header';
import '@/components/styles/interior-pages.css';
import '@/components/styles/status-page.css';

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
          <Link href='/albums'>Browse the albums</Link>
          <Link href='/'>Back home</Link>
        </p>
      </main>
    </div>
  );
}
