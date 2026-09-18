import { getAccessLevel } from '@/lib/auth';
import { listSongs, toPlayable } from '@/lib/r2';
import BackgroundWord from './components/background-word';
import SiteHeader from './components/site-header';
import SongCatalog from './components/song-catalog';

export default async function Home() {
  const accessLevel = await getAccessLevel();
  const songs = accessLevel === 'guest' ? [] : toPlayable(await listSongs());

  return (
    <div className='page-wrapper page-wrapper--home'>
      <BackgroundWord />
      <SiteHeader variant='home' />
      <main className='home-main'>
        {songs.length > 0 && <SongCatalog songs={songs} />}
      </main>
    </div>
  );
}
