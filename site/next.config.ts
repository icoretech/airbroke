// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  typedRoutes: true,
  images: {
    unoptimized: true,
  },
  // site/ is its own npm project inside the Airbroke repository. Without this,
  // Next.js sees the app's yarn.lock above and builds from the repository root,
  // picking up the app's proxy.ts and dependencies.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
