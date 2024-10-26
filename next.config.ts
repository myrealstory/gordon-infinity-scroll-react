import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['cdn.dummyjson.com'],
    // loader: "custom",
    // loaderFile: "./src/loader/image.js",
  },
  output: 'export'
};

export default nextConfig;
