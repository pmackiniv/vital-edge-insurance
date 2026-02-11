import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/medicare/ma-lead",
        destination: "/medicare/medicare-advantage-request",
        permanent: true,
      },
      {
        source: "/medicare/medigap-lead",
        destination: "/medicare/medigap-request",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
