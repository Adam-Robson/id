import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/site-header';
import '@/app/components/interior-pages.css';
import '@/app/privacy/privacy.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How LE FOG collects, uses and protects your information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main'>
        <h1 className='page-eyebrow'>Privacy</h1>

        <article className='policy'>
          <p className='policy-updated'>Last updated: October 08, 2026</p>

          <p>
            This policy explains what information lefog.me collects, why, and
            what you can do about it. LE FOG is a one-person music project run
            from Portland, Oregon. TODO(adam): your name, if you want it here.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Account details.</strong> When you create an account, we
              collect your email address and, if you provide it, your name. If
              you sign up with Google, Google shares your name, email address
              and profile picture with us.
            </li>
            <li>
              <strong>Messages you send.</strong> If you use the contact form,
              we keep your name, email address and message so we can reply.
            </li>
            <li>
              <strong>Your theme choice.</strong> A small cookie remembers
              whether you prefer the light or dark theme.
            </li>
            <li>
              <strong>Technical data.</strong> Like most websites, our hosting
              provider automatically records basic request information, such as
              IP address, browser type and the pages you visit, to run and
              secure the site.
            </li>
            <li>
              <strong>Visit statistics.</strong> We use Vercel Web Analytics to
              count visits and see which pages are popular. It does not use
              cookies and does not identify you. It records only general details
              such as the page, the referring site, your country, and your
              browser and device type.
            </li>
          </ul>

          <h2>How we use it</h2>
          <p>
            We use this information to run your account and let you stream the
            catalog, to reply to your messages, to remember your preferences,
            and to keep the site secure. We do not sell your information, and we
            do not use it for advertising.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies that keep you signed in and remember your theme. The
            site does not work properly without the sign-in cookies. We do not
            use advertising or cross-site tracking cookies.
          </p>

          <h2>Services we rely on</h2>
          <p>
            A few providers process information on our behalf, only to provide
            their part of the service:
          </p>
          <ul>
            <li>
              <strong>Clerk</strong> manages accounts and sign-in.
            </li>
            <li>
              <strong>Google</strong> handles sign-in, if you choose to sign in
              with Google.
            </li>
            <li>
              <strong>Vercel</strong> hosts the website.
            </li>
            <li>
              <strong>Cloudflare</strong> stores and delivers the music files.
            </li>
          </ul>

          <h2>How long we keep it</h2>
          <p>
            We keep your account information until you delete your account or
            ask us to delete it. We keep contact messages for a one year period,
            then delete them.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask for a copy of your information, ask us to correct it, or
            ask us to delete it and your account at any time. Email{' '}
            <a href='mailto:lefogsongs@gmail.com'>lefogsongs@gmail.com</a> and
            we’ll respond within 30 days.
          </p>

          <h2>Children</h2>
          <p>
            This site is not directed at children under 13, and we do not
            knowingly collect their information. If you believe a child has
            given us information, contact us and we’ll delete it.
          </p>

          <h2>Security</h2>
          <p>
            We take reasonable steps to protect your information, including
            encrypted connections and access controls. No online service can
            guarantee complete security.
          </p>

          <h2>Changes</h2>
          <p>
            If this policy changes, we’ll update it here and change the date at
            the top.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy can go to{' '}
            <Link href='mailto:lefogsongs@gmail.com'>lefogsongs@gmail.com</Link>
            .
          </p>
        </article>
      </main>
    </div>
  );
}
