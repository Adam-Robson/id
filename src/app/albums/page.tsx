import type { Metadata } from 'next';
import AlbumShelf from '@/app/components/album-shelf';
import { sharedOgImage } from '@/app/components/shared-metadata';
import SignInPrompt from '@/app/components/sign-in-prompt';
import SiteHeader from '@/app/components/site-header';
import '@/app/albums/albums.css';
import '@/app/components/interior-pages.css';
import { getAccessLevel } from '@/lib/auth';
import { listSongs, toPlayable } from '@/lib/r2';

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
  const songs = accessLevel === 'guest' ? catalog : toPlayable(catalog);

  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main albums-interior'>
        <h1 className='page-eyebrow'>Albums</h1>
        <AlbumShelf songs={songs} accessLevel={accessLevel} />
      </main>
      {accessLevel === 'guest' && <SignInPrompt />}
    </div>
  );
}
