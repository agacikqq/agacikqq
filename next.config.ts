
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Added for static HTML export
  basePath: '/agacikqq',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
