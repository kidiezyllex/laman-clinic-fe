// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "utfs.io",
      "static.designboom.com",
      "res.cloudinary.com",
      "benhvienjw.vn",
      "https://ae49-2402-800-63a8-b5e6-3904-6982-4f1-ce0f.ngrok-free.app",
      "firebasestorage.googleapis.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
