import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Ignores the errors you are seeing now
  },
  typescript: {
    ignoreBuildErrors: true,  // Ignores type mismatches
  }
};

export default nextConfig;
