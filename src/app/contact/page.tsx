import SiteHeader from '@/app/components/site-header';
import ContactForm from '@/app/components/contact-form';
import '@/app/contact/contact.css';
import '@/app/components/interior-pages.css';

export const metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <div className="page-wrapper page-wrapper--interior">
      <SiteHeader variant="interior" />
      <main className="interior-main contact-interior">
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
