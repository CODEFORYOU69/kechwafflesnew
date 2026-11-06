import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@remotion/renderer", "@remotion/bundler", "remotion"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent webpack from bundling heavy Remotion packages — they are
      // called at runtime via dynamic imports and must stay external.
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
        "@remotion/renderer",
        "@remotion/bundler",
      ];
    }
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
