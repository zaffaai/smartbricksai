import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "cdn.smart-bricks.com" },
      { protocol: "https", hostname: "app.smart-bricks.com" },
    ],
  },
};

export default nextConfig;
