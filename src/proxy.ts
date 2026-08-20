import { clerkMiddleware } from "@clerk/nextjs/server";
import { SITE_URL } from "@/lib/site";

const PRODUCTION_HOST = new URL(SITE_URL).host;

export default clerkMiddleware({
  frontendApiProxy: {
    /**
     * The Frontend API proxy is registered in the Clerk dashboard against
     * the production domain, so Clerk can only attribute proxied requests
     * that arrive on that host. Leaving it on everywhere makes localhost
     * and preview deployments fail with `host_invalid`, so scope it to the
     * one host it's actually configured for and let everything else talk
     * to Clerk directly.
     */
    enabled: (url) => url.host === PRODUCTION_HOST,
  },
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
