import SiteHeader from '@/app/components/site-header';
import '@/app/about/about.css';
import '@/app/components/interior-pages.css';

export const metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <div className="page-wrapper page-wrapper--interior">
      <SiteHeader variant="interior" />
      <main className="interior-main about-interior">
        <p className="page-eyebrow">About</p>
        <div className="about-layout">
          <p className="page-body">
           At home in the Pacific Northwest, LE FOG is the love-labor of
           a musician named Adam Robson. Their songs move on a melodic,
           understated foundation — drums and bass that anchor the music
           and ground it in this world. The fuzz of electrified guitars
           and alien synthesizers sounds layer on top, extending the
           suite of possible worlds. What surfaces from that interplay
           are lyrics that are intimate and honest — one moment playful
           & on the surface, and the next, diving deep and
           confronting aspects of life that puzzle many of us.

           Over six years, their work has ranged across post-rock,
           psychedelic, and ambient territory without settling into
           any one of them. The music shifts in weight and intensity
           — not outright punk-rock, but the same restless & rebellious
           spirit shows up in LE FOG's music.
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
