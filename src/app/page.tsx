import { getAccessLevel } from '@/lib/auth';
import { listSongs, toPlayable } from '@/lib/r2';
import AudioPlayer from './components/audio-player';
import BackgroundWord from './components/background-word';
import HomeIntro from './components/home-intro';
import SiteHeader from './components/site-header';

export default async function Home() {
  const accessLevel = await getAccessLevel();
  const songs = accessLevel === 'guest' ? [] : toPlayable(await listSongs());

  return (
    <div className='page-wrapper page-wrapper--home'>
      <BackgroundWord />
      <SiteHeader variant='home' />
      <main className='home-main'>
        <HomeIntro />
        {/* Guests get the sign-in bar from the root layout instead. */}
        {accessLevel !== 'guest' && <AudioPlayer songs={songs} />}
      </main>
    </div>
  );
}
