/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: "120974085",
    NEXT_PUBLIC_ZEGO_SERVER_ID: "2c51f75f9134216c565587b145bea8d5",
  },
  images: {
    domains: ["lh3.googleusercontent.com", "localhost"],
  },
};

module.exports = nextConfig;
