/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.lukas-taido.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "cms.lukas-taido.com",
        pathname: "/documents/**",
      }
    ],
  },
};

module.exports = nextConfig;
