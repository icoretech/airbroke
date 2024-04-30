const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
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
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  logging: {
    level: process.env.AIRBROKE_LOG_LEVEL === 'verbose' ? 'verbose' : undefined,
  },
  experimental: {
    serverComponentsExternalPackages: ['@octokit', '@airbrake/node'],
    // typedRoutes: true,
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
      // old api routing compat
      {
        source: '/projects/:project_id/notices/:notice_id/occurrences/:occurrence_id',
        destination: '/occurrences/:occurrence_id',
      },
      {
        source: '/projects/:project_id/notices/:notice_id',
        destination: '/notices/:notice_id',
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
