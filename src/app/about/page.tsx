import '@/app/about/about.css';
import '@/components/styles/interior-pages.css';
import type { Metadata, ResolvingMetadata } from 'next';
import AboutGallery from '@/components/about-gallery';
import PageShell from '@/components/page-shell';

/**
 * Carry the openGraph images from the parent metadata.
 */
export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { openGraph } = await parent;

  return {
    title: 'About',
    openGraph: {
      type: 'website',
      title: 'About | LE FOG',
      description: 'About page for LE FOG.',
      images: openGraph?.images,
    },
  };
}

export default function AboutPage() {
  return (
    <PageShell pattern='peonies'>
      <main className='page-content about-interior'>
        <h1 className='page-eyebrow'>About</h1>
        <div className='about-layout'>
          <AboutGallery />
          <div className='about-text'>
            <p className='page-body'>
              LE FOG makes music independently. The songs are created, performed, recorded,
              produced, and released by LE FOG. The music is carefully written, and can
              draw you in - tethering you, while time passes unnoticed.
            </p>
            <p className='page-body'>
              The lyrics are aphoristic, and playful. They surface and linger, like something
              forgotten and familiar. The music is existential and unpretentious.
              The catalog stands on its own, and offers plenty to explore.
            </p>
            <p className='page-body'>
              LE FOG is immensely grateful that you are taking the time to visit this page and
              for your attention to this music and the work that goes into it. Thank you.
            </p>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
