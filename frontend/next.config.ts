import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  assetPrefix: '',
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  // Перемещено из experimental в корень
  serverExternalPackages: [],
  // Исправляем проблемы с chunk loading
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
