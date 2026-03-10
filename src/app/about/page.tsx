import ThemeToggle from '@/app/components/theme-toggle';

export const metadata = {
  title: 'About — LE FOG',
};

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <header className="site-header">
        <a href="/" className="back-link">← LE FOG</a>
        <ThemeToggle />
      </header>
      <main className="interior-main">
        <p className="page-eyebrow">About</p>
        <p className="page-body">
          LE FOG is a band based in the Pacific Northwest. The songs are
          characterized by a rhythm section that is reliable and inventive. The
          The basslines underpin the layers of electrified and washed out guitars
          and synthesizers. The symphony is brought to completion by lyrics that
          are aphoristic and vocal melodies that are equally playful and profound.
        </p>
        <p className="page-body">
           The result is a body of work that spans 6 years in which LE FOG has crafted
          a sonic pallette that is reminisent of the grunge, bohemian, and post-punk,
          post-hardcore world of the late 1990s and 2000s, and bands like the Pixies
          and the Arcade Fire. LE FOG is an explorer too as heard in the sophmore
          electro-ambient album 'seems real'.  LE FOG continues to generate honest and
          melodic music that resonates, and will continue to do so in the coming years.
          Drawing from post-rock, psychedelic dream pop, and ambient traditions, the music
          moves slowly and deliberately — an invitation to listen with your mind and body.
        </p>
      </main>
    </div>
  );
}
