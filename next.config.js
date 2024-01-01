/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["m.media-amazon.com", "res.cloudinary.com", "t4.ftcdn.net"],
  },
  // swcMinify: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/",
  //       permanent: true,
  //     },
  //     {
  //       source: "/dashboard",
  //       destination: "/dashboard",
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
