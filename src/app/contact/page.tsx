import ThemeToggle from '@/app/components/theme-toggle';
import ContactForm from '@/app/components/contact-form';
import '@/app/contact/contact.css';

export const metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <div className="page-wrapper page-wrapper--interior">
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
        <ContactForm />
      </main>
    </div>
  );
}
