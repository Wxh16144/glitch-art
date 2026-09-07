import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // https://nextjs.org/docs/app/api-reference/next-config-js/turbo#configuring-webpack-loaders
  experimental: {
    turbo: {
      rules: {
        '*.ejs': {
          loaders: ['raw-loader'],
          as: 'js',
        }
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
