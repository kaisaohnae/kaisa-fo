import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'export',
  trailingSlash: true,
  eslint: {
    // ESLint 에러를 무시하고 빌드 진행
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
