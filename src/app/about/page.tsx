import SiteHeader from '@/app/components/site-header';
import '@/app/about/about.css';
import '@/app/components/interior-pages.css';
import type { Metadata } from 'next';
import { sharedOgImage } from '@/app/components/shared-metadata';

export const metadata: Metadata = {
  title: 'About',
  openGraph: {
    type: 'website',
    title: 'About | LE FOG',
    description: 'About page for LE FOG.',
    images: sharedOgImage,
  },
};

export default function AboutPage() {
  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main about-interior'>
        <h1 className='page-eyebrow'>About</h1>
        <div className='about-layout'>
          <div className='about-image' role='img' aria-label='LE FOG artwork' />
          <div className='about-text'>
            <p className='page-body'>
              LE FOG makes music that is independent and unpretentious. The
              songs are understated yet confronting, and are wholly homemade.
            </p>
            <p className='page-body'>
              Each instrument is recorded and played at home, and every song
              is mixed, produced and released the same way. The sounds are not
              decorative; every note is placed with intention. It draws you in
              the way an easy & unexpected conversation does - tethering you for
              the moment and folding time so it passes unnoticed.
            </p>
            <p className='page-body'>
              The lyrics lead you to yourself. They surface and linger, like a
              fragment of your inner monologue, something you forgot along the way,
              and is still immediately familiar. Existential without theatrics;
              rebellious, thoughtful. The catalog stands on its own, and
              there is plenty to explore.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
