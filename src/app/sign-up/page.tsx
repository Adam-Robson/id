import '@/components/styles/interior-pages.css';
import '@/components/styles/auth-form.css';
import type { Metadata } from 'next';
import SignUpForm from '@/components/auth/sign-up-form';
import PageShell from '@/components/page-shell';

export const metadata: Metadata = {
  title: 'Sign Up',
  robots: { index: false, follow: true },
};

/**
 * Sign up page component.
 */
export default function SignUpPage() {
  return (
    <PageShell pattern='little-flowers'>
      <main className='page-content'>
        <h1 className='page-eyebrow'>Sign Up</h1>
        <SignUpForm />
      </main>
    </PageShell>
  );
}
