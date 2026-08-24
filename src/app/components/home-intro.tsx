import Image from 'next/image';
import Link from 'next/link';
import { orderedAlbumMeta } from '@/lib/albums';
import '@/app/components/home-intro.css';

/**
 * The homepage's indexable content. Everything here is public — album
 * art, titles and years are presentation metadata, not the audio itself —
 * so it renders identically for signed-out visitors and search crawlers,
 * who only ever see the site as a guest.
 */
export default function HomeIntro() {
  const albums = orderedAlbumMeta();

  return (
    <section className='home-intro'>
      <div className='home-intro-copy'>
        <p className='home-intro-lede'>
          LE FOG is a musical project by Adam Robson — a home-recording artist
          from Portland, Oregon.
        </p>
      </div>

      <aside className='home-intro-discography'>
        <details className='home-intro-details'>
          <summary className='home-intro-summary'>
            <h2 className='home-intro-heading'>Discography</h2>
            <svg
              className='home-intro-summary-icon'
              viewBox='0 0 16 16'
              width='12'
              height='12'
              aria-hidden='true'
            >
              <path
                d='M2 5l6 6 6-6'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </summary>

          <ul className='home-intro-albums'>
            {albums.map((album) => (
              <li key={album.key} className='home-intro-album'>
                <Link
                  className='home-intro-album-link'
                  href={`/albums/${album.slug}`}
                >
                  {album.cover && (
                    <span className='home-intro-album-cover'>
                      <Image
                        src={album.cover}
                        alt={`Cover art for ${album.title} by LE FOG`}
                        fill
                        sizes='(max-width: 640px) 45vw, 200px'
                        className='home-intro-album-img'
                      />
                    </span>
                  )}
                  <span className='home-intro-album-title'>{album.title}</span>
                  {album.year && (
                    <span className='home-intro-album-year'>{album.year}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </aside>
    </section>
  );
}
