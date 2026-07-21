import type { Metadata } from "next";
import AlbumShelf from "@/app/components/album-shelf";
import { sharedOgImage } from "@/app/components/shared-metadata";
import SiteHeader from "@/app/components/site-header";
import "@/app/albums/albums.css";
import "@/app/components/interior-pages.css";
import { getSongs } from "@/lib/r2";

export const metadata: Metadata = {
  title: "Albums",
  openGraph: {
    type: "website",
    title: "Albums | LE FOG",
    description: "The full LE FOG discography — every album and track.",
    images: sharedOgImage,
  },
};

export default async function AlbumsPage() {
  const songs = await getSongs();

  return (
    <div className="page-wrapper page-wrapper--interior">
      <SiteHeader variant="interior" />
      <main className="interior-main albums-interior">
        <h1 className="page-eyebrow">Albums</h1>
        <AlbumShelf songs={songs} />
      </main>
    </div>
  );
}
