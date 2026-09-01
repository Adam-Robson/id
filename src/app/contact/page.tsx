import ContactForm from '@/app/components/contact-form';
import SiteHeader from '@/app/components/site-header';
import '@/app/contact/contact.css';
import '@/app/components/interior-pages.css';
import type { Metadata } from 'next';
import { sharedOgImage } from '@/app/components/shared-metadata';

export const metadata: Metadata = {
  title: 'Contact',
  openGraph: {
    type: 'website',
    title: 'Contact — LE FOG',
    description:
      'Contact LE FOG for booking or general inquiries — email info@lefog.xyz.',
    images: sharedOgImage,
  },
};

export default function ContactPage() {
  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main contact-interior'>
        <h1 className='page-eyebrow'>Contact</h1>
        <p className='page-body contact-intro'>
          For questions, booking, press, or anything else, email{' '}
          <a href='mailto:info@lefog.xyz' className='contact-inline-link'>
            info@lefog.xyz
          </a>
          .
        </p>
        <div className='contact-grid'>
          <div className='contact-item'>
            <span className='contact-label'>General</span>
            <a href='mailto:info@lefog.xyz' className='contact-value'>
              info@lefog.xyz
            </a>
          </div>
        </div>
        <ContactForm />
      </main>
    </div>
  );
}
