/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'chatgpt', '@octokit'],
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
};

module.exports = nextConfig;
