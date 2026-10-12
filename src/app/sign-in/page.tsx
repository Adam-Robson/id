import '@/components/styles/interior-pages.css';
import '@/components/styles/auth-form.css';
import type { Metadata } from 'next';
import SignInForm from '@/components/auth/sign-in-form';
import PageShell from '@/components/page-shell';

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
    <PageShell pattern='little-flowers'>
      <main className='page-content'>
        <h1 className='page-eyebrow'>Sign In</h1>
        <SignInForm />
      </main>
    </PageShell>
  );
}
