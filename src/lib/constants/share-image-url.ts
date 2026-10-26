import { SITE_URL } from '@/lib/constants/site-url';

/**
 * Where Next serves src/app/opengraph-image.jpg. The Open Graph tags get it
 * from the file convention; this is for places that need the URL itself,
 * such as structured data.
 */
export const SHARE_IMAGE_URL = `${SITE_URL}/opengraph-image.jpg`;
