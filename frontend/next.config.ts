import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  assetPrefix: '',
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
