/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@tremor/react'],
    // logging: 'verbose',
  },
};

module.exports = nextConfig;
