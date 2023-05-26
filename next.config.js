/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['www.gravatar.com', 'i.imgur.com'],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client', 'chatgpt', '@octokit', '@airbrake/node'],
    typedRoutes: true,
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

module.exports = nextConfig;
