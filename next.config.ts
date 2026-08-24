import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'export',
  trailingSlash: true,
  transpilePackages: [
    'recharts',
    'echarts',
    'zrender',
    'echarts-for-react',
    '@nivo/core',
    '@nivo/pie',
    '@nivo/bar',
    '@nivo/heatmap',
    '@nivo/radar',
    '@nivo/treemap',
    '@nivo/line',
  ],
};

export default nextConfig;
