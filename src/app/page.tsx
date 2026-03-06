import Image from "next/image";
import ThemeToggle from './theme-toggle'


export default function Home() {
  return (
    <div className="page-wrapper">
      <header className="site-header site-header--end">
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
      </main>
    </div>
  );
}
