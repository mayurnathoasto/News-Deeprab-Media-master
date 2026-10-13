/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
require('dotenv').config()

const apiImageDomains = Array.from(
  new Set(
    [process.env.NEXT_PUBLIC_API_URL, 'http://127.0.0.1:8000', 'http://localhost:8000']
      .map(url => {
        try {
          return new URL(url).hostname
        } catch {
          return null
        }
      })
      .filter(Boolean)
  )
)

const apiProxyDestination = process.env.SERVER_API_URL || 'http://127.0.0.1:8000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: apiImageDomains,
    unoptimized: true,
    dangerouslyAllowSVG: true
  },
  trailingSlash: false,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    if (process.env.NEXT_OUTPUT_EXPORT === 'true') {
      return []
    }
    return [
      {
        source: '/api_proxy/:path*',
        destination: `${apiProxyDestination}/:path*`
      }
    ]
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }
    return config
  }
}

// Conditionally set the output based on the environment
if (process.env.NEXT_OUTPUT_EXPORT === 'true') {
  (nextConfig.output = 'export'), (nextConfig.images.unoptimized = true)
}
// console.log(nextConfig)
module.exports = nextConfig
