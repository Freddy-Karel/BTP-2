import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "vzsvrhjfvvtgmctxzhgy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "192.168.1.66",
    "192.168.1.67",
  ],
};

export default nextConfig;
