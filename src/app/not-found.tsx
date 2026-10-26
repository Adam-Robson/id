import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/page-shell';
import '@/components/styles/interior-pages.css';
import '@/components/styles/status-page.css';

export const metadata: Metadata = {
  title: 'Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageShell pattern='pastels'>
      <main className='page-content status-page'>
        <p className='status-page-code label'>404</p>
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
    </PageShell>
  );
}
