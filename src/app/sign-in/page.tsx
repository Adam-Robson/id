import '@/components/styles/interior-pages.css';
import '@/components/styles/auth-form.css';
import type { Metadata } from 'next';
import SignInForm from '@/components/auth/sign-in-form';
import SiteHeader from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: true },
};

/**
 * Sign in page component.
 * @returns
 */
export default function SignInPage() {
  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main auth-main'>
        <h1 className='page-eyebrow'>Sign In</h1>
        <SignInForm />
      </main>
    </div>
  );
}
