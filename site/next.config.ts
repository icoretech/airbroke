// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  typedRoutes: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
