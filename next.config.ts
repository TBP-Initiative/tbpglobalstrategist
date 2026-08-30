import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@sparticuz/chromium"],
  allowedDevOrigins: ["127.0.0.1", "localhost", "10.209.215.9"],
};

export default nextConfig;
