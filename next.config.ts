import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary CDN
      },
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com', // Fake Store API for product images
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // DiceBear for avatars
      },
      {
        protocol: 'https',
        hostname: 'api-tradeoff.onrender.com', // API server
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for versioned images
  },

  // Cache headers
  async headers() {
    // Development: Completely disable CSP for local testing with any API
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
            // Disable CSP in dev - allows testing with local APIs at any IP/port
            { key: 'X-Content-Type-Options', value: 'nosniff' },
          ],
        },
      ];
    }

    // Production security headers with strict CSP
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          
          // Content Security Policy (CSP) - Prevents XSS and injection attacks
          // Production: Strict whitelist, development: disabled for testing
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.sentry.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com data:",
              // PRODUCTION WHITELIST:
              // - api-tradeoff.onrender.com (your API)
              // - Add more production domains as needed
              `connect-src 'self' https: wss: ${
                process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).origin : 'https://api-tradeoff.onrender.com'
              }`,
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          
          // HSTS - Forces HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          
          // Permissions Policy (formerly Feature Policy)
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          
          // Cache control
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }, // 1 year
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Compression
  compress: true,

  // Production optimizations
  productionBrowserSourceMaps: false, // Reduce build size
  
  // React features
  reactStrictMode: true,

  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['@iconify/react', 'lucide-react'], // Tree-shake large libs
  },
};

export default nextConfig;
