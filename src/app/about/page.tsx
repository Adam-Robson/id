import ThemeToggle from '@/app/components/theme-toggle';

export const metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <div className="page-wrapper page-wrapper--interior">
      <header className="site-header">
        <a href="/" className="back-link">← LE FOG</a>
        <ThemeToggle />
      </header>
      <main className="interior-main">
        <p className="page-eyebrow">About</p>
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
      </main>
    </div>
  );
}
