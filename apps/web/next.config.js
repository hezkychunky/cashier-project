/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // ✅ Allow images from localhost:8000
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
