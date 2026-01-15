/**
 * Next.js runtime config (CommonJS).
 *
 * NOTE:
 * 일부 환경/버전에서는 `next.config.ts`가 런타임에서 무시되거나
 * 빌드 산출물 배포 시 설정 누락으로 rewrites가 깨질 수 있습니다.
 * 운영 배포에서는 이 파일을 authoritative로 둡니다.
 *
 * Goal:
 * - Admin Web에서 `/api/v1/*`를 same-origin으로 호출하면
 *   Next rewrites로 백엔드(`api.dongdong.io`)로 프록시되어 CORS를 회피합니다.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
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

module.exports = nextConfig;

