import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@reduxjs/toolkit', 'react-redux'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: '**.90min.com' },
      { protocol: 'https', hostname: '**.minutemediacdn.com' },
      { protocol: 'https', hostname: '**.bbc.com' },
      { protocol: 'https', hostname: '**.bbc.co.uk' },
      { protocol: 'https', hostname: '**.bbci.co.uk' },
      { protocol: 'https', hostname: 'ichef.bbci.co.uk' },
      { protocol: 'https', hostname: '**.guim.co.uk' },
      { protocol: 'https', hostname: 'i.guim.co.uk' },
      { protocol: 'https', hostname: '**.espncdn.com' },
      { protocol: 'https', hostname: 'a.espncdn.com' },
      { protocol: 'https', hostname: '**.skysports.com' },
      { protocol: 'https', hostname: '**.365dm.com' },
      { protocol: 'https', hostname: 'crests.football-data.org' },
      { protocol: 'https', hostname: 'media.api-sports.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
    ],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/khobor/:slug', destination: '/news/:slug', permanent: true },
      { source: '/bisshokap', destination: '/world-cup', permanent: true },
      { source: '/result', destination: '/matches', permanent: true },
      { source: '/points-table', destination: '/standings', permanent: true },
      { source: '/en/khobor/:slug', destination: '/en/news/:slug', permanent: true },
      { source: '/en/bisshokap', destination: '/en/world-cup', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
