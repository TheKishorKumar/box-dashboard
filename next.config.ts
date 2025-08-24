import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: __dirname,
  // Uncomment the line below if you want static export instead of SSR
  // output: 'export',
};

export default nextConfig;
