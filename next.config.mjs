/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'tozfdflaxthbggaenfse.supabase.co' },
    ],
  },
};

export default nextConfig;
