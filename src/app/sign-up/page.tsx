import '@/components/styles/interior-pages.css';
import '@/components/styles/auth-form.css';
import type { Metadata } from 'next';
import SignUpForm from '@/components/auth/sign-up-form';
import SiteHeader from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Sign Up',
  robots: { index: false, follow: true },
};

/**
 * Sign up page component.
 */
export default function SignUpPage() {
  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main auth-main'>
        <h1 className='page-eyebrow'>Sign Up</h1>
        <SignUpForm />
      </main>
    </div>
  );
}
