import { PageMetadata } from '@/app/metadata';
import HomeIntro from '@/components/home-intro';
import PageShell from '@/components/page-shell';
import SongCatalog from '@/components/song-catalog';
import { getAccessLevel } from '@/lib/auth/get-access-level';
import { listSongs } from '@/lib/db/r2/list-songs';
import { toPlayableUrl } from '@/lib/utils/to-playable-url';

export const metadata = PageMetadata;

export default async function Home() {
  const accessLevel = await getAccessLevel();
  const songs = accessLevel === 'guest' ? [] : toPlayableUrl(await listSongs());

  return (
    <PageShell pattern='electric-pink' plate='hero'>
      <main className='page-content'>
        <HomeIntro />
        {songs.length > 0 && <SongCatalog songs={songs} />}
      </main>
    </PageShell>
  );
}
