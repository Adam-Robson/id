import type { Metadata } from 'next';
import AlbumShelf from '@/components/album-shelf';
import { sharedOgImage } from '@/components/shared-og-image';
import SiteHeader from '@/components/site-header';
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
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main'>
        <h1 className='page-eyebrow'>Albums</h1>
        <AlbumShelf songs={songs} accessLevel={accessLevel} />
      </main>
    </div>
  );
}
