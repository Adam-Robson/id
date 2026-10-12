import Link from 'next/link';
import ContactForm from '@/components/contact-form';
import PageShell from '@/components/page-shell';
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
    <PageShell pattern='little-flowers'>
      <main className='page-content page-content--text contact-interior'>
        <h1 className='page-eyebrow'>Contact</h1>
        <p className='page-body'>
          For questions, booking, press, or anything else, email{' '}
          <Link href='mailto:info@lefog.xyz' className='contact-inline-link'>
            info@lefog.xyz
          </Link>
          .
        </p>
        <ContactForm />
      </main>
    </PageShell>
  );
}
