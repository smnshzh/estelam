/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript type errors during production builds
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
