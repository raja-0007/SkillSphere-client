/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    
    // Performance optimizations
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react', 'react-icons'],
    },
    
    // Image optimization
    images: {
        domains: ['localhost', '127.0.0.1', 'skillsphere-server.onrender.com'],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    
    // Compression
    compress: true,
    
    // Bundle analyzer (uncomment to analyze bundle size)
    // bundleAnalyzer: {
    //     enabled: process.env.ANALYZE === 'true',
    // },
    
    // Webpack optimizations
    webpack: (config, { dev, isServer }) => {
        // Production optimizations
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            }
        }
        
        return config
    },
    
    // Headers for caching
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
            {
                source: '/images/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
