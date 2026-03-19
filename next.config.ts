import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    domains: [
      "picsum.photos",
      "i.pravatar.cc",
    ],
  },
};

export default nextConfig;
