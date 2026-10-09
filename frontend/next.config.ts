import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone" — only needed for Docker/self-hosted, breaks Vercel
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
