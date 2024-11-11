import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */

  // https://nextjs.org/docs/app/api-reference/next-config-js/turbo#configuring-webpack-loaders
  experimental: {
    turbo: {
      rules: {
        '*.art': {
          loaders: ['raw-loader'],
          as: 'js',
        }
      },
    },
  },
  webpack: (config) => {
    // https://github.com/vercel/next.js/discussions/52593
    config.resolve.alias['art-template'] = path.resolve(
      __dirname,
      'node_modules/art-template/lib/index.js'
    );

    config.module.rules.push({
      test: /\.art$/,
      loader: 'raw-loader',
    });

    return config;
  },
};

export default nextConfig;
