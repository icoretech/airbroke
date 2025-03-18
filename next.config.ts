// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['airbroke-dev.icorete.ch'],
  serverExternalPackages: ['@airbrake/node'],
  experimental: {
    dynamicIO: true,
    typedRoutes: true,
    reactCompiler: true,
  },
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/v3/projects/:project_id/create-notice',
        destination: '/api/v3/notices',
      },
      {
        source: '/api/v3/projects/:project_id/notices',
        destination: '/api/v3/notices',
      },
      {
        source: '/notifier_api/v2/notices',
        destination: '/api/v3/notices',
      },
    ];
  },
  async redirects() {
    return [
      // compat
      {
        source: '/projects/:project_id/notices/:notice_id/occurrences/:occurrence_id',
        destination: '/occurrences/:occurrence_id',
        permanent: true,
      },
      {
        source: '/projects/:project_id/notices/:notice_id',
        destination: '/notices/:notice_id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
