import type { Metadata, ResolvingMetadata } from 'next';
import AlbumShelf from '@/components/album-shelf';
import PageShell from '@/components/page-shell';
import { getAccessLevel } from '@/lib/auth/get-access-level';
import { listSongs } from '@/lib/db/r2/list-songs';
import { toPlayableUrl } from '@/lib/utils/to-playable-url';
import '@/components/styles/interior-pages.css';

/**
 * Setting openGraph here replaces the root's whole openGraph block, share
 * image included, so the image Next builds from src/app/opengraph-image.jpg
 * is carried over from the parent.
 */
export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { openGraph } = await parent;

  return {
    title: 'Albums',
    openGraph: {
      type: 'website',
      title: 'Albums | LE FOG',
      description: 'The full LE FOG discography — every album and track.',
      images: openGraph?.images,
    },
  };
}

export default async function AlbumsPage() {
  const accessLevel = await getAccessLevel();
  const catalog = await listSongs();
  const songs = accessLevel === 'guest' ? catalog : toPlayableUrl(catalog);

  return (
    <PageShell pattern='poppies'>
      <main className='page-content'>
        <h1 className='page-eyebrow'>Albums</h1>
        <AlbumShelf songs={songs} accessLevel={accessLevel} />
      </main>
    </PageShell>
  );
}
