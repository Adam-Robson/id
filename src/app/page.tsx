import Image from "next/image";
import ThemeToggle from './components/theme-toggle';
import AudioPlayer from "./components/audio-player";
import { getSongs } from "@/lib/r2";

export default async function Home() {
  const songs = await getSongs();

  return (
    <div className="page-wrapper">
      <header className="site-header">
        <a href="#about" className="about-link">About</a>
        <ThemeToggle />
      </header>
      <main className="home-main">
        <div className="logo-container">
          <Image
            src="/logo_.svg"
            alt="le fog logo"
            height="800"
            width="800"
            className="logo"
          />
        </div>
        <AudioPlayer songs={songs} />
      </main>
      <section id="about" className="about-section">
        <h2 className="about-heading">About</h2>
        <p className="about-body">
          LE FOG is a band based in the Pacific Northwest.
        </p>
      </section>
    </div>
  );
}
