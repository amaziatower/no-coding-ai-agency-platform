const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withMDX = require('@next/mdx')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  experimental: {
    serverComponentsExternalPackages: ['pdf2json'],
    proxyTimeout: 1000 * 10000, // Setting timeout to 10000 seconds
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hpogngdwousevnyrnmew.supabase.co',
        pathname: '/storage/v1/object/public/users/**',
      },
    ],
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Exclude specific folder from being processed by webpack
    config.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((subRule) => {
          if (subRule.loader && subRule.loader.includes('babel-loader')) {
            subRule.exclude = "/copilot";
          }
        });
      }
    });

    return config;
  },
};

module.exports = async () => {
  const withNextIntl = createNextIntlPlugin();
  return withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
};
