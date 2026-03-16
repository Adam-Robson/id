import SiteHeader from './components/site-header';
import AudioPlayer from "./components/audio-player";
import { getSongs } from "@/lib/r2";
import '@/app/globals.css';
import BackgroundWord from "./components/background-word";

export default async function Home() {
  const songs = await getSongs();

  return (
    <div className="page-wrapper page-wrapper--home">
      <BackgroundWord />
      <SiteHeader variant="home" />
      <main className="home-main">
        <AudioPlayer songs={songs} />
      </main>
    </div>
  );
}
