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
  // Конфигурация для next/image
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'crm.practic.studio',
        pathname: '/storage/**',
      },
    ],
  },
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
