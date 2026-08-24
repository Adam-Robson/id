import { clerkMiddleware } from '@clerk/nextjs/server';
import { SITE_URL } from '@/lib/site';

const PRODUCTION_HOST = new URL(SITE_URL).host;

export default clerkMiddleware({
  frontendApiProxy: {
    /**
     * The production domain has a verified CNAME straight to Clerk's
     * Frontend API (clerk.lefog.xyz -> frontend-api.clerk.services), so it
     * needs no proxying and Clerk rejects proxied requests arriving on that
     * host with `host_invalid`. Proxy everywhere else (localhost, preview
     * deployments) instead, since those hosts have no CNAME and would
     * otherwise talk to Clerk as a third party.
     */
    enabled: (url) => url.host !== PRODUCTION_HOST,
  },
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
