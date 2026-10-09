import '@/app/about/about.css';
import '@/components/styles/interior-pages.css';
import type { Metadata } from 'next';
import AboutGallery from '@/components/about-gallery';
import { sharedOgImage } from '@/components/shared-og-image';
import SiteHeader from '@/components/site-header';

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
          <AboutGallery />
          <div className='about-text'>
            <p className='page-body'>
              LE FOG makes independently produced music for people who have an
              ear for intentional and carefully created arrangements. The sounds
              are confronting while understated, and dreamy but grounded.
            </p>
            <p className='page-body'>
              LE FOG's music is entirely independent; the songs are crafted,
              recorded, mixed, produced and released by the artist. The
              composition holds nothing for decoration; every note is placed
              with intention. It draws you in like an unexpected and fluid
              conversation - tethering you for the moment, folding time as it
              passes, unnoticed.
            </p>
            <p className='page-body'>
              The lyrics lead you to yourself. They surface and linger, like a
              fragment of an inner monologue, something forgotten along the way,
              but is immediately familiar when witnessed. Simultaneously
              existential and unpretentious; a thoughtful rebellion. The catalog
              stands on its own, and there is plenty to explore.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
