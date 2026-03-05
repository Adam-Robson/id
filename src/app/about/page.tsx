import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="page-bg" />
      <main className="plate">
        <nav className="about-nav">
          <Link href="/" className="nav-link">← Home</Link>
        </nav>

        <div className="about-photo">
          <Image
            src="/leopard.png"
            alt="LE FOG"
            width={120}
            height={120}
            className="about-photo-img"
          />
        </div>

        <hr className="divider" />

        <section className="about-section">
          <p className="section-label">About</p>
          <p className="section-text">
            LE FOG is a music producer and artist based in [city]. Known for
            blending [genre] with [influence], creating a sound that is
            [description].
          </p>
        </section>

        <section className="about-section">
          <p className="section-label">Disciplines</p>
          <ul className="section-list">
            <li className="section-text">Music Production</li>
            <li className="section-text">Sound Design</li>
            <li className="section-text">Live Performance</li>
          </ul>
        </section>

        <section className="about-section">
          <p className="section-label">Links</p>
          <ul className="section-list">
            <li>
              <a href="#" className="section-link">Instagram</a>
            </li>
            <li>
              <a href="#" className="section-link">SoundCloud</a>
            </li>
            <li>
              <a href="#" className="section-link">Spotify</a>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
