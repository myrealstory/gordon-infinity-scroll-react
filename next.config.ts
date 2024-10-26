import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['cdn.dummyjson.com'],
    // loader: "custom",
    // loaderFile: "./src/loader/image.js",
  },
};

export default nextConfig;
