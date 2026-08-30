import type { Metadata } from 'next';
import { sharedOgImage } from '@/app/components/shared-metadata';
import SignUpForm from '@/app/components/sign-up-form';
import SiteHeader from '@/app/components/site-header';
import '@/app/components/interior-pages.css';

export const metadata: Metadata = {
  title: 'Create Account',
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    title: 'Create Account | LE FOG',
    description: 'Create an account to stream the LE FOG catalog.',
    images: sharedOgImage,
  },
};

export default function SignUpPage() {
  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main' style={{ alignItems: 'center' }}>
        <p className='page-eyebrow'>Create Account</p>
        <SignUpForm />
      </main>
    </div>
  );
}
