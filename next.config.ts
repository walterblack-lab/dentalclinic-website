import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the demo needs no server. Deploys to any static host (Vercel, Netlify, S3…).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
