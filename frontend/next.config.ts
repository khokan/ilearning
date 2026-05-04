import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   /* config options here */

  // better-auth proxy
  async rewrites() {
    return [
      {
        // Explicitly map auth requests
        source: "/api/auth/:path*",
        destination: process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
