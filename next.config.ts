import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://i.pinimg.com/736x/**'), new URL('https://i.pinimg.com/1200x/**'), new URL('https://ru.pinterest.com/pin/**')],
  }
};

export default nextConfig;
