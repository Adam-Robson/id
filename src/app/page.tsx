import { getAccessLevel } from "@/lib/auth";
import { getPlayableSongs } from "@/lib/r2";
import AudioPlayer from "./components/audio-player";
import BackgroundWord from "./components/background-word";
import SignInPrompt from "./components/sign-in-prompt";
import SiteHeader from "./components/site-header";

export default async function Home() {
  const accessLevel = await getAccessLevel();
  const songs = accessLevel === "guest" ? [] : await getPlayableSongs();

  return (
    <div className="page-wrapper page-wrapper--home">
      <BackgroundWord />
      <SiteHeader variant="home" />
      <main className="home-main">
        {accessLevel === "guest" ? (
          <SignInPrompt />
        ) : (
          <AudioPlayer songs={songs} />
        )}
      </main>
    </div>
  );
}
