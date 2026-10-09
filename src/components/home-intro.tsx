import '@/components/styles/home-intro.css';

/**
 * The homepage's indexable content — renders identically for signed-out
 * visitors and search crawlers, who only ever see the site as a guest.
 */
export default function HomeIntro() {
  return (
    <section className='home-intro'>
      <div className='home-intro-copy'>
        <h1 className='home-intro-lede-display'>
          <span className='home-intro-mark'>LE FOG</span>{' '}
          <em className='home-intro-aside'>music</em>
        </h1>
        <p className='home-intro-kicker'>
          est. MMXX <span aria-hidden='true'>·</span> Portland, OR
        </p>
      </div>
    </section>
  );
}
