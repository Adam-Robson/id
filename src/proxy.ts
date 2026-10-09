import { clerkMiddleware } from '@clerk/nextjs/server';
import { SITE_URL } from '@/lib/constants/site-url';

const PRODUCTION_HOST = new URL(SITE_URL).host;

const IS_PRODUCTION_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_live_') ??
  false;

const R2_ORIGIN = (() => {
  if (!process.env.S3_API) return null;
  try {
    return new URL(process.env.S3_API).origin;
  } catch {
    return null;
  }
})();

export default clerkMiddleware({
  contentSecurityPolicy: {
    directives: {
      'frame-ancestors': ["'none'"],
      'img-src': ["'self'", 'data:', 'https://img.clerk.com'],
      'media-src': ["'self'", ...(R2_ORIGIN ? [R2_ORIGIN] : [])],
    },
  },
  frontendApiProxy: {
    enabled: (url: URL) => IS_PRODUCTION_KEY && url.host !== PRODUCTION_HOST,
  },
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
