const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Suppress Node.js deprecation warnings in development
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [{ module: /node_modules/ }];
    }
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
