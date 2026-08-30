import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Clerk's user avatar image CDN.
      { protocol: 'https', hostname: 'img.clerk.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Stops browsers from MIME-sniffing responses into executable types.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Legacy fallback for the CSP frame-ancestors directive set by the
          // middleware (older browsers only read this header).
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default nextConfig;
