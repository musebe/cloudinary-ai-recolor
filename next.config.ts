import type { NextConfig } from "next";

/**
 * Allow next/image to optimise Cloudinary URLs.
 * NOTE – change `demo-cloud` to your cloud name if you prefer
 * reading from env inside the config is OK with Next 15.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
      },
    ],
  },
};

export default nextConfig;