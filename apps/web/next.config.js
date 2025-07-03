/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@yourcompanyofone/types', '@yourcompanyofone/shared'],
}

module.exports = nextConfig 