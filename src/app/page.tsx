import { Icon } from "@/components/icon";

export default function Home() {
  return (
    <div className="page-wrapper">
      <div className="page-bg" />

      <main className="plate">

        <header className="page-header">
          <Icon
            srcLight="/logolt.svg"
            srcDark="/logodk.svg"
            alt="LE FOG"
            width={120}
            height={120}
          />
          <nav className="page-nav">
            <a href="#about" className="nav-link">About</a>
            <a href="#work" className="nav-link">Work</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </header>

        <hr className="divider" />

        <section className="mb-16">
          <p className="statement">
            A tiny orbit of warmth and noise—<br />
            a place to land; unhurried poise.
          </p>
        </section>

        <hr className="divider" />

        <section className="grid grid-cols-1 gap-12 sm:grid-cols-3">

          <div id="about">
            <h2 className="section-label">About</h2>
            <p className="section-text">
              Founded in 2019 in Portland, Oregon, LE FOG is the brainchild of Adam Robson.ax
            </p>
f          </div><dd></dd>

          <div id="work">
            <h2 className="section-label">Works</h2>
            <ul className="section-list section-text">
              <li><a href="#" className="section-link">Left Static & at Ease</a></li>
              <li><a href="#" className="section-link">Seems Real</a></li>
              <li><a href="#" className="section-link">Three.</a></li>
              <li><a href="#" className="section-link">For before I forget</a></li>
              <li><a href="#" className="section-link">Hi Five Yourself</a></li>
            </ul>
          </div>

          <div id="contact">
            <h2 className="section-label">Contact</h2>
            <ul className="section-list section-text">
              <li><a href="mailto:hello@lefog.com" className="section-link">hello@lefog.com</a></li>
              <li><a href="#" className="section-link">Instagram</a></li>
              <li><a href="#" className="section-link">Spotify</a></li>
            </ul>
          </div>

        </section>

      </main>
    </div>
  );
}
