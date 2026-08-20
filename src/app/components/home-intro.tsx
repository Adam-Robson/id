import Image from "next/image";
import Link from "next/link";
import { orderedAlbumMeta } from "@/lib/albums";
import "@/app/components/home-intro.css";

/**
 * The homepage's indexable content. Everything here is public — album
 * art, titles and years are presentation metadata, not the audio itself —
 * so it renders identically for signed-out visitors and search crawlers,
 * who only ever see the site as a guest.
 */
export default function HomeIntro() {
  const albums = orderedAlbumMeta();

  return (
    <section className="home-intro">
      <h1 className="home-intro-title">LE FOG</h1>

      <p className="home-intro-lede">
        LE FOG is the pseudonym of Adam Robson — a songwriter and producer
        working out of Portland, Oregon. Everything is homemade in the fullest
        sense: every instrument played and recorded at home, every song produced
        and released the same way.
      </p>

      <h2 className="home-intro-heading">Discography</h2>

      <ul className="home-intro-albums">
        {albums.map((album) => (
          <li key={album.key} className="home-intro-album">
            <Link
              className="home-intro-album-link"
              href={`/albums/${album.slug}`}
            >
              {album.cover && (
                <span className="home-intro-album-cover">
                  <Image
                    src={album.cover}
                    alt={`Cover art for ${album.title} by LE FOG`}
                    fill
                    sizes="(max-width: 640px) 45vw, 200px"
                    className="home-intro-album-img"
                  />
                </span>
              )}
              <span className="home-intro-album-title">{album.title}</span>
              {album.year && (
                <span className="home-intro-album-year">{album.year}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
