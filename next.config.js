/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'fqfllgkljnwxldmcarwo.supabase.co',
      'fqfllgkljnwxldmcarwo.supabase.in',
    ],
  },
};

module.exports = nextConfig;
