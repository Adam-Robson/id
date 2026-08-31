import type { Metadata } from 'next';
import { sharedOgImage } from '@/app/components/shared-metadata';
import SignUpForm from '@/app/components/sign-up-form';
import SiteHeader from '@/app/components/site-header';
import { requiredSignUpFields } from '@/lib/clerk-instance';
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

export default async function SignUpPage() {
  // Asked once here so the form can render every field this instance
  // requires up front, instead of discovering a missing one after the
  // visitor has already verified their email.
  const requiredFields = await requiredSignUpFields();

  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main'>
        <p className='page-eyebrow'>Create Account</p>
        <SignUpForm requiredFields={requiredFields} />
      </main>
    </div>
  );
}
