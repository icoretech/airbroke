/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['www.gravatar.com', 'i.imgur.com'],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['chatgpt', '@octokit', '@airbrake/node'],
    instrumentationHook: true,
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
