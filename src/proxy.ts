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

/**
 * Where the audio actually comes from. `/api/stream` is same-origin, but it
 * answers with a 302 to a presigned R2 URL, and the browser re-checks the
 * redirect target against this policy — so the bucket's origin has to be
 * named or every track is refused before a byte is fetched. Verified: with
 * only 'self' here the redirect is blocked and R2 is never contacted, and
 * the violation names the same-origin URL, not the destination.
 *
 * One origin, because the S3 client is pinned to path-style addressing (see
 * forcePathStyle in lib/r2.ts) and therefore signs for this exact host. The
 * two have to be changed together.
 */
const R2_ORIGIN = (() => {
  if (!process.env.S3_API) return null;
  try {
    return new URL(process.env.S3_API).origin;
  } catch {
    return null;
  }
})();

export default clerkMiddleware({
  /**
   * Clerk builds the policy and allowlists its own origins; the additions
   * here cover what this site serves. `frame-ancestors` is the modern
   * anti-clickjacking control (X-Frame-Options in next.config.ts is the
   * legacy fallback).
   *
   * `strict` is deliberately off. It adds `strict-dynamic`, which trusts
   * only nonce-carrying scripts and whatever they load — but React emits
   * the preinit `<script async>` for a route's `loading.tsx` boundary
   * without a nonce, so the browser refuses it. That chunk carries the
   * client router, and refusing it leaves every in-page link dead on the
   * album routes (verified: nav clicks did nothing on /albums, worked
   * everywhere else). Revisit if Next/React start nonce-ing preinit
   * scripts; until then a policy that breaks navigation is worse than one
   * that stops at origin allowlisting.
   */
  contentSecurityPolicy: {
    directives: {
      'frame-ancestors': ["'none'"],
      // The album shelf paints its grain texture from an inline SVG.
      'img-src': ["'self'", 'data:', 'https://img.clerk.com'],
      // Playback follows /api/stream's redirect out to the bucket.
      'media-src': ["'self'", ...(R2_ORIGIN ? [R2_ORIGIN] : [])],
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
