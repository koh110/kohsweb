const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export'
};

module.exports = withBundleAnalyzer(nextConfig)
