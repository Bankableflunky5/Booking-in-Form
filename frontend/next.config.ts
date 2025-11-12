import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Explicitly allow local dev origins (optional if using CORS properly in backend)
  allowedDevOrigins: ["", "", ""],

  // 👇 Fixes Turbopack workspace root warning
  turbopack: {
    root: __dirname,
  },

  // 👇 Optional: produces a clean, self-contained output build
  output: "standalone",
};

export default nextConfig;
