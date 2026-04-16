import SiteHeader from "@/app/components/site-header";
import "@/app/about/about.css";
import "@/app/components/interior-pages.css";
import type { Metadata } from "next";
import { sharedOgImage } from "@/app/components/shared-metadata";

export const metadata: Metadata = {
  title: "About",
  openGraph: {
    type: "website",
    title: "About | LE FOG",
    description: "About LE FOG, bio, other projects, & more...",
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
          <p className="page-body">
            There is a kind of music that does not try to convince you of
            anything. LE FOG is that kind of music. The sound LE FOG creates is
            honest and spontaneous. Their songs move on a foundation grounded in
            this world, and layered on top is fuzz from electric guitars and
            alien synthesizers. The effect increases the number of possible
            worlds.
            <br />
            An ambient introduction, a dive into an electronic ensemble that
            compels you to move your hips, or a groove that leans in to the
            acoustics of live drums and electric bass — the music is alive, and
            like life it is confronting and understated. The layers are not
            decorative - each sound is placed for a reason. It draws you in the
            way an unexpected and easy conversation does, captivating you in the
            moment, and will have you involuntarily revisiting it as you walk
            away.
            <br />
            The lyrics do not lead you anywhere in particular, because that is
            not their purpose. They are there to remind you of yourself. They
            surface and linger, because they are reminiscent of one's own
            inner-monologue, a fond and distant memory, or an overheard phrase
            that stays with you longer than you anticipated. Like something you
            thought you knew, but forgot along the way. Existential without
            theatrics; rebellious without the noise. The catalog stands on its
            own, with plenty to explore.
            <br />
            As always, there is more where that came from.
          </p>
          <video
            controls
            className="about-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/video/juggle.mp4" type="video/mp4" />
            <source src="/video/juggle.webm" type="video/webm" />
          </video>
        </div>
      </main>
    </div>
  );
}
