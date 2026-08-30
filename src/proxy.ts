import { clerkMiddleware } from '@clerk/nextjs/server';
import { SITE_URL } from '@/lib/site';

const PRODUCTION_HOST = new URL(SITE_URL).host;

/**
 * Frontend API proxying is a production-instance feature. Development
 * instances (pk_test — what local dev loads from .env.local) authenticate
 * through dev-browser tokens sent straight to the instance's own
 * *.clerk.accounts.dev origin, and the Frontend API rejects proxied dev
 * traffic with `host_invalid` — which silently breaks every sign-in and
 * sign-up locally if the proxy is forced on.
 */
const IS_PRODUCTION_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_live_') ??
  false;

export default clerkMiddleware({
  /**
   * Clerk generates a nonce-based strict-dynamic policy that covers its own
   * origins; Next.js reads the nonce from the request header and stamps it
   * onto its inline scripts. `frame-ancestors` here is the modern
   * anti-clickjacking control (X-Frame-Options in next.config.ts is the
   * legacy fallback).
   */
  contentSecurityPolicy: {
    strict: true,
    directives: {
      'frame-ancestors': ["'none'"],
    },
  },
  frontendApiProxy: {
    /**
     * The production domain has a verified CNAME straight to Clerk's
     * Frontend API (clerk.lefog.xyz -> frontend-api.clerk.services), so it
     * needs no proxying and Clerk rejects proxied requests arriving on that
     * host with `host_invalid`. Proxy the remaining production-key hosts
     * (preview deployments), which have no CNAME and would otherwise talk
     * to Clerk as a third party.
     */
    enabled: (url) => IS_PRODUCTION_KEY && url.host !== PRODUCTION_HOST,
  },
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
