import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone" — only needed for Docker/self-hosted, breaks Vercel
  turbopack: {
    root: __dirname,
  },
  env: {
    // Ensure the backend URL is always available even if Vercel env var is missing
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "https://anvyra.onrender.com/api",
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
