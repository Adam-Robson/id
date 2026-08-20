"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import TrackList from "@/app/components/track-list";
import { useAudio } from "@/contexts/audio-provider";
import { orderedAlbums } from "@/lib/albums";
import type { AccessLevel } from "@/types/access-level";
import type { Song } from "@/types/song";
import type { SongMeta } from "@/types/song-meta";
import "@/app/components/album-shelf.css";

export default function AlbumShelf({
  songs,
  accessLevel,
}: {
  songs: SongMeta[];
  accessLevel: AccessLevel;
}) {
  const canPlay = accessLevel !== "guest";
  const { setSongs } = useAudio();

  useEffect(() => {
    if (canPlay) setSongs(songs as Song[]);
  }, [songs, canPlay, setSongs]);

  if (!songs.length) return null;

  const albums = orderedAlbums(songs);

  return (
    <div className="album-shelf">
      {albums.map(({ meta, songs: albumSongs }) => (
        <section
          key={meta.key}
          className="tape-card"
          aria-labelledby={`album-${meta.key}`}
        >
          <header className="tape-card-label">
            <span className="tape-card-catalog">
              {meta.catalog}
              {meta.year ? ` · ${meta.year}` : ""}
            </span>
            <span className="tape-card-count">{albumSongs.length} songs</span>
          </header>

          {meta.cover && (
            <div className="tape-card-cover">
              <Image
                src={meta.cover}
                alt={`Cover art for ${meta.title} by LE FOG`}
                fill
                sizes="(max-width: 640px) 100vw, 420px"
                className="tape-card-cover-img"
              />
            </div>
          )}

          <div className="tape-card-body">
            <h2 id={`album-${meta.key}`} className="tape-card-title">
              <Link
                href={`/albums/${meta.slug}`}
                className="tape-card-title-link"
              >
                {meta.title}
              </Link>
            </h2>
            {meta.blurb && <p className="tape-card-blurb">{meta.blurb}</p>}

            <TrackList
              catalog={songs}
              albumSongs={albumSongs}
              accessLevel={accessLevel}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
