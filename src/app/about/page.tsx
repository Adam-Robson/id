import SiteHeader from "@/app/components/site-header";
import "@/app/about/about.css";
import "@/app/components/interior-pages.css";
import type { Metadata } from "next";
import Image from "next/image";
import { sharedOgImage } from "@/app/components/shared-metadata";

export const metadata: Metadata = {
  title: "About",
  openGraph: {
    type: "website",
    title: "About | LE FOG",
    description: "About page for LE FOG.",
    images: sharedOgImage,
  },
};

export default function AboutPage() {
  return (
    <div className="page-wrapper page-wrapper--interior">
      <SiteHeader variant="interior" />
      <main className="interior-main about-interior">
        <h1 className="page-eyebrow">About</h1>
        <div className="about-layout">
          <div className="about-text">
            <p className="page-body">
              LE FOG makes music that is independent and unpretentious. The
              songs are confronting and understated. The effect finds space
              where before it appeared there was none. Each track suggests an
              alternative shape to the world.
            </p>
            <p className="page-body">
              Everything is homemade, in the fullest sense: every instrument is
              played and recorded at home, and every song is produced and
              released the same way — one pair of hands carrying each idea from
              conception to distribution. Nothing is decorative; every sound is
              placed for a reason. It draws you in the way an easy & unexpected
              conversation does — tethering you for the moment and folding time
              so it passes unnoticed.
            </p>
            <p className="page-body">
              The lyrics lead you to yourself. They surface and linger, like a
              fragment of your own inner monologue, something you thought you
              knew, but forgot along the way, or an overheard phrase that stays
              with you longer than you expected. Existential without theatrics;
              rebellious without the noise. The catalog stands on its own, and
              there is plenty to explore.
            </p>
          </div>
          <Image
            className="about-image"
            src="/images/og-image.png"
            alt="LE FOG artwork"
            width={1025}
            height={576}
          />
        </div>
      </main>
    </div>
  );
}
