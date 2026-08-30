import type { Metadata } from 'next';
import { sharedOgImage } from '@/app/components/shared-metadata';
import SignInForm from '@/app/components/sign-in-form';
import SiteHeader from '@/app/components/site-header';
import '@/app/components/interior-pages.css';

export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    title: 'Sign In | LE FOG',
    description: 'Sign in to stream the LE FOG catalog.',
    images: sharedOgImage,
  },
};

export default function SignInPage() {
  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main'>
        <p className='page-eyebrow'>Sign In</p>
        <SignInForm />
      </main>
    </div>
  );
}
