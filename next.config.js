/** @type {import('next').NextConfig} */

const proxy = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API + '/:path*/',
      },
    ];
  },
};

module.exports = {
  ...proxy,
};
