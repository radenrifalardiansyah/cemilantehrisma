import type { NextConfig } from "next";

const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN ?? '';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async headers() {
    const corsHeaders = [
      { key: 'Access-Control-Allow-Origin',  value: ADMIN_ORIGIN || '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
      { key: 'Access-Control-Allow-Headers', value: 'Content-Type,x-admin-auth' },
    ];
    return [
      { source: '/api/admin/:path*',   headers: corsHeaders },
      { source: '/api/invoice/:path*', headers: corsHeaders },
    ];
  },
};

export default nextConfig;
