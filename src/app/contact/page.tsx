import Link from 'next/link';
import ContactForm from '@/components/contact-form';
import SiteHeader from '@/components/site-header';
import '@/app/contact/contact.css';
import '@/components/styles/interior-pages.css';
import type { Metadata } from 'next';
import { sharedOgImage } from '@/components/shared-og-image';

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
          <Link href='mailto:info@lefog.xyz' className='contact-inline-link'>
            info@lefog.xyz
          </Link>
          .
        </p>
        <ContactForm />
      </main>
    </div>
  );
}
