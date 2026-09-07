import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack
  turbopack: {
    rules: {
      // raw-loader emits JS — `as` must be a glob rename pattern (not "js").
      '*.ejs': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ejs$/,
      loader: 'raw-loader',
    });

    return config;
  },
};

export default nextConfig;