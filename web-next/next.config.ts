import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Add support for Flutter web assets
  async rewrites() {
    return [
      // Serve Flutter app from public/flutter-assets
      {
        source: '/flutter-assets',
        destination: '/flutter-assets/index.html',
      },
      // Rewrite root to Flutter app
      {
        source: '/',
        destination: '/flutter-assets/index.html',
      },
      // Rewrite Flutter .env request to API route to bypass static file dotfile restriction
      {
        source: '/flutter-assets/assets/assets/.env',
        destination: '/api/flutter-env',
      },
      {
        source: '/flutter-assets/:path*',
        destination: '/flutter-assets/:path*',
      },
    ];
  },

  // Configure static file serving for Flutter assets
  async headers() {
    return [
      {
        source: '/flutter-assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, immutable',
          },
        ],
      },
    ];
  },

  // Enable experimental features for better Flutter integration
  experimental: {
    esmExternals: true,
  },

  // Configure Turbopack for Flutter assets (Next.js 16+)
  turbopack: {
    rules: {
      '*.wasm': {
        loaders: ['file-loader'],
        as: '*.wasm',
      },
    },
    resolveAlias: {
      // Add any aliases needed for Flutter integration
    },
  },
};

export default nextConfig;
