import type { Metadata } from 'next';
import AlbumShelf from '@/components/album-shelf';
import PageShell from '@/components/page-shell';
import { sharedOgImage } from '@/components/shared-og-image';
import { getAccessLevel } from '@/lib/auth/get-access-level';
import { listSongs } from '@/lib/db/r2/list-songs';
import { toPlayableUrl } from '@/lib/utils/to-playable-url';
import '@/components/styles/interior-pages.css';

export const metadata: Metadata = {
  title: 'Albums',
  openGraph: {
    type: 'website',
    title: 'Albums | LE FOG',
    description: 'The full LE FOG discography — every album and track.',
    images: sharedOgImage,
  },
};

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
