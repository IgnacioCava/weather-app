/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: {
      displayName: true
    }
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
