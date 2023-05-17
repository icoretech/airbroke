/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v3/projects/:project_id/create-notice',
        destination: '/api/v3/projects/:project_id/notices',
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.wasm$/,
      use: ['wasm-loader'],
      type: 'javascript/auto',
    });

    return config;
  },
};

module.exports = nextConfig;
