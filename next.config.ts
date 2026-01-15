import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    // Admin Web also proxies /api/v1/* to the backend origin to avoid CORS.
    // Keep consistent with dongdong-client pattern.
    const backendBase =
      process.env.NEXT_PUBLIC_API_URL || 'http://api.dongdong.io:3000/api/v1';
    const backendOrigin = backendBase.replace(/\/api\/v1\/?$/, '');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendOrigin}/api/v1/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

