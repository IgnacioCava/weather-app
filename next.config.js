/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: {
      displayName: true
    }
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  async redirects(){
    return [
      {
        source: '/',
        destination: '/weather',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
