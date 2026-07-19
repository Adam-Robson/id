import { getSongs } from "@/lib/r2";
import AudioPlayer from "./components/audio-player";
import BackgroundWord from "./components/background-word";
import SiteHeader from "./components/site-header";

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
