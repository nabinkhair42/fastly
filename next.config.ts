import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable React strict mode for the upload-avatar component
  reactStrictMode: true,
};

export default nextConfig;
