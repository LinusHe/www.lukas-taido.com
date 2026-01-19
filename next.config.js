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
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/documents/**",
      }
    ],
  },
};

module.exports = nextConfig;
