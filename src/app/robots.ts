import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Auth screens have no business in the index.
      disallow: ['/sign-in', '/sign-up'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
