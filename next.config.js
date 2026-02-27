/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Fix the dev warning (Next 15/16 expects it under "experimental")
  

  // ✅ Allow Unsplash images for next/image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;