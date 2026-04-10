/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Necesario para que src/instrumentation.ts funcione (keep-alive anti-sleep)
  experimental: {
    instrumentationHook: true,
  },
}

export default nextConfig
