/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{domains:['lh3.googleusercontent.com', 'ncertgpt.s3.amazonaws.com']},
  basePath:'/talk',
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

export default nextConfig;
