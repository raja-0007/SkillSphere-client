/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:false,
    images: {
    domains: ['localhost', '127.0.0.1', 'skillsphere-server.onrender.com'], // add your backend host
  },
}
module.exports = nextConfig;
