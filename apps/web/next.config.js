/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations for HFT applications
  experimental: {
    // Enable React 18 concurrent features
    appDir: true,
    // Optimize for high-frequency updates
    optimizePackageImports: ['ag-grid-react', 'ag-grid-community', 'ag-grid-enterprise'],
    // Enable Web Workers
    webWorkers: true
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize for production builds
    if (!dev && !isServer) {
      // Enable aggressive code splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate AG Grid into its own chunk
            agGrid: {
              test: /[/\\]node_modules[/\\](ag-grid|@ag-grid)/,
              name: 'ag-grid',
              chunks: 'all',
              priority: 10
            },
            // Separate trading utilities
            trading: {
              test: /[/\\]src[/\\](stores|services|workers)[/\\]/,
              name: 'trading',
              chunks: 'all',
              priority: 5
            },
            // Default vendor chunk
            vendor: {
              test: /[/\\]node_modules[/\\]/,
              name: 'vendors',
              chunks: 'all',
              priority: 1
            }
          }
        }
      };
      
      // Enable tree shaking for AG Grid
      config.resolve.alias = {
        ...config.resolve.alias,
        // Optimize AG Grid imports
        'ag-grid-community$': 'ag-grid-community/dist/ag-grid-community.min.js',
        'ag-grid-enterprise$': 'ag-grid-enterprise/dist/ag-grid-enterprise.min.js'
      };
    }
    
    // Web Worker support is built-in to Next.js 14+
    // No additional webpack configuration needed for workers using new Worker(new URL(...))
    // The modern approach with import.meta.url is natively supported
    
    return config;
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },
  
  // Image optimization
  images: {
    // Optimize images for performance
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Performance headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Special headers for WebSocket connections
        source: '/api/ws',
        headers: [
          {
            key: 'Connection',
            value: 'Upgrade'
          },
          {
            key: 'Upgrade',
            value: 'websocket'
          }
        ]
      }
    ];
  },
  
  // Redirects for clean URLs
  async redirects() {
    return [
      {
        source: '/trading',
        destination: '/',
        permanent: true
      }
    ];
  },
  
  // Environment variables
  env: {
    // HFT-specific environment variables
    HFT_MODE: process.env.HFT_MODE || 'true',
    WS_URL: process.env.WS_URL || 'ws://localhost:8080/trading',
    ENABLE_PERFORMANCE_MONITORING: process.env.ENABLE_PERFORMANCE_MONITORING || 'true',
    MAX_RENDER_TIME_MS: process.env.MAX_RENDER_TIME_MS || '16',
    MIN_FPS: process.env.MIN_FPS || '30',
    MAX_LATENCY_MS: process.env.MAX_LATENCY_MS || '100'
  },
  
  // Output configuration
  output: 'standalone',
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Generate ETags for better caching
  generateEtags: true,
  
  // React strict mode for development
  reactStrictMode: true,
  
  // SWC minification for better performance
  swcMinify: true,
  
  // TypeScript configuration
  typescript: {
    // Type checking in production builds
    ignoreBuildErrors: false
  },
  
  // ESLint configuration
  eslint: {
    // Run ESLint during builds
    ignoreDuringBuilds: false,
    dirs: ['src', 'pages', 'components', 'lib', 'utils']
  },
  
  // Transpile packages for better tree shaking
  transpilePackages: [
    'ag-grid-react',
    'ag-grid-community',
    'ag-grid-enterprise',
    'zustand',
    'immer'
  ]
};

module.exports = nextConfig;
