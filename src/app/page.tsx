import Image from "next/image";
import ThemeToggle from './components/theme-toggle';
import AudioPlayer from "./components/audio-player";
import { getSongs } from "@/lib/r2";

// export const dynamic = "force-dynamic";

export default async function Home() {
  const songs = await getSongs();

  return (
    <div className="page-wrapper page-wrapper--home">
      <span className="bg-word" aria-hidden="true">FOG</span>
      <header className="site-header">
        <nav className="site-nav">
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>
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
    </div>
  );
}
