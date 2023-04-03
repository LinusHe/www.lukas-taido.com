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
    ],
  },
};

module.exports = nextConfig;
