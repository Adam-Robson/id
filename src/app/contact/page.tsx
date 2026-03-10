import ThemeToggle from '@/app/components/theme-toggle';

export const metadata = {
  title: 'Contact — LE FOG',
};

export default function ContactPage() {
  return (
    <div className="page-wrapper">
      <header className="site-header">
        <a href="/" className="back-link">← LE FOG</a>
        <ThemeToggle />
      </header>
      <main className="interior-main">
        <p className="page-eyebrow">Contact</p>
        <div className="contact-grid">
          <div className="contact-item">
            <span className="contact-label">General</span>
            <a href="mailto:lefog.info@lefog.me" className="contact-value">
              lefog.info@lefog.me
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
